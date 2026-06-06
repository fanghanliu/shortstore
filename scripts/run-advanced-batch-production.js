const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { validateAdvancedPayload } = require("./lib/advanced-production-template");

const projectRoot = path.join(__dirname, "..");

function parseArgs(argv) {
  const args = {
    inputs: [],
    inputDir: "",
    prefix: "generated-",
    dryRun: false,
    validateOnly: false,
    continueOnError: true,
    manifest: "",
    compact: false,
    summaryOnly: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === "--input") {
      args.inputs.push(argv[index + 1] || "");
      index += 1;
    } else if (current === "--input-dir") {
      args.inputDir = argv[index + 1] || "";
      index += 1;
    } else if (current === "--prefix") {
      args.prefix = argv[index + 1] || args.prefix;
      index += 1;
    } else if (current === "--dry-run") {
      args.dryRun = true;
    } else if (current === "--validate-only") {
      args.validateOnly = true;
    } else if (current === "--stop-on-error") {
      args.continueOnError = false;
    } else if (current === "--manifest") {
      args.manifest = argv[index + 1] || "";
      index += 1;
    } else if (current === "--compact") {
      args.compact = true;
    } else if (current === "--summary-only") {
      args.summaryOnly = true;
    }
  }

  return args;
}

function toProjectRelative(absolutePath) {
  return path.relative(projectRoot, absolutePath).replace(/\\/g, "/");
}

function collectInputs(args) {
  const inputs = args.inputs.map((input) => path.resolve(projectRoot, input));

  if (args.inputDir) {
    const absoluteDir = path.resolve(projectRoot, args.inputDir);
    const files = fs
      .readdirSync(absoluteDir)
      .filter((fileName) => fileName.startsWith(args.prefix) && fileName.endsWith(".json"))
      .filter((fileName) => !/manifest|summary|report|dry-run|validate|production/i.test(fileName))
      .map((fileName) => path.join(absoluteDir, fileName));
    inputs.push(...files);
  }

  return Array.from(new Set(inputs)).sort((a, b) => a.localeCompare(b, "en"));
}

function readJson(inputPath) {
  return JSON.parse(fs.readFileSync(inputPath, "utf8"));
}

function runProduction(inputPath, args) {
  const relativeInput = toProjectRelative(inputPath);
  const commandArgs = ["scripts/run-daily-script-production.js", "--input", relativeInput];
  if (args.dryRun) commandArgs.push("--dry-run");

  const result = spawnSync("node", commandArgs, {
    cwd: projectRoot,
    encoding: "utf8",
    shell: false
  });

  const output = {
    command: ["node", ...commandArgs].join(" "),
    status: result.status
  };

  if (!args.compact) {
    output.stdout = result.stdout.trim();
    output.stderr = result.stderr.trim();
  } else {
    output.stdoutPreview = result.stdout.trim().slice(0, 500);
    output.stderrPreview = result.stderr.trim().slice(0, 500);
  }

  return output;
}

function writeManifest(args, summary) {
  if (!args.manifest) return null;
  const manifestPath = path.resolve(projectRoot, args.manifest);
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  return toProjectRelative(manifestPath);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputs = collectInputs(args);
  if (!inputs.length) {
    throw new Error("Pass --input file.json or --input-dir automation-briefs");
  }

  const results = [];

  for (const inputPath of inputs) {
    const input = toProjectRelative(inputPath);
    try {
      const payload = readJson(inputPath);
      const validation = validateAdvancedPayload(payload);
      const production = args.validateOnly ? null : runProduction(inputPath, args);
      const ok = production ? production.status === 0 : true;

      results.push({
        input,
        ok,
        validation,
        production
      });

      if (!ok && !args.continueOnError) break;
    } catch (error) {
      results.push({
        input,
        ok: false,
        error: error.message,
        issues: error.issues || []
      });

      if (!args.continueOnError) break;
    }
  }

  const summary = {
    ok: results.every((item) => item.ok),
    dryRun: args.dryRun,
    validateOnly: args.validateOnly,
    checked: results.length,
    passed: results.filter((item) => item.ok).length,
    failed: results.filter((item) => !item.ok).length,
    results
  };

  const manifest = writeManifest(args, summary);
  const output = { ...summary, manifest };
  if (args.summaryOnly) {
    console.log(
      JSON.stringify(
        {
          ok: output.ok,
          dryRun: output.dryRun,
          validateOnly: output.validateOnly,
          checked: output.checked,
          passed: output.passed,
          failed: output.failed,
          manifest: output.manifest
        },
        null,
        2
      )
    );
  } else {
    console.log(JSON.stringify(output, null, 2));
  }
  if (!summary.ok) process.exit(1);
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
}
