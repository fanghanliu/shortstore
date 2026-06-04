const fs = require("node:fs");
const path = require("node:path");
const { catalogItems } = require("./generate-hot-script-catalog");

const projectRoot = path.join(__dirname, "..");
const generatedImagesDir = path.join(process.env.USERPROFILE || "", ".codex", "generated_images");

function listGeneratedImages(dirPath) {
  if (!fs.existsSync(dirPath)) return [];

  const entries = [];
  for (const item of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      entries.push(...listGeneratedImages(fullPath));
    } else if (/\.(png|jpg|jpeg|webp)$/i.test(item.name)) {
      const stat = fs.statSync(fullPath);
      entries.push({ fullPath, mtimeMs: stat.mtimeMs });
    }
  }
  return entries;
}

function main() {
  const slug = process.argv[2];
  if (!slug) {
    throw new Error("Usage: node scripts/copy-latest-generated-cover.js <slug>");
  }

  const item = catalogItems().find((candidate) => candidate.slug === slug);
  if (!item) {
    throw new Error(`Unknown script slug: ${slug}`);
  }

  const latest = listGeneratedImages(generatedImagesDir).sort((a, b) => b.mtimeMs - a.mtimeMs)[0];
  if (!latest) {
    throw new Error(`No generated images found under ${generatedImagesDir}`);
  }

  const outputPath = path.join(projectRoot, "public", "site", item.coverImage);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.copyFileSync(latest.fullPath, outputPath);

  const stat = fs.statSync(outputPath);
  console.log(
    JSON.stringify(
      {
        slug,
        source: latest.fullPath,
        output: path.relative(projectRoot, outputPath).replace(/\\/g, "/"),
        bytes: stat.size
      },
      null,
      2
    )
  );
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
