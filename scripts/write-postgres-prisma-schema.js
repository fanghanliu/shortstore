const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.join(__dirname, "..");
const sourcePath = path.join(projectRoot, "prisma", "schema.prisma");
const outputPath = path.join(projectRoot, "prisma", "schema.postgresql.prisma");

const source = fs.readFileSync(sourcePath, "utf8");
const output = source.replace('provider = "sqlite"', 'provider = "postgresql"');

if (output === source) {
  throw new Error('Could not replace Prisma datasource provider "sqlite" with "postgresql"');
}

fs.writeFileSync(outputPath, output, "utf8");
console.log(`Wrote ${path.relative(projectRoot, outputPath)}`);
