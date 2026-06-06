const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.join(__dirname, "..");
const inputPath = path.join(projectRoot, "tmp", "imagegen", "db-missing-covers.jsonl");
const outputDir = path.join(projectRoot, "tmp", "imagegen", "db-cover-batch-out");

function readJobs() {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Missing batch input: ${inputPath}`);
  }
  return fs
    .readFileSync(inputPath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function isPng(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const buffer = fs.readFileSync(filePath);
  return buffer.length >= 24 && buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
}

function main() {
  const jobs = readJobs();
  const copied = [];
  const missing = [];

  for (const job of jobs) {
    const targetPath = path.resolve(String(job.out));
    const sourcePath = path.join(outputDir, path.basename(targetPath));
    if (!isPng(sourcePath)) {
      missing.push({
        slug: job.slug,
        source: path.relative(projectRoot, sourcePath).replace(/\\/g, "/")
      });
      continue;
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
    copied.push({
      slug: job.slug,
      from: path.relative(projectRoot, sourcePath).replace(/\\/g, "/"),
      to: path.relative(projectRoot, targetPath).replace(/\\/g, "/")
    });
  }

  console.log(
    JSON.stringify(
      {
        jobs: jobs.length,
        copied: copied.length,
        missing: missing.length,
        copiedItems: copied,
        missingItems: missing
      },
      null,
      2
    )
  );

  if (missing.length > 0) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
