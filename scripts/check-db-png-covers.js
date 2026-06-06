const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const projectRoot = path.join(__dirname, "..");

function expectedCoverImage(script) {
  const existing = String(script.coverImage || "").trim();
  if (/\.png$/i.test(existing)) return existing;
  if (existing) return existing.replace(/\.(svg|jpg|jpeg|webp)$/i, ".png");
  return `assets/covers/cover-${script.slug}.png`;
}

function readPngSize(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const buffer = fs.readFileSync(filePath);
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    return null;
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

async function main() {
  const scripts = await prisma.script.findMany({
    where: { status: "published" },
    select: {
      slug: true,
      title: true,
      coverImage: true
    },
    orderBy: { slug: "asc" }
  });

  const items = scripts.map((script) => {
    const expected = expectedCoverImage(script);
    const filePath = path.join(projectRoot, "public", "site", expected);
    const size = readPngSize(filePath);
    return {
      slug: script.slug,
      title: script.title,
      coverImage: script.coverImage,
      expectedCoverImage: expected,
      exists: Boolean(size),
      width: size?.width || null,
      height: size?.height || null,
      pathNeedsSync: script.coverImage !== expected
    };
  });

  const missing = items.filter((item) => !item.exists);
  const needsSync = items.filter((item) => item.pathNeedsSync);

  console.log(
    JSON.stringify(
      {
        publishedScripts: scripts.length,
        readyPng: items.length - missing.length,
        missingPng: missing.length,
        pathNeedsSync: needsSync.length,
        missing: missing.map((item) => ({
          slug: item.slug,
          title: item.title,
          expectedCoverImage: item.expectedCoverImage
        })),
        needsSync: needsSync.map((item) => ({
          slug: item.slug,
          from: item.coverImage,
          to: item.expectedCoverImage
        }))
      },
      null,
      2
    )
  );

  if (missing.length > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
