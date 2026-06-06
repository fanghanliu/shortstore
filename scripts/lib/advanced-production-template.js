const fs = require("node:fs");
const path = require("node:path");

const defaultNegativePrompt =
  "避免脸部漂移、手指畸形、文字乱码、主体被遮挡、眼神空洞、背景无意义堆叠、风格突然写实化、表演僵硬、画面过曝、镜头不服务剧情";

const requiredBeatFields = [
  "function",
  "visualDesign",
  "cameraLanguage",
  "characterAction",
  "dramaticPurpose",
  "dialogue",
  "soundDesign",
  "endingHook"
];

const requiredUnitFields = [
  ...requiredBeatFields,
  "aiPromptZh",
  "aiPromptEn",
  "negativePrompt"
];

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function paragraph(lines) {
  return lines.filter(Boolean).join("\n\n");
}

function timecode(startSecond, duration) {
  const start = `${String(Math.floor(startSecond / 60)).padStart(2, "0")}:${String(startSecond % 60).padStart(2, "0")}`;
  const endSecond = startSecond + duration;
  const end = `${String(Math.floor(endSecond / 60)).padStart(2, "0")}:${String(endSecond % 60).padStart(2, "0")}`;
  return `${start}-${end}`;
}

function promptZh(theme, episode, beat, index) {
  const title = theme.titleZh || theme.title || "未命名剧本";
  return [
    theme.zhPrefix || "竖屏AI漫剧高级分镜",
    `剧名《${title}》第${episode.episodeNumber}集《${episode.title}》第${index + 1}格`,
    beat.function,
    beat.visualDesign,
    beat.cameraLanguage,
    theme.zhStyle ||
      "人物眼神细腻、前景遮挡、空间压迫、电影级光影、短剧强钩子、画面可直接用于图生视频"
  ].join("，");
}

function promptEn(theme, episode, beat, index) {
  return [
    theme.enPrefix || "vertical cinematic AI manhua storyboard",
    `${theme.titleEn || "Advanced short drama"} episode ${episode.episodeNumber}, panel ${index + 1}`,
    theme.enStyle ||
      "cinematic suspense, consistent character design, restrained acting, expressive eyes, foreground obstruction, layered depth of field, motivated camera movement",
    "clear dramatic objective, strong cliffhanger, production-ready for image-to-video"
  ].join(", ");
}

function assertBeat(beat, label) {
  requiredBeatFields.forEach((fieldName) => {
    if (!hasText(beat[fieldName])) {
      throw new Error(`${label}.${fieldName} is required`);
    }
  });
}

function buildUnits({ episode, beats, kind, theme = {}, negativePrompt = defaultNegativePrompt }) {
  let cursor = 0;
  return beats.map((beat, index) => {
    assertBeat(beat, `${kind}[${index}]`);

    const duration = beat.durationSeconds || (kind === "panel" ? 6 : 7);
    const label = kind === "panel" ? "镜头/场次" : "短剧镜头";
    const unit = {
      [kind === "panel" ? "panelNumber" : "shot"]: index + 1,
      sceneHeading: `${label} ${index + 1}｜${timecode(cursor, duration)}｜${beat.function}`,
      timecode: timecode(cursor, duration),
      durationSeconds: duration,
      function: beat.function,
      visualDesign: beat.visualDesign,
      cameraLanguage: beat.cameraLanguage,
      characterAction: beat.characterAction,
      dramaticPurpose: beat.dramaticPurpose,
      dialogue: beat.dialogue,
      soundDesign: beat.soundDesign,
      endingHook: beat.endingHook,
      aiPromptZh: beat.aiPromptZh || promptZh(theme, episode, beat, index),
      aiPromptEn: beat.aiPromptEn || promptEn(theme, episode, beat, index),
      negativePrompt: beat.negativePrompt || negativePrompt,
      composition: beat.composition || beat.visualDesign,
      foregroundBlur:
        beat.foregroundBlur ||
        "前景使用道具、玻璃反光、尘埃、门框或人群肩线形成窥视感，但不遮挡眼神和关键道具。",
      focusSubject: beat.focusSubject || "焦点优先锁定人物眼神、手部微动作、关键道具或证据物。",
      backgroundDepth:
        beat.backgroundDepth ||
        "背景保留环境纵深、光源层次、反射关系和人群剪影，让空间持续压迫主体。",
      cameraMovement: beat.cameraMovement || beat.cameraLanguage,
      action: beat.action || beat.characterAction,
      soundEffect: beat.soundEffect || beat.soundDesign,
      weirdMotion:
        beat.weirdMotion ||
        "环境细节以异常但克制的运动参与叙事，推动情绪递进并制造规则感。"
    };

    if (kind === "shot") {
      unit.visual = beat.visual || beat.visualDesign;
      unit.dialogueOrSubtitle = beat.dialogueOrSubtitle || beat.dialogue;
      unit.audioCue = beat.audioCue || beat.soundDesign;
      unit.actorDirection = beat.actorDirection || beat.characterAction;
      unit.editingRhythm =
        beat.editingRhythm ||
        "每 6-8 秒释放一个新信息点，证据出现时保留半秒阅读停顿，结尾直接断在新危机上。";
    } else {
      unit.dialogueBubble = beat.dialogueBubble || beat.dialogue;
    }

    cursor += duration;
    return unit;
  });
}

function buildAdvancedEpisode({
  episode,
  scriptText,
  beats,
  theme = {},
  runtimeSeconds = 75,
  shortShotCount = 8,
  negativePrompt = defaultNegativePrompt,
  productionValue,
  editingNotes,
  layoutNotes
}) {
  if (!episode || typeof episode !== "object") throw new Error("episode is required");
  if (!Array.isArray(beats) || beats.length < 9) throw new Error(`Episode ${episode.episodeNumber} requires at least 9 beats`);
  if (!hasText(scriptText)) throw new Error(`Episode ${episode.episodeNumber} scriptText is required`);

  const manhuaPanels = buildUnits({ episode, beats, kind: "panel", theme, negativePrompt });
  const shortShots = buildUnits({
    episode,
    beats: beats.slice(0, shortShotCount),
    kind: "shot",
    theme,
    negativePrompt
  });

  return {
    ...episode,
    scriptText,
    productionValue:
      productionValue ||
      "本集按高级生产模式交付：包含完整影视化正文、逐格高级分镜、人物动作微反应、戏剧目的、声画设计、结尾钩子、中英文AI提示词和反向提示词，可直接支持AI漫剧图生视频制作，并可转化为AI短剧拍摄提示。",
    aiShortDrama: {
      runtimeSeconds,
      scriptText,
      shots: shortShots,
      editingNotes:
        editingNotes || [
          "前 3 秒必须释放强信息钩子，不用旁白解释设定。",
          "每个镜头都必须有明确戏剧任务：取证、试探、反转、代价或新危机。",
          "台词短、克制、有潜台词，沉默和动作承担至少一半表达。",
          "结尾断在新问题上，不给完整答案。"
        ]
    },
    aiManhuaDrama: {
      directive: "docs/advanced-script-enrichment-directive.md",
      panelCount: manhuaPanels.length,
      scriptText,
      panels: manhuaPanels,
      layoutNotes:
        layoutNotes || [
          "竖屏构图优先保留人物眼神和关键道具，前景遮挡只制造窥视感。",
          "每一格都要同时写清画面设计、镜头语言、人物动作、戏剧目的、台词、音效和结尾钩子。",
          "画面高级但不空洞，镜头运动必须服务情绪递进。",
          "第 9 格必须形成视觉钩子或信息钩子，推动观众继续看第 4 集。"
        ]
    }
  };
}

function buildAdvancedPayload({ slug, status = "published", featured = false, trendEvidence = [], master, episodes }) {
  if (!hasText(slug)) throw new Error("slug is required");
  if (!master || typeof master !== "object") throw new Error("master is required");
  if (!Array.isArray(episodes) || episodes.length === 0) throw new Error("episodes must be a non-empty array");

  const payload = {
    slug,
    status,
    featured,
    trendEvidence,
    master: {
      ...master,
      slug,
      episodeCount: master.episodeCount || episodes.length,
      freeEpisodeCount: master.freeEpisodeCount || Math.min(3, episodes.length),
      episodeOutline: episodes.map(({ episodeNumber, title, hook, summary, endingHook }) => ({
        episodeNumber,
        title,
        hook,
        summary,
        endingHook
      }))
    },
    episodes
  };

  validateAdvancedPayload(payload);
  return payload;
}

function containsCjk(value) {
  return /[\u3400-\u9fff]/u.test(String(value || ""));
}

function validateAdvancedPayload(payload, options = {}) {
  const issues = [];
  const minSummaryChars = options.minSummaryChars || 240;
  const minScriptTextChars = options.minScriptTextChars || 450;
  const minPanels = options.minPanels || 9;
  const minShots = options.minShots || 8;

  function add(condition, message) {
    if (!condition) issues.push(message);
  }

  add(payload && typeof payload === "object", "payload must be an object");
  add(hasText(payload?.slug), "payload.slug is required");
  add(payload?.master && typeof payload.master === "object", "master is required");
  add(hasText(payload?.master?.title?.zh || payload?.master?.title), "master.title.zh is required");
  add(hasText(payload?.master?.logline), "master.logline is required");
  add(hasText(payload?.master?.synopsis), "master.synopsis is required");
  add(Array.isArray(payload?.master?.recommendedPlatforms), "master.recommendedPlatforms must be an array");
  add(Array.isArray(payload?.master?.audienceTags), "master.audienceTags must be an array");
  add(Array.isArray(payload?.episodes) && payload.episodes.length > 0, "episodes must be a non-empty array");

  (payload?.episodes || []).forEach((episode, episodeIndex) => {
    const prefix = `episodes[${episodeIndex}]`;
    add(Number.isInteger(episode.episodeNumber), `${prefix}.episodeNumber must be an integer`);
    ["title", "hook", "summary", "endingHook", "scriptText"].forEach((fieldName) => {
      add(hasText(episode[fieldName]), `${prefix}.${fieldName} is required`);
    });
    add(String(episode.summary || "").length >= minSummaryChars, `${prefix}.summary is too thin`);
    add(String(episode.scriptText || "").length >= minScriptTextChars, `${prefix}.scriptText is too thin`);

    const panels = episode.aiManhuaDrama?.panels || [];
    const shots = episode.aiShortDrama?.shots || [];
    add(panels.length >= minPanels, `${prefix}.aiManhuaDrama.panels must have at least ${minPanels} panels`);
    add(shots.length >= minShots, `${prefix}.aiShortDrama.shots must have at least ${minShots} shots`);

    panels.forEach((panel, panelIndex) => {
      requiredUnitFields.forEach((fieldName) => {
        add(hasText(panel[fieldName]), `${prefix}.panels[${panelIndex}].${fieldName} is required`);
      });
      add(!containsCjk(panel.aiPromptEn), `${prefix}.panels[${panelIndex}].aiPromptEn should be English only`);
    });

    shots.forEach((shot, shotIndex) => {
      requiredUnitFields.forEach((fieldName) => {
        add(hasText(shot[fieldName]), `${prefix}.shots[${shotIndex}].${fieldName} is required`);
      });
      add(!containsCjk(shot.aiPromptEn), `${prefix}.shots[${shotIndex}].aiPromptEn should be English only`);
    });
  });

  if (issues.length) {
    const error = new Error(`Advanced payload validation failed: ${issues.length} issue(s)`);
    error.issues = issues;
    throw error;
  }

  return {
    ok: true,
    slug: payload.slug,
    episodes: payload.episodes.length,
    panelsPerEpisode: payload.episodes.map((episode) => episode.aiManhuaDrama?.panels?.length || 0),
    shotsPerEpisode: payload.episodes.map((episode) => episode.aiShortDrama?.shots?.length || 0)
  };
}

function writeAdvancedProductionInput(outputPath, payload) {
  validateAdvancedPayload(payload);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return outputPath;
}

module.exports = {
  defaultNegativePrompt,
  requiredBeatFields,
  requiredUnitFields,
  paragraph,
  timecode,
  buildUnits,
  buildAdvancedEpisode,
  buildAdvancedPayload,
  validateAdvancedPayload,
  writeAdvancedProductionInput
};
