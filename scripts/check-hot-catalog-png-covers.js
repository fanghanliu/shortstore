const fs = require("node:fs");
const path = require("node:path");
const { catalogItems } = require("./generate-hot-script-catalog");

const projectRoot = path.join(__dirname, "..");

function readPngSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function main() {
  const items = catalogItems();
  const checked = items.map((item) => {
    const filePath = path.join(projectRoot, "public", "site", item.coverImage);
    const exists = fs.existsSync(filePath);
    const stat = exists ? fs.statSync(filePath) : null;
    const size = exists ? readPngSize(filePath) : null;
    const aspectRatio = size ? size.width / size.height : null;
    const isNineBySixteen = aspectRatio ? Math.abs(aspectRatio - 9 / 16) < 0.04 : false;

    return {
      slug: item.slug,
      title: item.title,
      coverImage: item.coverImage,
      outputPath: path.relative(projectRoot, filePath).replace(/\\/g, "/"),
      exists,
      bytes: stat?.size || 0,
      width: size?.width || null,
      height: size?.height || null,
      isNineBySixteen
    };
  });

  const missing = checked.filter((item) => !item.exists);
  const invalid = checked.filter((item) => item.exists && !item.isNineBySixteen);

  console.log(
    JSON.stringify(
      {
        total: checked.length,
        ready: checked.length - missing.length - invalid.length,
        missing: missing.length,
        invalid: invalid.length,
        missingItems: missing.map((item) => ({
          slug: item.slug,
          title: item.title,
          expectedPath: item.outputPath
        })),
        invalidItems: invalid.map((item) => ({
          slug: item.slug,
          title: item.title,
          width: item.width,
          height: item.height,
          path: item.outputPath
        }))
      },
      null,
      2
    )
  );

  if (missing.length || invalid.length) {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
