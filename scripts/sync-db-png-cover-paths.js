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

function hasPngFile(coverImage) {
  const filePath = path.join(projectRoot, "public", "site", coverImage);
  if (!fs.existsSync(filePath)) return false;
  const buffer = fs.readFileSync(filePath);
  return buffer.length >= 24 && buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
}

async function main() {
  const scripts = await prisma.script.findMany({
    where: { status: "published" },
    select: {
      id: true,
      slug: true,
      coverImage: true
    },
    orderBy: { slug: "asc" }
  });

  const updated = [];
  const skipped = [];

  for (const script of scripts) {
    const expected = expectedCoverImage(script);
    if (script.coverImage === expected) continue;
    if (!hasPngFile(expected)) {
      skipped.push({ slug: script.slug, expectedCoverImage: expected });
      continue;
    }

    await prisma.script.update({
      where: { id: script.id },
      data: { coverImage: expected }
    });
    updated.push({ slug: script.slug, from: script.coverImage, to: expected });
  }

  console.log(
    JSON.stringify(
      {
        publishedScripts: scripts.length,
        updated: updated.length,
        skipped: skipped.length,
        updates: updated,
        skipped
      },
      null,
      2
    )
  );

  if (skipped.length > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
