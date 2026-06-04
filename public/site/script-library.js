const scriptLibrary = document.querySelector("#scriptLibrary");
const scriptLibraryState = document.querySelector("#scriptLibraryState");
const filterPanel = document.querySelector(".script-filter-panel");
const sortTabs = document.querySelector("[data-sort-tabs]");

const scriptVisuals = {
  "lie-scent": {
    href: "script-preview.html?slug=lie-scent",
    cover: "assets/cover-lie-scent.png"
  },
  "last-cloud-city": {
    href: "script-preview.html?slug=last-cloud-city",
    cover: "assets/storyboards/last-cloud-city/frame-01.png"
  },
  "live-revenge": {
    href: "script-preview.html?slug=live-revenge",
    cover: "assets/storyboards/live-revenge/frame-01.png"
  },
  "love-algorithm": {
    href: "script-preview.html?slug=love-algorithm",
    cover: "assets/storyboards/love-algorithm/frame-01.png"
  }
};

const genreOptions = {
  "主题": [
    "都市悬疑",
    "直播逆袭",
    "AI甜宠",
    "科幻废土",
    "海外平台",
    "爽文反转",
    "豪门旧案",
    "阶级悬疑",
    "合约恋爱",
    "舆论战",
    "短剧",
    "反转爽剧"
  ],
  "角色": [
    "女性向",
    "危机公关",
    "女程序员",
    "过气主播",
    "废土少女",
    "豪门继承人",
    "投资人前任",
    "神秘引路人",
    "功能角色",
    "反派阵营"
  ],
  "情节": [
    "危险关系",
    "公开审判",
    "算法",
    "升城",
    "旧案",
    "直播",
    "合约恋爱",
    "阶级",
    "发布会",
    "反转"
  ]
};

const libraryState = {
  scripts: [],
  filters: {
    reader: "all",
    genre: "all",
    status: "all",
    length: "all"
  },
  sort: "hot"
};

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

function getSearchText(script) {
  return [
    script.title,
    script.titleEn,
    script.logline,
    script.synopsis,
    script.category,
    ...(script.audienceTags || []),
    ...(script.recommendedPlatforms || [])
  ]
    .filter(Boolean)
    .join(" ");
}

function getScriptHref(script) {
  return scriptVisuals[script.slug]?.href || `script-preview.html?slug=${encodeURIComponent(script.slug)}`;
}

function getScriptCover(script) {
  return script.coverImage || scriptVisuals[script.slug]?.cover || "assets/hero-cinematic-arc.png";
}

function getPrimaryTags(script) {
  return [script.category, ...(script.audienceTags || [])].filter(Boolean).slice(0, 3);
}

function getReaderType(script) {
  const text = getSearchText(script);

  if (/女性|女频|女生|甜宠|豪门|情感/.test(text)) {
    return "female";
  }

  if (/男频|男生|废土|复仇|逆袭|科幻/.test(text)) {
    return "male";
  }

  return "all";
}

function matchesLength(script, length) {
  const episodes = Number(script.episodeCount || 0);

  if (length === "short") return episodes > 0 && episodes < 30;
  if (length === "medium") return episodes >= 30 && episodes <= 60;
  if (length === "long") return episodes > 60;

  return true;
}

function matchesGenre(script, genre) {
  if (genre === "all") return true;
  if (["主题", "角色", "情节"].includes(genre)) return true;

  return getSearchText(script).includes(genre);
}

function matchesFilters(script) {
  const { reader, genre, status, length } = libraryState.filters;
  const readerType = getReaderType(script);

  if (reader !== "all" && readerType !== reader) return false;
  if (!matchesGenre(script, genre)) return false;
  if (status !== "all" && script.status !== status) return false;
  if (!matchesLength(script, length)) return false;

  return true;
}

function sortScripts(scripts) {
  const sorted = [...scripts];

  if (libraryState.sort === "episodes") {
    return sorted.sort((a, b) => Number(b.episodeCount || 0) - Number(a.episodeCount || 0));
  }

  if (libraryState.sort === "new") {
    return sorted.reverse();
  }

  return sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
}

function renderState(message) {
  if (!scriptLibrary) return;

  scriptLibrary.replaceChildren();

  const state = scriptLibraryState || createElement("article", "library-state");
  state.textContent = message;
  state.hidden = false;
  scriptLibrary.appendChild(state);
}

function renderScriptCard(script) {
  const visual = scriptVisuals[script.slug] || {};
  const article = createElement("article", "script-list-card");
  const href = getScriptHref(script);

  const posterLink = document.createElement("a");
  posterLink.className = "script-poster";
  posterLink.href = href;

  const poster = document.createElement("img");
  poster.src = visual.cover || getScriptCover(script);
  poster.alt = `${script.title}封面`;
  poster.loading = "lazy";
  posterLink.appendChild(poster);
  article.appendChild(posterLink);

  const copy = createElement("div", "script-list-copy");

  const title = document.createElement("a");
  title.className = "script-title";
  title.href = href;
  title.textContent = script.title;
  copy.appendChild(title);

  const meta = createElement("p", "script-meta");
  meta.textContent = `已开放：${script.freeEpisodeCount || 3}集免费 / 共${script.episodeCount || "--"}集`;
  copy.appendChild(meta);

  const description = createElement("p", "script-logline", script.logline || script.synopsis || "");
  copy.appendChild(description);

  const tags = createElement("div", "script-tags");
  getPrimaryTags(script).forEach((tag) => tags.appendChild(createElement("span", "", tag)));
  copy.appendChild(tags);

  article.appendChild(copy);
  return article;
}

function renderScripts() {
  if (!scriptLibrary) return;

  const filtered = sortScripts(libraryState.scripts.filter(matchesFilters));

  if (!filtered.length) {
    renderState("当前筛选下暂无剧本，换一个题材试试。");
    return;
  }

  scriptLibrary.replaceChildren();
  filtered.forEach((script) => scriptLibrary.appendChild(renderScriptCard(script)));
}

function setActiveButton(group, button) {
  group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
}

function setActiveGenreChip(group, button) {
  group.querySelectorAll(".genre-chip").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
}

function renderGenreOptions(group, value) {
  const cloud = group.querySelector(".genre-cloud");
  if (!cloud) return;

  cloud.replaceChildren();

  (genreOptions[value] || []).forEach((option) => {
    const chip = createElement("button", "genre-chip", option);
    chip.type = "button";
    chip.dataset.filterValue = option;
    cloud.appendChild(chip);
  });
}

function updateGenreExpansion(group, value) {
  if (group.dataset.filterGroup !== "genre") return;

  if (value === "all") {
    group.classList.remove("expanded");
    renderGenreOptions(group, value);
    return;
  }

  renderGenreOptions(group, value);
  group.classList.add("expanded");
}

function bindFilters() {
  if (filterPanel) {
    filterPanel.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter-value]");
      if (!button) return;

      const group = button.closest("[data-filter-group]");
      if (!group) return;

      const groupName = group.dataset.filterGroup;
      const value = button.dataset.filterValue;

      if (groupName === "genre") {
        if (button.classList.contains("genre-chip")) {
          libraryState.filters.genre = value;
          setActiveGenreChip(group, button);
        } else {
          libraryState.filters.genre = "all";
          setActiveButton(group, button);
          updateGenreExpansion(group, value);
        }

        renderScripts();
        return;
      }

      libraryState.filters[groupName] = value;
      setActiveButton(group, button);
      renderScripts();
    });
  }

  if (sortTabs) {
    sortTabs.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-sort-value]");
      if (!button) return;

      libraryState.sort = button.dataset.sortValue;
      setActiveButton(sortTabs, button);
      renderScripts();
    });
  }
}

async function loadScripts() {
  try {
    const response = await fetch("/api/scripts?status=published");

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    libraryState.scripts = data.items || [];

    if (libraryState.scripts.length === 0) {
      renderState("当前还没有已上架剧本。");
      return;
    }

    renderScripts();
  } catch (error) {
    console.error(error);
    renderState("剧本库暂时无法连接数据库，请确认后端服务已启动。");
  }
}

bindFilters();
loadScripts();
