const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.join(__dirname, "..");
const outputDir = path.join(projectRoot, "automation-briefs");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const topicSeeds = [
  {
    slugBase: "reborn-supply-depot",
    title: "重生后我把废仓库改成末世补给站",
    titleEn: "Reborn Supply Depot",
    mode: "ai_manhua_drama",
    category: "AI末世囤货重生漫剧",
    audienceTags: ["末世囤货", "重生逆袭", "移动堡垒", "爽文短剧"],
    trendSignals: ["重生", "末世", "囤货", "空间升级", "强钩子"],
    logline: "寒潮降临前七天，前世被亲人骗光物资的女主重生归来，把一座废仓库改成无人能攻破的末世补给站。",
    visualStyle: "竖屏AI漫剧，冷蓝末世光影，强空间透视，角色表演细腻"
  },
  {
    slugBase: "wrong-heir-live",
    title: "真假继承人直播翻车后我接管全城热搜",
    titleEn: "Wrong Heir Live",
    mode: "ai_short_drama",
    category: "AI豪门反转直播短剧",
    audienceTags: ["真假继承人", "直播翻车", "豪门反转", "舆论逆袭"],
    trendSignals: ["直播审判", "真假千金", "豪门继承", "舆论反转"],
    logline: "被赶出豪门的真继承人在全网直播中拿出第一份证据，却发现这场翻车是她母亲十年前布下的局。",
    visualStyle: "竖屏AI短剧，现代豪门空间，冷暖对比，表演压迫感强"
  },
  {
    slugBase: "midnight-delivery-system",
    title: "午夜外卖系统只给将死之人派单",
    titleEn: "Midnight Delivery System",
    mode: "ai_manhua_drama",
    category: "AI都市悬疑系统漫剧",
    audienceTags: ["午夜外卖", "系统任务", "都市悬疑", "死亡倒计时"],
    trendSignals: ["规则怪谈", "系统", "深夜职业", "反转悬疑"],
    logline: "失业骑手绑定午夜外卖系统后发现，每一单都送往即将死亡的人，而他必须在送达前改写结局。",
    visualStyle: "雨夜城市，霓虹反光，长焦压缩空间，悬疑漫画质感"
  },
  {
    slugBase: "contract-wife-reversal",
    title: "协议妻子撕毁合同那晚全家开始后悔",
    titleEn: "Contract Wife Reversal",
    mode: "ai_short_drama",
    category: "AI婚恋逆袭短剧",
    audienceTags: ["协议婚姻", "追妻火葬场", "家庭压迫", "女性成长"],
    trendSignals: ["先婚后爱", "追妻", "身份反转", "情绪压迫"],
    logline: "被当成摆设三年的协议妻子撕毁离婚合同，却让丈夫发现她才是救活集团的幕后投资人。",
    visualStyle: "现代室内戏，低饱和暖冷对撞，细腻表演，近景压迫"
  },
  {
    slugBase: "school-bell-loop",
    title: "第十三次上课铃响后全班只剩我记得循环",
    titleEn: "School Bell Loop",
    mode: "ai_manhua_drama",
    category: "AI校园循环悬疑漫剧",
    audienceTags: ["时间循环", "校园悬疑", "集体失忆", "规则破解"],
    trendSignals: ["循环", "校园", "规则", "悬疑钩子"],
    logline: "每到第十三次上课铃，全班都会重置记忆，只有转学生记得老师点名后消失的那个座位。",
    visualStyle: "校园走廊，白昼诡异感，规则怪谈氛围，漫画分镜"
  },
  {
    slugBase: "bankrupt-ceo-restart",
    title: "破产总裁重开人生只剩三次选择",
    titleEn: "Bankrupt CEO Restart",
    mode: "ai_short_drama",
    category: "AI商战重生短剧",
    audienceTags: ["商战重生", "破产逆袭", "选择系统", "兄弟背叛"],
    trendSignals: ["商战", "重开人生", "选择系统", "复仇"],
    logline: "破产跳楼前，昔日总裁获得三次重选机会，每一次选择都会暴露一个背叛他的亲近之人。",
    visualStyle: "都市商战，玻璃反射，会议室压迫，真人短剧节奏"
  },
  {
    slugBase: "orphanage-ledger",
    title: "孤儿院账本曝光后所有养父母都在找我",
    titleEn: "Orphanage Ledger",
    mode: "ai_manhua_drama",
    category: "AI身世谜案复仇漫剧",
    audienceTags: ["身世谜案", "复仇", "孤儿院", "多方追逐"],
    trendSignals: ["身世反转", "旧案", "账本证据", "追逐"],
    logline: "孤儿院拆迁当天，女主在墙缝里找到一本账本，才知道自己不是弃婴，而是六个豪门共同隐藏的证据。",
    visualStyle: "旧楼拆迁尘雾，档案质感，光束切割空间，悬疑漫剧"
  },
  {
    slugBase: "algorithm-bride",
    title: "算法给我匹配的未婚夫是上一世凶手",
    titleEn: "Algorithm Bride",
    mode: "ai_short_drama",
    category: "AI都市情感悬疑短剧",
    audienceTags: ["算法匹配", "婚恋悬疑", "前世凶手", "反向试探"],
    trendSignals: ["AI婚恋", "前世记忆", "身份试探", "危险关系"],
    logline: "相亲平台把女主匹配给上一世杀死她的人，而这一次她决定先爱上他，再逼他说出真相。",
    visualStyle: "都市夜景，餐厅对峙，声画错位，悬疑情感短剧"
  }
];

function parseArgs(argv) {
  const args = {
    count: 1,
    episodeCount: 3,
    mode: "mixed",
    provider: "openai",
    model: process.env.OPENAI_MODEL || "gpt-5.1",
    useWebSearch: true,
    requestDelayMs: 1200,
    maxRetries: 2,
    status: "published",
    featured: false,
    autoProduce: false,
    productionDryRun: false,
    outputDir,
    batchId: timestampId()
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === "--count") {
      args.count = Number(argv[index + 1] || 1);
      index += 1;
    } else if (current === "--episode-count") {
      args.episodeCount = Number(argv[index + 1] || 3);
      index += 1;
    } else if (current === "--mode") {
      args.mode = normalizeMode(argv[index + 1] || "mixed");
      index += 1;
    } else if (current === "--provider") {
      args.provider = argv[index + 1] || "template";
      index += 1;
    } else if (current === "--model") {
      args.model = argv[index + 1] || args.model;
      index += 1;
    } else if (current === "--no-web-search") {
      args.useWebSearch = false;
    } else if (current === "--request-delay-ms") {
      args.requestDelayMs = Number(argv[index + 1] || args.requestDelayMs);
      index += 1;
    } else if (current === "--max-retries") {
      args.maxRetries = Number(argv[index + 1] || args.maxRetries);
      index += 1;
    } else if (current === "--status") {
      args.status = argv[index + 1] || "published";
      index += 1;
    } else if (current === "--featured") {
      args.featured = true;
    } else if (current === "--auto-produce") {
      args.autoProduce = true;
    } else if (current === "--production-dry-run") {
      args.productionDryRun = true;
    } else if (current === "--output-dir") {
      args.outputDir = path.resolve(projectRoot, argv[index + 1] || "automation-briefs");
      index += 1;
    } else if (current === "--batch-id") {
      args.batchId = argv[index + 1] || args.batchId;
      index += 1;
    }
  }

  assert(Number.isInteger(args.count) && args.count > 0, "--count must be a positive integer");
  assert(Number.isInteger(args.episodeCount) && args.episodeCount > 0, "--episode-count must be a positive integer");
  assert(["openai", "template"].includes(args.provider), "--provider must be openai or template");
  assert(args.model, "--model is required when using OpenAI generation");
  assert(Number.isInteger(args.maxRetries) && args.maxRetries >= 0, "--max-retries must be a non-negative integer");
  assert(Number.isFinite(args.requestDelayMs) && args.requestDelayMs >= 0, "--request-delay-ms must be a non-negative number");
  assert(["draft", "published", "archived"].includes(args.status), "--status must be draft, published, or archived");
  return args;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function timestampId() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "z");
}

function normalizeMode(mode) {
  if (mode === "ai_comic_drama") return "ai_manhua_drama";
  if (mode === "ai_manhua_drama" || mode === "ai_short_drama" || mode === "mixed") return mode;
  return "mixed";
}

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function ensureUniqueSlug(slug, usedSlugs) {
  let candidate = slug;
  let suffix = 2;
  while (usedSlugs.has(candidate) || fs.existsSync(path.join(outputDir, `generated-${candidate}.json`))) {
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
  usedSlugs.add(candidate);
  return candidate;
}

function pickTopic(index, mode) {
  const matching = topicSeeds.filter((topic) => mode === "mixed" || topic.mode === mode);
  const pool = matching.length ? matching : topicSeeds;
  const seed = pool[index % pool.length];
  const cycle = Math.floor(index / pool.length);
  if (cycle === 0) return { ...seed };
  return {
    ...seed,
    slugBase: `${seed.slugBase}-case-${cycle + 1}`,
    title: `${seed.title}：第${cycle + 1}变体`,
    titleEn: `${seed.titleEn} Case ${cycle + 1}`
  };
}

async function sleep(ms) {
  if (!ms) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function apiKey() {
  const key = process.env.OPENAI_API_KEY;
  assert(key, "OPENAI_API_KEY is required for --provider openai");
  return key;
}

function outputTextFromResponse(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text;

  const strings = [];
  function walk(value) {
    if (typeof value === "string") {
      if (value.trim()) strings.push(value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (value && typeof value === "object") {
      ["text", "content", "output", "message", "result"].forEach((key) => {
        if (key in value) walk(value[key]);
      });
      Object.entries(value).forEach(([key, child]) => {
        if (!["text", "content", "output", "message", "result"].includes(key)) walk(child);
      });
    }
  }
  walk(data.output || data);
  return strings.find((text) => text.includes("{") || text.includes("[")) || strings[0] || "";
}

function parseJsonText(text, label) {
  const cleaned = String(text || "")
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (firstError) {
    const firstObject = cleaned.indexOf("{");
    const lastObject = cleaned.lastIndexOf("}");
    if (firstObject >= 0 && lastObject > firstObject) {
      try {
        return JSON.parse(cleaned.slice(firstObject, lastObject + 1));
      } catch {}
    }

    const firstArray = cleaned.indexOf("[");
    const lastArray = cleaned.lastIndexOf("]");
    if (firstArray >= 0 && lastArray > firstArray) {
      try {
        return JSON.parse(cleaned.slice(firstArray, lastArray + 1));
      } catch {}
    }

    throw new Error(`${label} returned invalid JSON: ${firstError.message}`);
  }
}

async function callOpenAIJson({ args, label, system, prompt, schema, useWebSearch = false }) {
  const body = {
    model: args.model,
    input: [
      {
        role: "system",
        content: system
      },
      {
        role: "user",
        content: prompt
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: toSlug(label).replace(/-/g, "_") || "json_result",
        schema
      }
    }
  };

  if (useWebSearch) {
    body.tools = [{ type: "web_search_preview" }];
  }

  let lastError = null;
  for (let attempt = 0; attempt <= args.maxRetries; attempt += 1) {
    if (attempt > 0) {
      await sleep(args.requestDelayMs * attempt);
    }
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    if (!response.ok) {
      lastError = new Error(`${label} OpenAI request failed (${response.status}): ${text.slice(0, 1200)}`);
      continue;
    }

    const data = JSON.parse(text);
    const outputText = outputTextFromResponse(data);
    try {
      return parseJsonText(outputText, label);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error(`${label} failed`);
}

function topicSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["topics"],
    properties: {
      topics: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["slugBase", "title", "titleEn", "mode", "category", "audienceTags", "trendSignals", "logline", "visualStyle"],
          properties: {
            slugBase: { type: "string" },
            title: { type: "string" },
            titleEn: { type: "string" },
            mode: { type: "string", enum: ["ai_manhua_drama", "ai_short_drama"] },
            category: { type: "string" },
            audienceTags: { type: "array", items: { type: "string" } },
            trendSignals: { type: "array", items: { type: "string" } },
            logline: { type: "string" },
            visualStyle: { type: "string" }
          }
        }
      }
    }
  };
}

async function generateHotTopicsWithOpenAI(args) {
  const modeInstruction =
    args.mode === "mixed"
      ? "AI漫剧和AI短剧混合，优先 60% AI漫剧、40% AI短剧。"
      : `只生成 ${args.mode}。`;

  const result = await callOpenAIJson({
    args,
    label: "hot topic candidates",
    useWebSearch: args.useWebSearch,
    system: "你是短剧爆款选题策划与数据分析系统。只返回严格 JSON。",
    prompt: `
当前日期：${new Date().toISOString().slice(0, 10)}

请检索并综合近期短视频平台和短剧市场的热门题材信号，生成 ${args.count} 个适合批量生产售卖的剧本选题。

要求：
1. ${modeInstruction}
2. AI漫剧优先考虑二创小说感强、画面冲击强、可图生视频的题材。
3. AI短剧优先考虑真人表演强冲突、强钩子、低成本场景可拍的题材。
4. 避免侵权角色名、真实品牌名、真实公众人物。
5. slugBase 必须是小写英文、数字和短横线。
6. 每个 logline 必须有明确高概念、主角目标、冲突和反转潜力。
`.trim(),
    schema: topicSchema()
  });

  return result.topics.slice(0, args.count).map((topic) => ({
    ...topic,
    mode: normalizeMode(topic.mode),
    slugBase: toSlug(topic.slugBase)
  }));
}

function outlineSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: [
      "slug",
      "title",
      "titleEn",
      "mode",
      "category",
      "logline",
      "synopsis",
      "sellingPoints",
      "targetAudience",
      "recommendedPlatforms",
      "audienceTags",
      "characters",
      "worldview",
      "visualStyle",
      "tone",
      "episodePlans"
    ],
    properties: {
      slug: { type: "string" },
      title: { type: "string" },
      titleEn: { type: "string" },
      mode: { type: "string", enum: ["ai_manhua_drama", "ai_short_drama"] },
      category: { type: "string" },
      logline: { type: "string" },
      synopsis: { type: "string" },
      sellingPoints: { type: "array", items: { type: "string" } },
      targetAudience: { type: "string" },
      recommendedPlatforms: { type: "array", items: { type: "string" } },
      audienceTags: { type: "array", items: { type: "string" } },
      characters: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "role", "motivation", "secret", "visualDesign"],
          properties: {
            name: { type: "string" },
            role: { type: "string" },
            motivation: { type: "string" },
            secret: { type: "string" },
            visualDesign: { type: "string" }
          }
        }
      },
      worldview: { type: "string" },
      visualStyle: { type: "string" },
      tone: { type: "string" },
      episodePlans: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["episodeNumber", "title", "dramaticPurpose", "characterGoals", "conflict", "turningPoint", "endingHook", "visualFocus"],
          properties: {
            episodeNumber: { type: "integer" },
            title: { type: "string" },
            dramaticPurpose: { type: "string" },
            characterGoals: { type: "string" },
            conflict: { type: "string" },
            turningPoint: { type: "string" },
            endingHook: { type: "string" },
            visualFocus: { type: "string" }
          }
        }
      }
    }
  };
}

async function generateOutlineWithOpenAI(topic, args, slug) {
  const outline = await callOpenAIJson({
    args,
    label: `outline ${slug}`,
    system: "你是专业短剧编剧统筹、分镜导演和商业剧本策划。只返回严格 JSON。",
    prompt: `
根据选题生成剧本母版和 ${args.episodeCount} 集分集大纲。不要写完整正文。

选题：
${JSON.stringify(topic, null, 2)}

固定 slug：${slug}
总集数：${args.episodeCount}
免费试看集数：${Math.min(3, args.episodeCount)}

要求：
1. 前 3 集必须强钩子、强反转、强验证价值。
2. 每集都要有戏剧任务、人物目标、冲突、转折和结尾钩子。
3. AI漫剧强化画面、角色一致性、图生视频潜力。
4. AI短剧强化真人表演、台词潜台词和低成本场景调度。
`.trim(),
    schema: outlineSchema()
  });

  outline.slug = slug;
  outline.mode = normalizeMode(outline.mode || topic.mode);
  outline.episodePlans = outline.episodePlans
    .slice(0, args.episodeCount)
    .map((plan, index) => ({ ...plan, episodeNumber: index + 1 }));
  return outline;
}

function episodeBaseSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["episodeNumber", "title", "duration", "story", "dramaticPurpose", "characterGoals", "conflict", "endingHook"],
    properties: {
      episodeNumber: { type: "integer" },
      title: { type: "string" },
      duration: { type: "string" },
      story: { type: "string" },
      dramaticPurpose: { type: "string" },
      characterGoals: { type: "string" },
      conflict: { type: "string" },
      endingHook: { type: "string" }
    }
  };
}

async function generateEpisodeBaseWithOpenAI(outline, plan, args) {
  return callOpenAIJson({
    args,
    label: `episode base ${outline.slug}-${plan.episodeNumber}`,
    system: "你是专业短剧单集正文生成系统。只返回严格 JSON。",
    prompt: `
根据剧本母版和本集大纲，生成单集正文基础版。

母版：
${JSON.stringify({
  title: outline.title,
  mode: outline.mode,
  logline: outline.logline,
  synopsis: outline.synopsis,
  characters: outline.characters,
  worldview: outline.worldview,
  visualStyle: outline.visualStyle,
  tone: outline.tone
}, null, 2)}

本集大纲：
${JSON.stringify(plan, null, 2)}

要求：
1. story 控制在 450-700 字。
2. 必须有铺垫、压迫、转折、爆发、余韵。
3. 不要生成 storyboard、promptZh、promptEn。
4. 只返回合法 JSON。
`.trim(),
    schema: episodeBaseSchema()
  });
}

function storyboardSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["episodeNumber", "storyboard"],
    properties: {
      episodeNumber: { type: "integer" },
      storyboard: {
        type: "array",
        minItems: 4,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["shot", "duration", "visual", "camera", "action", "dialogue", "sound", "emotion"],
          properties: {
            shot: { type: "integer" },
            duration: { type: "string" },
            visual: { type: "string" },
            camera: { type: "string" },
            action: { type: "string" },
            dialogue: { type: "string" },
            sound: { type: "string" },
            emotion: { type: "string" }
          }
        }
      }
    }
  };
}

async function generateStoryboardWithOpenAI(outline, episode, args) {
  return callOpenAIJson({
    args,
    label: `storyboard ${outline.slug}-${episode.episodeNumber}`,
    system: "你是专业影视导演、分镜导演、视听语言顾问。只返回严格 JSON。",
    prompt: `
根据单集正文生成高级分镜 JSON。

剧名：${outline.title}
内容类型：${outline.mode}
视觉风格：${outline.visualStyle}
情绪基调：${outline.tone}

单集正文：
${JSON.stringify(episode, null, 2)}

要求：
1. storyboard 正好 4 个镜头。
2. 每个镜头必须包含视觉、镜头语言、人物动作、台词、声音、情绪目的。
3. 镜头语言必须服务剧情，不要空泛炫技。
`.trim(),
    schema: storyboardSchema()
  });
}

function promptsSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["episodeNumber", "promptZh", "promptEn"],
    properties: {
      episodeNumber: { type: "integer" },
      promptZh: { type: "string" },
      promptEn: { type: "string" }
    }
  };
}

async function generatePromptsWithOpenAI(outline, episode, storyboard, args) {
  return callOpenAIJson({
    args,
    label: `prompts ${outline.slug}-${episode.episodeNumber}`,
    system: "你是专业 AI 视频提示词工程师。只返回严格 JSON。",
    prompt: `
根据单集正文和高级分镜，生成中文和英文 AI 视频提示词。

剧名：${outline.title}
内容类型：${outline.mode}
视觉风格：${outline.visualStyle}

单集：
${JSON.stringify(episode, null, 2)}

分镜：
${JSON.stringify(storyboard, null, 2)}

要求：
1. promptZh 不少于 220 字，必须具体到人物、场景、动作、镜头、光影、情绪、空间层次。
2. promptEn 不少于 100 words，production-ready。
3. 只返回合法 JSON。
`.trim(),
    schema: promptsSchema()
  });
}

async function generateProductionInputWithOpenAI(topic, args, index, usedSlugs) {
  const slug = ensureUniqueSlug(toSlug(topic.slugBase), usedSlugs);
  const outline = await generateOutlineWithOpenAI(topic, args, slug);
  const episodes = [];

  for (const plan of outline.episodePlans) {
    await sleep(args.requestDelayMs);
    const base = await generateEpisodeBaseWithOpenAI(outline, plan, args);
    await sleep(args.requestDelayMs);
    const storyboardResult = await generateStoryboardWithOpenAI(outline, base, args);
    await sleep(args.requestDelayMs);
    const prompts = await generatePromptsWithOpenAI(outline, base, storyboardResult.storyboard, args);
    episodes.push({
      ...base,
      storyboard: storyboardResult.storyboard,
      promptZh: prompts.promptZh,
      promptEn: prompts.promptEn
    });
  }

  return convertScriptPackageToProductionInput({
    slug,
    status: args.status,
    featured: args.featured,
    master: {
      title: outline.title,
      titleEn: outline.titleEn,
      mode: outline.mode,
      category: outline.category,
      logline: outline.logline,
      synopsis: outline.synopsis,
      sellingPoints: outline.sellingPoints,
      targetAudience: outline.targetAudience,
      recommendedPlatforms: outline.recommendedPlatforms,
      audienceTags: outline.audienceTags,
      episodeCount: args.episodeCount,
      freeEpisodeCount: Math.min(3, args.episodeCount),
      commercialModel: {
        buyout: "一次性买断完整剧本包。",
        payPerEpisode: "按集购买后续内容。",
        revenueShare: "按视频收益比例分成。"
      },
      characters: outline.characters,
      worldview: outline.worldview,
      visualStyle: outline.visualStyle,
      tone: outline.tone
    },
    episodes
  }, args, topic, index);
}

function convertScriptPackageToProductionInput(scriptPackage, args, topic, index) {
  const rawMaster = scriptPackage.master || {};
  const slug = scriptPackage.slug;
  const primaryMode = normalizeMode(rawMaster.mode || topic.mode);
  const episodes = (scriptPackage.episodes || []).map((episode) => {
    const shots = (episode.storyboard || []).map((shot) => ({
      shot: shot.shot,
      duration: shot.duration,
      visual: shot.visual,
      camera: shot.camera,
      action: shot.action,
      dialogue: shot.dialogue,
      sound: shot.sound,
      emotion: shot.emotion,
      aiPromptZh: episode.promptZh,
      aiPromptEn: episode.promptEn
    }));

    return {
      episodeNumber: Number(episode.episodeNumber),
      title: episode.title,
      hook: episode.endingHook || episode.conflict || episode.title,
      summary: episode.story,
      endingHook: episode.endingHook,
      scriptText: episode.story,
      productionValue: `${episode.dramaticPurpose || ""}\n${episode.characterGoals || ""}\n${episode.conflict || ""}`.trim(),
      aiShortDrama: {
        runtimeSeconds: 75,
        scriptText: episode.story,
        shots,
        editingNotes: [episode.dramaticPurpose, episode.conflict, episode.endingHook].filter(Boolean)
      },
      aiManhuaDrama: {
        panelCount: shots.length,
        scriptText: episode.story,
        panels: shots,
        layoutNotes: ["竖屏AI漫剧构图", "保持角色一致性", "强化光影、情绪和镜头层次"]
      }
    };
  });

  return {
    slug,
    status: args.status,
    featured: args.featured,
    trendEvidence: [
      {
        source: args.provider === "openai" ? "openai_responses_web_search" : "codex_template_hot_seed",
        keyword: (topic.trendSignals || []).join(" / "),
        heatScore: 88 - (index % 9),
        observedAt: new Date().toISOString()
      }
    ],
    master: {
      slug,
      title: {
        zh: rawMaster.title || topic.title || slug,
        en: rawMaster.titleEn || topic.titleEn || ""
      },
      primaryMode,
      supportedModes: [primaryMode],
      logline: rawMaster.logline || topic.logline || "",
      synopsis: rawMaster.synopsis || "",
      category: rawMaster.category || topic.category || "AI短剧",
      recommendedPlatforms: rawMaster.recommendedPlatforms || ["抖音", "快手", "视频号"],
      audienceTags: rawMaster.audienceTags || rawMaster.sellingPoints || topic.audienceTags || ["短剧用户"],
      productionDifficulty: rawMaster.productionDifficulty || "medium",
      episodeCount: rawMaster.episodeCount || episodes.length,
      freeEpisodeCount: rawMaster.freeEpisodeCount || Math.min(3, episodes.length),
      commercialPolicy: {
        buyout: rawMaster.commercialModel?.buyout || "一次性买断完整剧本包。",
        payPerEpisode: rawMaster.commercialModel?.payPerEpisode || "按集购买后续内容。",
        revenueShare: rawMaster.commercialModel?.revenueShare || "按视频收益比例分成。"
      },
      characters: rawMaster.characters || [],
      worldview: rawMaster.worldview || "",
      visualStyle: rawMaster.visualStyle || topic.visualStyle || "",
      tone: rawMaster.tone || "",
      episodeOutline: episodes.map((episode) => ({
        episodeNumber: episode.episodeNumber,
        title: episode.title,
        hook: episode.hook,
        summary: episode.summary,
        endingHook: episode.endingHook
      }))
    },
    episodes
  };
}

function generateProductionInput(topic, args, index, usedSlugs) {
  const slug = ensureUniqueSlug(toSlug(topic.slugBase), usedSlugs);
  const primaryMode = normalizeMode(topic.mode);
  const episodes = Array.from({ length: args.episodeCount }, (_, episodeIndex) =>
    buildEpisode(topic, slug, primaryMode, episodeIndex + 1, args.episodeCount)
  );

  return {
    slug,
    status: args.status,
    featured: args.featured,
    trendEvidence: [
      {
        source: args.provider === "template" ? "codex_template_hot_seed" : "codex_llm_hot_seed",
        keyword: topic.trendSignals.join(" / "),
        heatScore: 86 - (index % 7),
        observedAt: new Date().toISOString()
      }
    ],
    master: {
      slug,
      title: {
        zh: topic.title,
        en: topic.titleEn
      },
      primaryMode,
      supportedModes: [primaryMode],
      logline: topic.logline,
      synopsis: buildSynopsis(topic, args.episodeCount),
      category: topic.category,
      recommendedPlatforms: ["抖音", "快手", "视频号", "TikTok", "YouTube Shorts"],
      audienceTags: topic.audienceTags,
      productionDifficulty: "medium",
      episodeCount: args.episodeCount,
      freeEpisodeCount: Math.min(3, args.episodeCount),
      commercialPolicy: {
        buyout: "一次性买断完整剧本包，适合已经验证题材数据、准备连续更新的账号团队。",
        payPerEpisode: "按集购买后续内容，适合边生产边观察播放和转化数据的账号。",
        revenueShare: "无需预付剧本费，审核通过后可继续制作，并按视频收益约定比例分成。"
      },
      characters: buildCharacters(topic),
      worldview: buildWorldview(topic),
      visualStyle: topic.visualStyle,
      tone: "情绪克制但压迫，反转密集，人物动机清楚，结尾必须制造继续观看理由。",
      episodeOutline: episodes.map((episode) => ({
        episodeNumber: episode.episodeNumber,
        title: episode.title,
        hook: episode.hook,
        summary: episode.summary,
        endingHook: episode.endingHook
      }))
    },
    episodes
  };
}

function buildSynopsis(topic, episodeCount) {
  return `${topic.logline} 故事以${topic.trendSignals.slice(0, 3).join("、")}为核心爆点，前3集快速完成身份压迫、规则揭示和第一次反击，让观众立刻看到题材潜力。后续${episodeCount}集围绕证据、关系、资源和隐藏真相逐步推进，每一集都保留新的误解、危机或反转。主角不是单纯靠喊话获胜，而是在压力中做选择、付代价、拿证据，用一次次具体行动改写既定命运。`;
}

function buildCharacters(topic) {
  return [
    {
      name: "许知微",
      role: "核心主角，带着前世记忆或关键信息重新入局的人",
      motivation: "保护自己真正重视的人，同时夺回被掠夺的身份、资源和话语权",
      secret: "她知道第一场灾难或陷害会如何发生，但不知道幕后真正操盘者是谁",
      visualDesign: "清冷克制的年轻女性，前期素色外套，后期线条利落，眼神从迟疑变得锋利"
    },
    {
      name: "陆沉舟",
      role: "表面冷漠的关键同盟，掌握局部真相",
      motivation: "查清旧案，同时确认主角是否值得信任",
      secret: "他与上一轮悲剧存在间接关系，曾经做过一次错误选择",
      visualDesign: "深色风衣或西装，常处于玻璃反光和阴影边缘，表情克制"
    },
    {
      name: "乔安然",
      role: "表层反派，擅长利用情绪和舆论制造误解",
      motivation: "守住既得利益，避免自己被证据链拖下水",
      secret: "她并非最终操盘者，只是更大计划里的执行者",
      visualDesign: "精致浅色造型，笑容温和，眼神里有被压住的慌乱"
    }
  ];
}

function buildWorldview(topic) {
  return `这是一个短视频舆论、家庭关系和资源竞争高度交织的世界。${topic.trendSignals.join("、")}不是装饰性元素，而是推动人物做选择的规则。主角每一次胜利都必须付出信息、信任或关系代价。`;
}

function buildEpisode(topic, slug, primaryMode, episodeNumber, episodeCount) {
  const phase = episodeNumber === 1
    ? "开局钩子"
    : episodeNumber === episodeCount
      ? "阶段反转"
      : "压迫升级";
  const title = `${phase}：${topic.trendSignals[(episodeNumber - 1) % topic.trendSignals.length]}`;
  const hook = buildHook(topic, episodeNumber);
  const summary = buildSummary(topic, episodeNumber, episodeCount);
  const endingHook = buildEndingHook(topic, episodeNumber, episodeCount);
  const shots = buildShots(topic, primaryMode, episodeNumber, summary, endingHook);

  return {
    episodeNumber,
    title,
    hook,
    summary,
    endingHook,
    scriptText: summary,
    productionValue: `本集目标是完成${phase}，用${topic.trendSignals.join("、")}建立短剧钩子，同时让人物选择推动剧情。`,
    aiShortDrama: {
      runtimeSeconds: 75,
      scriptText: summary,
      shots,
      editingNotes: [
        "竖屏节奏，开头3秒必须给出强信息差。",
        "台词保持克制，让停顿、眼神和道具承担潜台词。",
        "每个镜头都服务本集冲突，不做空泛炫技。"
      ]
    },
    aiManhuaDrama: {
      panelCount: shots.length,
      scriptText: summary,
      panels: shots,
      layoutNotes: [
        "竖屏AI漫剧构图，主体明确，背景参与叙事。",
        "保持角色服装、发型、面部特征一致。",
        "用光影和前景遮挡制造压迫感。"
      ]
    }
  };
}

function buildHook(topic, episodeNumber) {
  if (episodeNumber === 1) {
    return `${topic.title}开场，主角在所有人都以为她会退让时，提前说出即将发生的第一件灾难。`;
  }
  return `主角刚扳回一局，新的证据却指向她最不愿怀疑的人。`;
}

function buildSummary(topic, episodeNumber, episodeCount) {
  const pressure = topic.trendSignals[(episodeNumber - 1) % topic.trendSignals.length];
  const turn = topic.trendSignals[episodeNumber % topic.trendSignals.length];
  const finalBeat = episodeNumber === episodeCount ? "她赢下眼前这一局，却发现真正的操盘者从未露面。" : "她没有立刻反击，而是把对方留下的破绽藏进下一步计划。";
  return `第${episodeNumber}集围绕“${pressure}”展开。主角许知微在熟悉的空间里察觉到一个前世没有注意过的细节：对方的话术、站位和时间点全部提前排练过。她没有直接拆穿，而是先让自己处在被误解的位置，引诱乔安然把隐藏证据暴露给旁观者。陆沉舟试图阻止她冒险，因为这一步一旦失败，她会同时失去舆论和家人的信任。许知微短暂停顿，选择把真正的底牌压到最后。场面从表面的争执转为证据链的对峙，${turn}成为本集转折。${finalBeat}`;
}

function buildEndingHook(topic, episodeNumber, episodeCount) {
  if (episodeNumber === episodeCount) {
    return `系统或关键证据刷新出下一阶段目标：真正改写命运的人，不是她自己。`;
  }
  return `最后一秒，主角收到一条匿名消息：你以为你救下的人，明天会亲手背叛你。`;
}

function buildShots(topic, primaryMode, episodeNumber, summary, endingHook) {
  const promptZh = `${topic.visualStyle}，第${episodeNumber}集，竖屏构图，人物表情克制但压迫，前景遮挡制造窥视感，低机位建立权力关系，光影参与叙事，画面围绕“${topic.trendSignals.join("、")}”展开，适合AI视频生产。`;
  const promptEn = `Vertical cinematic short drama, episode ${episodeNumber}, controlled emotional tension, layered foreground obstruction, low-angle pressure, realistic micro expressions, dramatic lighting, ${topic.trendSignals.join(", ")}, production-ready AI video prompt.`;
  const shotLabels = ["压迫建立", "信息错位", "反打对峙", "结尾钩子"];
  return shotLabels.map((label, index) => ({
    shot: index + 1,
    duration: "6-8秒",
    visual: `${label}。画面采用${primaryMode === "ai_manhua_drama" ? "漫画质感竖屏分镜" : "真人短剧竖屏调度"}，主体位于画面三分线，背景保留关键道具和人群反应。`,
    camera: index % 2 === 0 ? "中近景缓慢推进，焦点从前景道具转到主角眼神。" : "反打镜头压缩空间，利用长焦制造窒息感。",
    action: "主角先停顿半拍，手指收紧，眼神从回避转为直视，对方笑容出现细微裂缝。",
    dialogue: index === 3 ? endingHook : "你说得太快了，像是早就排练过。",
    sound: "低频环境声、衣料摩擦、远处人声压低，关键停顿处抽空背景音乐。",
    emotion: `${label}服务于本集冲突，让观众感到关系正在悄悄反转。`,
    aiPromptZh: promptZh,
    aiPromptEn: promptEn
  }));
}

function scoreProductionInput(input) {
  const failures = [];
  if (!input.slug || !slugPattern.test(input.slug)) failures.push("invalid slug");
  if (input.master?.slug !== input.slug) failures.push("master.slug mismatch");
  if (!input.master?.title?.zh) failures.push("missing title.zh");
  if (!input.master?.logline) failures.push("missing logline");
  if (!input.master?.synopsis) failures.push("missing synopsis");
  if (!Array.isArray(input.master?.recommendedPlatforms)) failures.push("recommendedPlatforms must be array");
  if (!Array.isArray(input.master?.audienceTags)) failures.push("audienceTags must be array");
  if (!Array.isArray(input.episodes) || !input.episodes.length) failures.push("episodes missing");

  (input.episodes || []).forEach((episode) => {
    ["title", "hook", "summary", "endingHook"].forEach((fieldName) => {
      if (!String(episode[fieldName] || "").trim()) failures.push(`episode ${episode.episodeNumber} missing ${fieldName}`);
    });
    const promptZh = episode.aiShortDrama?.shots?.[0]?.aiPromptZh || episode.aiManhuaDrama?.panels?.[0]?.aiPromptZh;
    const promptEn = episode.aiShortDrama?.shots?.[0]?.aiPromptEn || episode.aiManhuaDrama?.panels?.[0]?.aiPromptEn;
    if (!promptZh) failures.push(`episode ${episode.episodeNumber} missing aiPromptZh`);
    if (!promptEn) failures.push(`episode ${episode.episodeNumber} missing aiPromptEn`);
  });

  return {
    passed: failures.length === 0,
    score: Math.max(0, 100 - failures.length * 12),
    failures
  };
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function relativePath(filePath) {
  return path.relative(projectRoot, filePath).replace(/\\/g, "/");
}

function runProduction(inputFile, args) {
  const commandArgs = [
    "scripts/run-daily-script-production.js",
    "--input",
    inputFile,
    ...(args.productionDryRun ? ["--dry-run"] : [])
  ];
  const result = spawnSync("node", commandArgs, {
    cwd: projectRoot,
    encoding: "utf8",
    shell: false
  });
  return {
    ok: result.status === 0,
    command: ["node", ...commandArgs].join(" "),
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    status: result.status
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const usedSlugs = new Set();
  const generated = [];
  const topics = args.provider === "openai" ? await generateHotTopicsWithOpenAI(args) : null;

  for (let index = 0; index < args.count; index += 1) {
    const topic = topics ? topics[index % topics.length] : pickTopic(index, args.mode);
    const input =
      args.provider === "openai"
        ? await generateProductionInputWithOpenAI(topic, args, index, usedSlugs)
        : generateProductionInput(topic, args, index, usedSlugs);
    const quality = scoreProductionInput(input);
    const filePath = path.join(args.outputDir, `generated-${input.slug}.json`);
    const inputFile = relativePath(filePath);

    if (quality.passed) {
      writeJson(filePath, input);
    }

    const production = args.autoProduce && quality.passed ? runProduction(inputFile, args) : null;
    generated.push({
      slug: input.slug,
      title: input.master.title.zh,
      inputFile,
      mode: input.master.primaryMode,
      episodeCount: input.episodes.length,
      quality,
      written: quality.passed,
      production
    });
  }

  const manifestPath = path.join(args.outputDir, `generated-batch-${args.batchId}.json`);
  const manifest = {
    ok: generated.every((item) => item.quality.passed && (!item.production || item.production.ok)),
    batchId: args.batchId,
    provider: args.provider,
    count: args.count,
    episodeCount: args.episodeCount,
    mode: args.mode,
    autoProduce: args.autoProduce,
    productionDryRun: args.productionDryRun,
    generated
  };
  writeJson(manifestPath, manifest);

  console.log(JSON.stringify({
    ...manifest,
    manifestFile: relativePath(manifestPath)
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({
    ok: false,
    error: error.message
  }, null, 2));
  process.exit(1);
});
