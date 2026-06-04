const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.join(__dirname, "..");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseArgs(argv) {
  const args = {
    input: "",
    slug: "",
    status: "",
    featured: false,
    skipWriteSource: false,
    skipEnrich: false,
    skipDocx: false,
    skipImport: false,
    dryRun: false,
    payPerEpisodeEpisodes: [4, 5, 6],
    revenueShareStart: 4,
    revenueShareEnd: 10
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === "--input") {
      args.input = argv[index + 1] || "";
      index += 1;
    } else if (current === "--slug") {
      args.slug = argv[index + 1] || "";
      index += 1;
    } else if (current === "--status") {
      args.status = argv[index + 1] || "";
      index += 1;
    } else if (current === "--featured") {
      args.featured = true;
    } else if (current === "--skip-write-source") {
      args.skipWriteSource = true;
    } else if (current === "--skip-enrich") {
      args.skipEnrich = true;
    } else if (current === "--skip-docx") {
      args.skipDocx = true;
    } else if (current === "--skip-import") {
      args.skipImport = true;
    } else if (current === "--dry-run") {
      args.dryRun = true;
    } else if (current === "--pay-episodes") {
      args.payPerEpisodeEpisodes = String(argv[index + 1] || "")
        .split(/[,，\s]+/)
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value));
      index += 1;
    } else if (current === "--revenue-start") {
      args.revenueShareStart = Number(argv[index + 1]);
      index += 1;
    } else if (current === "--revenue-end") {
      args.revenueShareEnd = Number(argv[index + 1]);
      index += 1;
    }
  }

  return args;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function relativePath(filePath) {
  return path.relative(projectRoot, filePath).replace(/\\/g, "/");
}

function resolveInput(inputPath) {
  if (!inputPath) return {};
  const absoluteInputPath = path.resolve(projectRoot, inputPath);
  assert(fs.existsSync(absoluteInputPath), `Input file not found: ${absoluteInputPath}`);
  return {
    path: absoluteInputPath,
    data: readJson(absoluteInputPath)
  };
}

function normalizeStatus(args, inputData) {
  const status = args.status || inputData.status || inputData.publishStatus || "published";
  assert(["draft", "published", "archived"].includes(status), "--status must be draft, published, or archived");
  return status;
}

function normalizeSlug(args, inputData) {
  const master = inputData.master || inputData.contentSource?.master || {};
  const slug = args.slug || inputData.slug || master.slug || "";
  assert(slug, "A slug is required. Pass --slug or include slug/master.slug in the input JSON.");
  assert(slugPattern.test(slug), `Slug must use lowercase letters, numbers, and hyphens: ${slug}`);
  return slug;
}

function normalizeEpisodes(inputData) {
  return inputData.episodes || inputData.contentSource?.episodes || [];
}

function normalizeMaster(inputData) {
  return inputData.master || inputData.contentSource?.master || null;
}

function validateSourcePayload(slug, master, episodes) {
  assert(master && typeof master === "object", "Input JSON must include master when writing content-source.");
  assert(master.slug === slug, `master.slug ${master.slug} does not match slug ${slug}`);
  assert(Array.isArray(episodes) && episodes.length > 0, "Input JSON must include a non-empty episodes array.");

  const requiredMasterFields = ["logline", "synopsis", "category", "recommendedPlatforms", "audienceTags"];
  requiredMasterFields.forEach((fieldName) => {
    assert(master[fieldName] !== undefined, `master.${fieldName} is required`);
  });

  episodes.forEach((episode, index) => {
    assert(Number.isInteger(episode.episodeNumber), `episodes[${index}].episodeNumber must be an integer`);
    ["title", "hook", "summary", "endingHook"].forEach((fieldName) => {
      assert(String(episode[fieldName] || "").trim(), `episodes[${index}].${fieldName} is required`);
    });
  });
}

function writeContentSource(slug, master, episodes, inputInfo) {
  const baseDir = path.join(projectRoot, "content-source", slug);
  const episodesDir = path.join(baseDir, "episodes");
  writeJson(path.join(baseDir, "master.json"), master);
  episodes.forEach((episode) => {
    const episodeFileName = `episode-${String(episode.episodeNumber).padStart(3, "0")}.json`;
    writeJson(path.join(episodesDir, episodeFileName), episode);
  });

  if (inputInfo?.data) {
    writeJson(path.join(baseDir, "automation-brief.json"), inputInfo.data);
  }

  return {
    contentSourceDir: relativePath(baseDir),
    masterPath: relativePath(path.join(baseDir, "master.json")),
    episodeFiles: episodes.length
  };
}

function commandToString(command, args) {
  return [command, ...args].join(" ");
}

function runCommand(command, args, options = {}) {
  const label = options.label || commandToString(command, args);
  if (options.dryRun) {
    return {
      label,
      command: commandToString(command, args),
      skipped: true,
      reason: "dry-run"
    };
  }

  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    shell: false
  });

  if (result.status !== 0) {
    const error = new Error(`Command failed: ${label}`);
    error.command = commandToString(command, args);
    error.stdout = result.stdout;
    error.stderr = result.stderr;
    throw error;
  }

  return {
    label,
    command: commandToString(command, args),
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim()
  };
}

function compactEpisodeScope(numbers) {
  const sorted = Array.from(new Set(numbers)).sort((a, b) => a - b);
  if (!sorted.length) return "continuation";

  const ranges = [];
  let start = sorted[0];
  let previous = sorted[0];

  for (let index = 1; index <= sorted.length; index += 1) {
    const current = sorted[index];
    if (current === previous + 1) {
      previous = current;
      continue;
    }

    ranges.push(start === previous ? String(start) : `${start}-${previous}`);
    start = current;
    previous = current;
  }

  return ranges.join("-");
}

function plannedOutputs(slug, args) {
  return {
    scriptData: `scripts-data/${slug}.json`,
    freePreview: `downloads/${slug}/free-preview-${slug}-v1.docx`,
    buyout: `downloads/${slug}/deliveries/buyout-full-package-v1.docx`,
    payPerEpisode: `downloads/${slug}/deliveries/episodes-${compactEpisodeScope(args.payPerEpisodeEpisodes)}-package-v1.docx`,
    revenueShare: `downloads/${slug}/deliveries/revenue-share-episodes-${args.revenueShareStart}-${args.revenueShareEnd}-package-v1.docx`
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputInfo = resolveInput(args.input);
  const inputData = inputInfo.data || {};
  const slug = normalizeSlug(args, inputData);
  const status = normalizeStatus(args, inputData);
  const master = normalizeMaster(inputData);
  const episodes = normalizeEpisodes(inputData);
  const sourceDir = path.join(projectRoot, "content-source", slug);
  const operations = [];
  let sourceWrite = null;

  if (!args.skipWriteSource && master) {
    validateSourcePayload(slug, master, episodes);
    if (!args.dryRun) {
      sourceWrite = writeContentSource(slug, master, episodes, inputInfo);
    } else {
      sourceWrite = {
        contentSourceDir: `content-source/${slug}`,
        masterPath: `content-source/${slug}/master.json`,
        episodeFiles: episodes.length,
        skipped: true
      };
    }
  } else {
    assert(fs.existsSync(path.join(sourceDir, "master.json")), `content-source master not found: ${path.join(sourceDir, "master.json")}`);
  }

  operations.push(
    runCommand("node", ["scripts/enrich-production-script-content.js", slug], {
      dryRun: args.dryRun || args.skipEnrich,
      label: "enrich content-source"
    })
  );

  operations.push(
    runCommand(
      "node",
      [
        "scripts/build-script-data-from-source.js",
        "--slug",
        slug,
        "--status",
        status,
        ...(args.featured ? ["--featured"] : [])
      ],
      {
        dryRun: args.dryRun,
        label: "build scripts-data"
      }
    )
  );

  if (!args.skipDocx) {
    operations.push(
      runCommand("node", ["scripts/generate-docx-deliveries.js", "--type", "free_preview", "--slug", slug, "--update-assets"], {
        dryRun: args.dryRun,
        label: "generate free preview DOCX"
      })
    );
    operations.push(
      runCommand("node", ["scripts/generate-docx-deliveries.js", "--type", "buyout", "--slug", slug], {
        dryRun: args.dryRun,
        label: "generate buyout DOCX"
      })
    );
    operations.push(
      runCommand(
        "node",
        [
          "scripts/generate-docx-deliveries.js",
          "--type",
          "pay_per_episode",
          "--slug",
          slug,
          "--episodes",
          args.payPerEpisodeEpisodes.join(",")
        ],
        {
          dryRun: args.dryRun,
          label: "generate pay-per-episode DOCX"
        }
      )
    );
    operations.push(
      runCommand(
        "node",
        [
          "scripts/generate-docx-deliveries.js",
          "--type",
          "revenue_share",
          "--slug",
          slug,
          "--episode-start",
          String(args.revenueShareStart),
          "--episode-end",
          String(args.revenueShareEnd)
        ],
        {
          dryRun: args.dryRun,
          label: "generate revenue-share DOCX"
        }
      )
    );
  }

  if (!args.skipImport) {
    operations.push(
      runCommand("node", ["scripts/import-script-data.js", `scripts-data/${slug}.json`], {
        dryRun: args.dryRun,
        label: "import scripts-data into database"
      })
    );
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        slug,
        status,
        input: inputInfo.path ? relativePath(inputInfo.path) : null,
        sourceWrite,
        outputs: plannedOutputs(slug, args),
        operations
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error.message,
        command: error.command,
        stdout: error.stdout,
        stderr: error.stderr
      },
      null,
      2
    )
  );
  process.exit(1);
});
