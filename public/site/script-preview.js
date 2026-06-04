const params = new URLSearchParams(window.location.search);
const scriptSlug = params.get("slug") || "lie-scent";

const scriptTitle = document.querySelector("#scriptTitle");
const scriptLogline = document.querySelector("#scriptLogline");
const scriptLabels = document.querySelector("#scriptLabels");
const scriptCategory = document.querySelector("#scriptCategory");
const scriptSynopsis = document.querySelector("#scriptSynopsis");
const detailHero = document.querySelector(".dynamic-detail-hero");
const platformPills = document.querySelector("#platformPills");
const overviewGrid = document.querySelector("#overviewGrid");
const episodeGrid = document.querySelector("#episodeGrid");
const assetTitle = document.querySelector("#assetTitle");
const assetMeta = document.querySelector("#assetMeta");
const deliveryFormat = document.querySelector("#deliveryFormat");
const packageFileFormat = document.querySelector("#packageFileFormat");
const packageFormatMetric = document.querySelector("#packageFormatMetric");
const heroPoster = document.querySelector("#heroPoster");
const heroFrames = document.querySelector("#heroFrames");
const heroAssetVersion = document.querySelector("#heroAssetVersion");
const heroDifficulty = document.querySelector("#heroDifficulty");
const heroEpisodeCount = document.querySelector("#heroEpisodeCount");
const downloadFileList = document.querySelector("#downloadFileList");
const continuationGrid = document.querySelector("#continuationGrid");
const confirmDownloadButton = document.querySelector("#confirmDownload");

const frameMap = {
  "lie-scent": [
    "assets/storyboards/frame-01.png",
    "assets/storyboards/frame-02.png",
    "assets/storyboards/frame-03.png",
    "assets/storyboards/frame-06.png"
  ],
  "last-cloud-city": [
    "assets/storyboards/last-cloud-city/frame-01.png",
    "assets/storyboards/last-cloud-city/frame-02.png",
    "assets/storyboards/last-cloud-city/frame-03.png",
    "assets/storyboards/last-cloud-city/frame-04.png"
  ],
  "live-revenge": [
    "assets/storyboards/live-revenge/frame-01.png",
    "assets/storyboards/live-revenge/frame-02.png",
    "assets/storyboards/live-revenge/frame-03.png",
    "assets/storyboards/live-revenge/frame-04.png"
  ],
  "love-algorithm": [
    "assets/storyboards/love-algorithm/frame-01.png",
    "assets/storyboards/love-algorithm/frame-02.png",
    "assets/storyboards/love-algorithm/frame-03.png",
    "assets/storyboards/love-algorithm/frame-04.png"
  ]
};

const difficultyLabels = {
  low: "制作难度：低",
  medium: "制作难度：中",
  high: "制作难度：高"
};

function setText(element, text) {
  if (element) {
    element.textContent = text || "";
  }
}

function clear(element) {
  if (element) {
    element.replaceChildren();
  }
}

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined && textContent !== null) {
    element.textContent = textContent;
  }

  return element;
}

function addListItem(list, text) {
  const item = document.createElement("li");
  item.textContent = text;
  list.appendChild(item);
}

function renderPills(container, values) {
  clear(container);
  values.filter(Boolean).slice(0, 8).forEach((value) => {
    container.appendChild(createElement("span", "", value));
  });
}

function renderLabels(script) {
  clear(scriptLabels);
  scriptLabels.appendChild(createElement("span", "", `${script.freeEpisodeCount || 3}集已开放`));
  scriptLabels.appendChild(createElement("span", "", script.category));
}

function renderHeroTitle(script) {
  clear(scriptTitle);
  scriptTitle.append(script.title);

  if (script.titleEn && script.titleEn !== script.title) {
    scriptTitle.appendChild(createElement("span", "", script.titleEn));
  }
}

function renderHeroVisual(script, asset) {
  const coverImage = script.coverImage || "assets/hero-storyboard-marketplace.png";

  if (heroPoster) {
    heroPoster.src = coverImage;
    heroPoster.alt = `${script.title}封面视觉`;
  }

  if (detailHero) {
    detailHero.style.setProperty("--detail-cover", `url("${coverImage}")`);
  }

  setText(heroAssetVersion, asset?.version || "v1.0");
  setText(heroDifficulty, difficultyLabels[script.productionDifficulty] || "制作难度待评估");
  setText(heroEpisodeCount, `完整预计 ${script.episodeCount || "待定"} 集`);

  clear(heroFrames);
  const frames = frameMap[script.slug] || [];
  frames.forEach((src, index) => {
    const image = document.createElement("img");
    image.src = src;
    image.alt = `${script.title}分镜预览 ${index + 1}`;
    heroFrames.appendChild(image);
  });
}

function renderOverview(script) {
  clear(overviewGrid);

  const overviewItems = [
    ["推荐平台", script.recommendedPlatforms.join(" / ")],
    ["受众标签", script.audienceTags.join(" / ")],
    ["制作难度", difficultyLabels[script.productionDifficulty] || "待评估"],
    ["预计集数", `${script.episodeCount || "待定"} 集以内`]
  ];

  overviewItems.forEach(([title, text], index) => {
    const article = createElement("article", "overview-stat-card");
    const top = createElement("div", "asset-top");
    top.appendChild(createElement("span", "", String(index + 1).padStart(2, "0")));
    top.appendChild(createElement("em", "", "Info"));
    article.appendChild(top);
    article.appendChild(createElement("strong", "", title));
    article.appendChild(createElement("p", "", text));
    overviewGrid.appendChild(article);
  });
}

function createPromptBlock(label, text) {
  const block = createElement("div", "prompt-block");
  block.appendChild(createElement("span", "", label));
  block.appendChild(createElement("p", "", text || "暂未配置"));
  return block;
}

function createEpisodeCard(episode) {
  const article = createElement("article", "episode-card");
  const header = createElement("div", "episode-card-head");
  header.appendChild(createElement("span", "", `第${episode.episodeNumber}集`));
  header.appendChild(createElement("h3", "", episode.title));
  article.appendChild(header);

  article.appendChild(createElement("p", "episode-hook", episode.hook || ""));

  const body = createElement("div", "episode-body");
  body.appendChild(createElement("strong", "", "剧情摘要"));
  body.appendChild(createElement("p", "", episode.summary));
  body.appendChild(createElement("strong", "", "结尾悬念"));
  body.appendChild(createElement("p", "", episode.endingHook || ""));
  article.appendChild(body);

  const prompts = createElement("div", "prompt-grid");
  prompts.appendChild(createPromptBlock("中文提示词", episode.aiPromptZh));
  prompts.appendChild(createPromptBlock("English prompt", episode.aiPromptEn));
  article.appendChild(prompts);

  return article;
}

function renderEpisodes(script) {
  clear(episodeGrid);
  script.episodes
    .filter((episode) => episode.isFreePreview)
    .slice(0, 3)
    .forEach((episode) => {
      episodeGrid.appendChild(createEpisodeCard(episode));
    });
}

function renderDownload(asset) {
  if (!asset) {
    setText(assetTitle, "免费包暂未开放");
    setText(assetMeta, "当前剧本暂时不能下载。");
    return;
  }

  setText(assetTitle, asset.title);
  setText(assetMeta, `${asset.version} / ${asset.fileFormat.toUpperCase()} / 免费前三集验证包`);
  setText(deliveryFormat, asset.fileFormat.toUpperCase());
  setText(packageFileFormat, `${asset.fileFormat.toUpperCase()} 文件`);
  setText(packageFormatMetric, asset.fileFormat.toUpperCase());

  if (confirmDownloadButton) {
    confirmDownloadButton.dataset.scriptSlug = scriptSlug;
    confirmDownloadButton.dataset.assetId = asset.id;
    confirmDownloadButton.href = asset.downloadUrl || `/api/download-files/script-assets/${asset.id}`;
  }

  clear(downloadFileList);
  [
    "前三集剧情正文",
    "每集核心钩子和结尾悬念",
    "中英双语 AI 画面提示词",
    "角色视觉锚点",
    "发布测试建议",
    "授权边界说明"
  ].forEach((item) => addListItem(downloadFileList, item));
}

function renderContinuationOptions(script) {
  clear(continuationGrid);

  script.continuationOptions.forEach((option) => {
    const article = createElement("article", "continuation-card");
    article.appendChild(createElement("span", "", option.title));
    article.appendChild(createElement("p", "", option.description));

    const price = option.startingPrice
      ? `参考起价：¥${option.startingPrice}`
      : "需审核后确认比例";
    article.appendChild(createElement("strong", "", price));

    continuationGrid.appendChild(article);
  });
}

function renderError(message) {
  setText(scriptTitle, "剧本暂未开放");
  setText(scriptLogline, message);
  clear(platformPills);
  clear(overviewGrid);
  clear(episodeGrid);
  clear(downloadFileList);
  clear(continuationGrid);
}

async function loadScriptPreview() {
  const response = await fetch(`/api/scripts/${scriptSlug}`);

  if (!response.ok) {
    renderError("请返回剧本库查看已上架剧本。");
    return;
  }

  const script = await response.json();
  const asset = script.assets.find((item) => item.assetType === "free_preview" && item.isPublic);

  document.title = `${script.title} | 短剧本铺`;
  renderHeroTitle(script);
  setText(scriptLogline, script.logline);
  setText(scriptCategory, script.category);
  setText(scriptSynopsis, script.synopsis);

  renderLabels(script);
  renderPills(platformPills, script.recommendedPlatforms);
  renderHeroVisual(script, asset);
  renderOverview(script);
  renderEpisodes(script);
  renderDownload(asset);
  renderContinuationOptions(script);
}

loadScriptPreview().catch((error) => {
  console.error(error);
  renderError("请确认后端服务已启动。");
});
