const fs = require("node:fs");
const path = require("node:path");
const { validateAdvancedPayload } = require("./lib/advanced-production-template");

const projectRoot = path.join(__dirname, "..");

function parseArgs(argv) {
  const args = {
    inputs: [],
    minSummaryChars: 240,
    minScriptTextChars: 450,
    minPanels: 9,
    minShots: 8
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === "--input") {
      args.inputs.push(argv[index + 1] || "");
      index += 1;
    } else if (current === "--min-summary-chars") {
      args.minSummaryChars = Number(argv[index + 1]);
      index += 1;
    } else if (current === "--min-script-text-chars") {
      args.minScriptTextChars = Number(argv[index + 1]);
      index += 1;
    } else if (current === "--min-panels") {
      args.minPanels = Number(argv[index + 1]);
      index += 1;
    } else if (current === "--min-shots") {
      args.minShots = Number(argv[index + 1]);
      index += 1;
    }
  }

  return args;
}

function readJson(inputPath) {
  const absolutePath = path.resolve(projectRoot, inputPath);
  return {
    input: path.relative(projectRoot, absolutePath).replace(/\\/g, "/"),
    data: JSON.parse(fs.readFileSync(absolutePath, "utf8"))
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.inputs.length) {
    throw new Error("Pass at least one --input automation-briefs/generated-xxx.json");
  }

  const results = args.inputs.map((inputPath) => {
    const { input, data } = readJson(inputPath);
    return {
      input,
      ...validateAdvancedPayload(data, {
        minSummaryChars: args.minSummaryChars,
        minScriptTextChars: args.minScriptTextChars,
        minPanels: args.minPanels,
        minShots: args.minShots
      })
    };
  });

  console.log(JSON.stringify({ ok: true, checked: results.length, results }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error.message,
        issues: error.issues || []
      },
      null,
      2
    )
  );
  process.exit(1);
}
