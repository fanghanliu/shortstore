const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.join(__dirname, "..");
const defaultContentSourceDir = path.join(projectRoot, "content-source");
const defaultScriptsDataDir = path.join(projectRoot, "scripts-data");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseArgs(argv) {
  const args = {
    slug: "",
    status: "draft",
    featured: false,
    sourceDir: defaultContentSourceDir,
    outputDir: defaultScriptsDataDir,
    outputPath: ""
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === "--slug") {
      args.slug = argv[index + 1] || "";
      index += 1;
    } else if (current === "--status") {
      args.status = argv[index + 1] || args.status;
      index += 1;
    } else if (current === "--featured") {
      args.featured = true;
    } else if (current === "--source-dir") {
      args.sourceDir = path.resolve(projectRoot, argv[index + 1] || "");
      index += 1;
    } else if (current === "--output-dir") {
      args.outputDir = path.resolve(projectRoot, argv[index + 1] || "");
      index += 1;
    } else if (current === "--output") {
      args.outputPath = path.resolve(projectRoot, argv[index + 1] || "");
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

function normalizeText(value, fallback = "") {
  return String(value || fallback).trim();
}

function normalizeList(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function titleZh(master) {
  return normalizeText(master.title?.zh || master.title, master.slug);
}

function titleEn(master) {
  return normalizeText(master.title?.en || "");
}

function toSlugKey(slug) {
  return slug.replace(/-/g, "_");
}

function firstPromptFromShortDrama(episode, language) {
  const shots = episode.aiShortDrama?.shots || [];
  const key = language === "en" ? "aiPromptEn" : "aiPromptZh";
  return normalizeText(shots.find((shot) => shot?.[key])?.[key]);
}

function firstPromptFromManhua(episode, language) {
  const panels = episode.aiManhuaDrama?.panels || [];
  const key = language === "en" ? "aiPromptEn" : "aiPromptZh";
  return normalizeText(panels.find((panel) => panel?.[key])?.[key]);
}

function promptForEpisode(master, episode, language) {
  const primaryMode = master.primaryMode || "ai_short_drama";

  if (primaryMode === "ai_manhua_drama") {
    return (
      firstPromptFromManhua(episode, language) ||
      firstPromptFromShortDrama(episode, language) ||
      normalizeText(master.modeAdaptation?.aiManhuaDrama?.[language === "en" ? "globalPromptEn" : "globalPromptZh"])
    );
  }

  return (
    firstPromptFromShortDrama(episode, language) ||
    firstPromptFromManhua(episode, language) ||
    normalizeText(master.modeAdaptation?.aiShortDrama?.[language === "en" ? "globalPromptEn" : "globalPromptZh"])
  );
}

function buildProductionDetail(episode) {
  const detail = {};

  if (typeof episode.productionValue === "string" && episode.productionValue.trim()) {
    detail.productionValue = episode.productionValue.trim();
  }

  if (typeof episode.scriptText === "string" && episode.scriptText.trim()) {
    detail.scriptText = episode.scriptText.trim();
  }

  if (episode.aiShortDrama) {
    detail.aiShortDrama = {
      runtimeSeconds: episode.aiShortDrama.runtimeSeconds,
      scriptText: normalizeText(episode.aiShortDrama.scriptText),
      shots: normalizeList(episode.aiShortDrama.shots),
      editingNotes: normalizeList(episode.aiShortDrama.editingNotes)
    };
  }

  if (episode.aiManhuaDrama) {
    detail.aiManhuaDrama = {
      panelCount: episode.aiManhuaDrama.panelCount,
      scriptText: normalizeText(episode.aiManhuaDrama.scriptText),
      panels: normalizeList(episode.aiManhuaDrama.panels),
      layoutNotes: normalizeList(episode.aiManhuaDrama.layoutNotes)
    };
  }

  return detail;
}

function readEpisodeFiles(sourcePath) {
  const episodesDir = path.join(sourcePath, "episodes");
  if (!fs.existsSync(episodesDir)) return [];

  return fs
    .readdirSync(episodesDir)
    .filter((fileName) => /^episode-\d+\.json$/i.test(fileName))
    .map((fileName) => path.join(episodesDir, fileName))
    .sort((a, b) => a.localeCompare(b, "en"));
}

function mergeEpisodeOutline(master, sourceEpisodes) {
  const byNumber = new Map();

  normalizeList(master.episodeOutline).forEach((episode) => {
    if (Number.isInteger(episode.episodeNumber)) {
      byNumber.set(episode.episodeNumber, { ...episode });
    }
  });

  sourceEpisodes.forEach((episode) => {
    if (Number.isInteger(episode.episodeNumber)) {
      byNumber.set(episode.episodeNumber, {
        ...(byNumber.get(episode.episodeNumber) || {}),
        ...episode
      });
    }
  });

  return Array.from(byNumber.values()).sort((a, b) => a.episodeNumber - b.episodeNumber);
}

function buildEpisode(master, episode, status) {
  const freeEpisodeCount = master.freeEpisodeCount || 3;
  const isFreePreview =
    typeof episode.isFreePreview === "boolean"
      ? episode.isFreePreview
      : typeof episode.paidScope === "boolean"
        ? !episode.paidScope
        : episode.episodeNumber <= freeEpisodeCount;

  return {
    episodeNumber: episode.episodeNumber,
    title: normalizeText(episode.title, `第${episode.episodeNumber}集`),
    hook: normalizeText(episode.hook),
    summary: normalizeText(episode.summary),
    endingHook: normalizeText(episode.endingHook),
    aiPromptZh: promptForEpisode(master, episode, "zh"),
    aiPromptEn: promptForEpisode(master, episode, "en"),
    ...buildProductionDetail(episode),
    isFreePreview,
    status
  };
}

function buildAssets(master, status) {
  const slug = master.slug;
  const title = titleZh(master);
  const assetStatus = status === "published" ? "published" : "draft";

  return [
    {
      id: `asset_${toSlugKey(slug)}_free_v1`,
      assetType: "free_preview",
      title: `《${title}》前三集免费验证包`,
      version: "v1.0",
      filePath: `downloads/${slug}/free-preview-${slug}-v1.docx`,
      fileFormat: "docx",
      isPublic: true,
      status: assetStatus
    }
  ];
}

function buildContinuationOptions(master) {
  const title = titleZh(master);
  const policy = master.commercialPolicy || {};

  return [
    {
      type: "buyout",
      title: "一次性买断",
      description: policy.buyout || `一次性获得《${title}》后续完整剧集和对应授权，适合已经验证数据、准备连续投放的团队。`,
      startingPrice: 1999,
      enabled: true,
      sortOrder: 1
    },
    {
      type: "pay_per_episode",
      title: "按集付费",
      description: policy.payPerEpisode || `根据验证结果分批购买《${title}》后续剧集，适合想控制风险、边测边做的账号团队。`,
      startingPrice: 99,
      enabled: true,
      sortOrder: 2
    },
    {
      type: "revenue_share",
      title: "版权分成",
      description: policy.revenueShare || `无需先购买《${title}》后续剧集，经审核后可继续制作，并按视频收益约定比例分成。`,
      startingPrice: null,
      enabled: true,
      sortOrder: 3
    }
  ];
}

function validateMaster(master) {
  assert(normalizeText(master.slug), "master.slug is required");
  assert(slugPattern.test(master.slug), `master.slug must use lowercase letters, numbers, and hyphens: ${master.slug}`);
  assert(normalizeText(titleZh(master)), "master.title.zh is required");
  assert(normalizeText(master.logline), "master.logline is required");
  assert(normalizeText(master.synopsis), "master.synopsis is required");
  assert(normalizeText(master.category), "master.category is required");
  assert(Array.isArray(master.recommendedPlatforms), "master.recommendedPlatforms must be an array");
  assert(Array.isArray(master.audienceTags), "master.audienceTags must be an array");
}

function validateScriptData(data) {
  assert(data.episodes.length > 0, "At least one episode is required");
  data.episodes.forEach((episode) => {
    assert(Number.isInteger(episode.episodeNumber), `Invalid episodeNumber: ${episode.episodeNumber}`);
    assert(normalizeText(episode.title), `Episode ${episode.episodeNumber} title is required`);
    assert(normalizeText(episode.hook), `Episode ${episode.episodeNumber} hook is required`);
    assert(normalizeText(episode.summary), `Episode ${episode.episodeNumber} summary is required`);
    assert(normalizeText(episode.endingHook), `Episode ${episode.episodeNumber} endingHook is required`);
    assert(normalizeText(episode.aiPromptZh), `Episode ${episode.episodeNumber} aiPromptZh is required`);
    assert(normalizeText(episode.aiPromptEn), `Episode ${episode.episodeNumber} aiPromptEn is required`);
  });
}

function buildScriptData(slug, options = {}) {
  assert(slug, "Usage: node scripts/build-script-data-from-source.js --slug sample-script");

  const status = options.status || "draft";
  assert(["draft", "published", "archived"].includes(status), "--status must be draft, published, or archived");

  const sourcePath = path.join(options.sourceDir || defaultContentSourceDir, slug);
  const masterPath = path.join(sourcePath, "master.json");
  assert(fs.existsSync(masterPath), `master.json not found: ${masterPath}`);

  const master = readJson(masterPath);
  validateMaster(master);
  assert(master.slug === slug, `--slug ${slug} does not match master.slug ${master.slug}`);

  const sourceEpisodes = readEpisodeFiles(sourcePath).map(readJson);
  const episodes = mergeEpisodeOutline(master, sourceEpisodes).map((episode) =>
    buildEpisode(master, episode, status)
  );

  const data = {
    script: {
      slug: master.slug,
      title: titleZh(master),
      titleEn: titleEn(master) || undefined,
      logline: normalizeText(master.logline),
      synopsis: normalizeText(master.synopsis),
      category: normalizeText(master.category),
      coverImage: normalizeText(master.coverImage || `assets/covers/cover-${master.slug}.png`),
      status,
      featured: Boolean(options.featured),
      recommendedPlatforms: normalizeList(master.recommendedPlatforms),
      audienceTags: normalizeList(master.audienceTags),
      productionDifficulty: normalizeText(master.productionDifficulty || "medium"),
      episodeCount: master.episodeCount || episodes.length,
      freeEpisodeCount: master.freeEpisodeCount || 3
    },
    episodes,
    assets: buildAssets(master, status),
    continuationOptions: buildContinuationOptions(master)
  };

  validateScriptData(data);
  return data;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const data = buildScriptData(options.slug, options);
  const outputPath =
    options.outputPath || path.join(options.outputDir || defaultScriptsDataDir, `${options.slug}.json`);

  writeJson(outputPath, data);
  console.log(
    JSON.stringify(
      {
        output: path.relative(projectRoot, outputPath).replace(/\\/g, "/"),
        slug: data.script.slug,
        status: data.script.status,
        episodes: data.episodes.length,
        freeEpisodes: data.episodes.filter((episode) => episode.isFreePreview).length,
        assets: data.assets.length,
        continuationOptions: data.continuationOptions.length
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

module.exports = {
  buildScriptData
};
