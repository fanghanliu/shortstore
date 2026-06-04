const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.join(__dirname, "..");
const ignoredDirs = new Set([".git", "node_modules", "deploy-test-site"]);
const checkedExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".prisma"]);
const mojibakePatterns = [
  /\uFFFD/,
  /鍓/,
  /鐭/,
  /璇/,
  /鎴/,
  /绗/,
  /脳/,
  /鈫/,
  /銆/,
  /鉁/,
  /鐧诲/,
  /娉ㄥ/,
  /鍏嶈/,
  /涓嬭/,
  /鎻愪/,
  /鍚庣/,
  /棣栭/,
  /鏃犳/,
  /€/
];

function shouldCheck(filePath) {
  if (path.basename(filePath) === "check-text-encoding.js") {
    return false;
  }

  return checkedExtensions.has(path.extname(filePath));
}

function walk(dirPath, files = []) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        walk(path.join(dirPath, entry.name), files);
      }
      continue;
    }

    const filePath = path.join(dirPath, entry.name);
    if (shouldCheck(filePath)) {
      files.push(filePath);
    }
  }

  return files;
}

function findEncodingIssues(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const issues = [];

  lines.forEach((line, index) => {
    const matched = mojibakePatterns.find((pattern) => pattern.test(line));
    if (matched) {
      issues.push({
        line: index + 1,
        pattern: String(matched),
        text: line.trim().slice(0, 160)
      });
    }
  });

  return issues;
}

const results = [];

for (const filePath of walk(rootDir)) {
  const issues = findEncodingIssues(filePath);
  if (issues.length) {
    results.push({
      file: path.relative(rootDir, filePath),
      issues
    });
  }
}

if (results.length) {
  console.error("Possible mojibake or replacement characters found:");
  for (const result of results) {
    console.error(`\n${result.file}`);
    result.issues.slice(0, 8).forEach((issue) => {
      console.error(`  ${issue.line}: ${issue.text}`);
    });
  }
  process.exit(1);
}

console.log("Text encoding check passed");
