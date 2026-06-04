const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const projectRoot = path.join(__dirname, "..");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isRemotePath(filePath) {
  return /^https?:\/\//i.test(filePath);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertText(value, fieldName) {
  assert(typeof value === "string" && value.trim().length > 0, `${fieldName} is required`);
}

function validateBilingualPrompt(episode, fieldPrefix) {
  assertText(episode.aiPromptZh, `${fieldPrefix}.aiPromptZh`);
  assertText(episode.aiPromptEn, `${fieldPrefix}.aiPromptEn`);
}

function validateImportData(data, sourcePath) {
  const script = data.script || {};
  const episodes = data.episodes || [];
  const assets = data.assets || [];
  const continuationOptions = data.continuationOptions || [];

  assertText(script.slug, "script.slug");
  assert(slugPattern.test(script.slug), `script.slug must use lowercase letters, numbers, and hyphens: ${script.slug}`);
  assertText(script.title, "script.title");
  assertText(script.logline, "script.logline");
  assertText(script.synopsis, "script.synopsis");
  assertText(script.category, "script.category");
  assert(["draft", "published", "archived"].includes(script.status), "script.status must be draft, published, or archived");
  assert(Array.isArray(script.recommendedPlatforms), "script.recommendedPlatforms must be an array");
  assert(Array.isArray(script.audienceTags), "script.audienceTags must be an array");
  assert(Array.isArray(episodes), "episodes must be an array");
  assert(Array.isArray(assets), "assets must be an array");
  assert(Array.isArray(continuationOptions), "continuationOptions must be an array");

  episodes.forEach((episode, index) => {
    assert(Number.isInteger(episode.episodeNumber), `episodes[${index}].episodeNumber must be an integer`);
    assertText(episode.title, `episodes[${index}].title`);
    assertText(episode.hook, `episodes[${index}].hook`);
    assertText(episode.summary, `episodes[${index}].summary`);
    assertText(episode.endingHook, `episodes[${index}].endingHook`);
    assert(["draft", "published"].includes(episode.status), `episodes[${index}].status must be draft or published`);

    if (episode.isFreePreview && episode.status === "published") {
      validateBilingualPrompt(episode, `episodes[${index}]`);
    }
  });

  assets.forEach((asset, index) => {
    assertText(asset.id, `assets[${index}].id`);
    assertText(asset.assetType, `assets[${index}].assetType`);
    assertText(asset.title, `assets[${index}].title`);
    assertText(asset.version, `assets[${index}].version`);
    assertText(asset.filePath, `assets[${index}].filePath`);
    assertText(asset.fileFormat, `assets[${index}].fileFormat`);
    assert(["draft", "published", "archived"].includes(asset.status), `assets[${index}].status must be draft, published, or archived`);

    if (asset.status !== "draft" && !isRemotePath(asset.filePath)) {
      const absoluteFilePath = path.join(projectRoot, asset.filePath);
      assert(fs.existsSync(absoluteFilePath), `assets[${index}].filePath does not exist: ${asset.filePath}`);
    }
  });

  continuationOptions.forEach((option, index) => {
    assert(["buyout", "pay_per_episode", "revenue_share"].includes(option.type), `continuationOptions[${index}].type is invalid`);
    assertText(option.title, `continuationOptions[${index}].title`);
    assertText(option.description, `continuationOptions[${index}].description`);
    assert(Number.isInteger(option.sortOrder), `continuationOptions[${index}].sortOrder must be an integer`);
  });

  if (script.status === "published") {
    const freeEpisodes = episodes.filter((episode) => episode.isFreePreview && episode.status === "published");
    const publicPreviewAssets = assets.filter((asset) => asset.assetType === "free_preview" && asset.isPublic && asset.status === "published");
    const enabledOptions = continuationOptions.filter((option) => option.enabled);

    assert(freeEpisodes.length >= 3, `${sourcePath} is published but has fewer than 3 published free preview episodes`);
    assert(publicPreviewAssets.length >= 1, `${sourcePath} is published but has no public free_preview asset`);
    assert(enabledOptions.length >= 1, `${sourcePath} is published but has no enabled continuation option`);
  }
}

function normalizeImportData(data) {
  const episodeFields = [
    "episodeNumber",
    "title",
    "hook",
    "summary",
    "endingHook",
    "aiPromptZh",
    "aiPromptEn",
    "isFreePreview",
    "status"
  ];

  const episodes = (data.episodes || []).map((episode) =>
    Object.fromEntries(episodeFields.map((field) => [field, episode[field]]))
  );

  return {
    script: {
      ...data.script,
      recommendedPlatforms: JSON.stringify(data.script.recommendedPlatforms || []),
      audienceTags: JSON.stringify(data.script.audienceTags || []),
      featured: Boolean(data.script.featured),
      freeEpisodeCount: data.script.freeEpisodeCount || 3
    },
    episodes,
    assets: data.assets || [],
    continuationOptions: data.continuationOptions || []
  };
}

function listFilesFromPattern(inputPath) {
  if (!inputPath.includes("*")) {
    const absolutePath = path.resolve(projectRoot, inputPath);

    if (fs.statSync(absolutePath).isDirectory()) {
      return fs
        .readdirSync(absolutePath)
        .filter((fileName) => fileName.endsWith(".json"))
        .map((fileName) => path.join(absolutePath, fileName));
    }

    return [absolutePath];
  }

  const absolutePattern = path.resolve(projectRoot, inputPath);
  const directory = path.dirname(absolutePattern);
  const filePattern = path.basename(absolutePattern);
  const regex = new RegExp(`^${filePattern.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`);

  return fs
    .readdirSync(directory)
    .filter((fileName) => regex.test(fileName))
    .map((fileName) => path.join(directory, fileName));
}

async function importScriptData(filePath) {
  const sourcePath = path.relative(projectRoot, filePath);
  const rawData = readJson(filePath);

  validateImportData(rawData, sourcePath);

  const data = normalizeImportData(rawData);
  const script = await prisma.script.upsert({
    where: { slug: data.script.slug },
    update: data.script,
    create: data.script
  });

  for (const asset of data.assets) {
    await prisma.scriptAsset.upsert({
      where: { id: asset.id },
      update: {
        ...asset,
        scriptId: script.id
      },
      create: {
        ...asset,
        scriptId: script.id
      }
    });
  }

  for (const episode of data.episodes) {
    await prisma.scriptEpisode.upsert({
      where: {
        scriptId_episodeNumber: {
          scriptId: script.id,
          episodeNumber: episode.episodeNumber
        }
      },
      update: episode,
      create: {
        ...episode,
        scriptId: script.id
      }
    });
  }

  for (const option of data.continuationOptions) {
    await prisma.continuationOption.upsert({
      where: {
        scriptId_type: {
          scriptId: script.id,
          type: option.type
        }
      },
      update: option,
      create: {
        ...option,
        scriptId: script.id
      }
    });
  }

  return {
    slug: script.slug,
    title: script.title,
    assets: data.assets.length,
    episodes: data.episodes.length,
    continuationOptions: data.continuationOptions.length
  };
}

async function importFiles(inputPaths) {
  const files = inputPaths.flatMap(listFilesFromPattern);
  assert(files.length > 0, "No import files found");

  const results = [];

  for (const filePath of files) {
    results.push(await importScriptData(filePath));
  }

  return results;
}

async function main() {
  const inputPaths = process.argv.slice(2);

  if (inputPaths.length === 0) {
    console.error("Usage: node scripts/import-script-data.js scripts-data/lie-scent.json");
    process.exit(1);
  }

  try {
    const results = await importFiles(inputPaths);
    console.log(JSON.stringify({ imported: results }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
}

module.exports = {
  importFiles,
  importScriptData,
  validateImportData
};
