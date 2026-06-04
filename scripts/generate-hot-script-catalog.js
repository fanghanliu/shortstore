const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { buildScriptData } = require("./build-script-data-from-source");
const { generateFreePreview } = require("./generate-docx-deliveries");

const projectRoot = path.join(__dirname, "..");
const contentSourceDir = path.join(projectRoot, "content-source");
const scriptsDataDir = path.join(projectRoot, "scripts-data");
const coverDir = path.join(projectRoot, "public", "site", "assets", "covers", "hot-catalog");

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(filePath, data) {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function writeText(filePath, content) {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function safeSvgText(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function slugKey(slug) {
  return slug.replace(/-/g, "_");
}

function splitCoverLines(value, lineLength = 8, maxLines = 3) {
  const chars = Array.from(String(value || ""));
  const lines = [];
  for (let index = 0; index < chars.length && lines.length < maxLines; index += lineLength) {
    lines.push(chars.slice(index, index + lineLength).join(""));
  }
  return lines.length ? lines : ["未命名剧本"];
}

function includesAny(value, keywords) {
  return keywords.some((keyword) => String(value || "").includes(keyword));
}

function coverSceneType(item) {
  const source = `${item.title} ${item.trope} ${item.setting} ${item.coreItem}`;
  if (includesAny(source, ["末日", "末世", "废土", "荒原", "安全区", "废校", "天灾"])) return "wasteland";
  if (includesAny(source, ["雪", "北境", "雪原"])) return "snow";
  if (includesAny(source, ["海", "鲸", "岛", "海市", "沉海"])) return "ocean";
  if (includesAny(source, ["鬼", "阴", "城隍", "怪谈", "走阴", "民俗", "血月"])) return "supernatural";
  if (includesAny(source, ["宫", "朝堂", "王府", "女帝", "科举", "王朝", "郡主"])) return "palace";
  if (includesAny(source, ["直播", "办公室", "算法", "热线", "行车", "证据", "律师", "相亲", "职场"])) return "modern";
  if (includesAny(source, ["仙", "宗", "天庭", "渡劫", "神", "月庭", "山海"])) return "celestial";
  return item.mode === "ai_short_drama" ? "modern" : "fantasy";
}

function coverSceneBackdrop(type, colors) {
  const { bg, accent, second, text } = colors;
  const commonStars = `
    <circle cx="144" cy="240" r="3" fill="${text}" opacity="0.42"/>
    <circle cx="735" cy="188" r="4" fill="${accent}" opacity="0.48"/>
    <circle cx="812" cy="482" r="3" fill="${second}" opacity="0.42"/>`;

  if (type === "wasteland") {
    return `${commonStars}
    <path d="M0 1140 C180 1070 310 1115 470 1048 C640 976 760 1008 941 930 L941 1672 L0 1672 Z" fill="#09090b" opacity="0.82"/>
    <path d="M76 1020 L146 850 L204 1020 M238 1035 L284 890 L352 1035 M612 985 L672 805 L742 985" fill="none" stroke="${accent}" stroke-width="10" opacity="0.38"/>
    <path d="M116 1184 L858 1184" stroke="${second}" stroke-width="3" opacity="0.55"/>`;
  }

  if (type === "snow") {
    return `${commonStars}
    <path d="M0 1035 L190 760 L324 1035 L510 692 L690 1035 L842 815 L941 1035 L941 1672 L0 1672 Z" fill="#e0f2fe" opacity="0.2"/>
    <path d="M0 1205 C180 1135 310 1180 470 1120 C650 1054 780 1100 941 1015 L941 1672 L0 1672 Z" fill="#f8fafc" opacity="0.18"/>
    <g stroke="${text}" opacity="0.34" stroke-width="3"><path d="M160 324 l28 48 l28 -48"/><path d="M710 396 l24 40 l24 -40"/><path d="M806 690 l18 30 l18 -30"/></g>`;
  }

  if (type === "ocean") {
    return `${commonStars}
    <path d="M0 1110 C140 1030 250 1170 392 1085 C530 1000 642 1116 780 1042 C850 1005 900 1000 941 1008 L941 1672 L0 1672 Z" fill="${second}" opacity="0.2"/>
    <path d="M90 1185 C190 1120 292 1240 410 1170 C528 1100 642 1228 770 1162 C850 1120 900 1118 941 1126" fill="none" stroke="${accent}" stroke-width="8" opacity="0.45"/>
    <ellipse cx="707" cy="828" rx="124" ry="34" fill="${accent}" opacity="0.25"/><path d="M600 828 C670 730 790 744 842 826" fill="none" stroke="${accent}" stroke-width="7" opacity="0.45"/>`;
  }

  if (type === "supernatural") {
    return `${commonStars}
    <circle cx="725" cy="350" r="116" fill="${accent}" opacity="0.18"/>
    <path d="M100 1040 C190 886 276 886 356 1040 M586 1040 C676 886 762 886 842 1040" fill="none" stroke="${accent}" stroke-width="8" opacity="0.35"/>
    <g fill="none" stroke="${second}" stroke-width="5" opacity="0.48"><path d="M156 642 L156 780"/><path d="M122 642 L190 642 L190 720 Q156 758 122 720 Z"/><path d="M770 606 L770 742"/><path d="M736 606 L804 606 L804 684 Q770 722 736 684 Z"/></g>`;
  }

  if (type === "palace") {
    return `${commonStars}
    <path d="M110 978 L470 688 L830 978" fill="none" stroke="${accent}" stroke-width="12" opacity="0.44"/>
    <path d="M178 980 L178 1260 M310 900 L310 1260 M470 792 L470 1260 M630 900 L630 1260 M762 980 L762 1260" stroke="${second}" stroke-width="10" opacity="0.28"/>
    <path d="M96 1260 L845 1260" stroke="${accent}" stroke-width="7" opacity="0.5"/>`;
  }

  if (type === "modern") {
    return `${commonStars}
    <rect x="118" y="530" width="704" height="602" rx="28" fill="#020617" opacity="0.35" stroke="${accent}" stroke-width="4"/>
    <g stroke="${second}" stroke-width="3" opacity="0.28">${Array.from({ length: 6 }, (_, index) => `<path d="M${190 + index * 110} 560 L${190 + index * 110} 1098"/>`).join("")}${Array.from({ length: 5 }, (_, index) => `<path d="M140 ${640 + index * 90} L800 ${640 + index * 90}"/>`).join("")}</g>
    <rect x="604" y="342" width="160" height="292" rx="24" fill="#0f172a" stroke="${accent}" stroke-width="7" opacity="0.72"/><circle cx="684" cy="598" r="10" fill="${accent}" opacity="0.8"/>`;
  }

  if (type === "celestial") {
    return `${commonStars}
    <path d="M86 1050 C220 840 390 874 470 640 C560 850 720 826 858 1050" fill="none" stroke="${accent}" stroke-width="10" opacity="0.45"/>
    <path d="M146 1100 C300 1000 470 1024 620 930 C744 852 850 868 941 790" fill="none" stroke="${second}" stroke-width="6" opacity="0.4"/>
    <circle cx="470" cy="585" r="94" fill="${second}" opacity="0.16" stroke="${accent}" stroke-width="6"/>`;
  }

  return `${commonStars}
    <path d="M70 1080 C220 940 330 1000 470 850 C610 1000 760 910 890 1080 L890 1672 L70 1672 Z" fill="#020617" opacity="0.55"/>
    <path d="M120 1184 C300 1090 510 1190 820 1050" fill="none" stroke="${accent}" stroke-width="7" opacity="0.42"/>`;
}

function coverPropShape(item, colors) {
  const { accent, second, text } = colors;
  const source = `${item.title} ${item.trope} ${item.coreItem}`;
  const core = safeSvgText(item.coreItem);

  if (includesAny(source, ["直播", "算法", "热线", "记录仪", "手机", "证据", "相亲"])) {
    return `<rect x="332" y="438" width="278" height="430" rx="34" fill="#0f172a" stroke="${accent}" stroke-width="8"/>
    <rect x="364" y="496" width="214" height="248" rx="18" fill="${second}" opacity="0.14"/>
    <path d="M382 790 L560 790 M382 828 L510 828" stroke="${text}" stroke-width="8" opacity="0.72"/>
    <circle cx="470" cy="835" r="18" fill="${accent}" opacity="0.9"/>
    <text x="470" y="682" text-anchor="middle" fill="${text}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="34" font-weight="800">${core}</text>`;
  }

  if (includesAny(source, ["剑", "刀"])) {
    return `<path d="M470 330 L530 775 L470 950 L410 775 Z" fill="${accent}" opacity="0.78"/>
    <path d="M430 770 L540 770" stroke="${text}" stroke-width="18" opacity="0.75"/>
    <path d="M470 366 L470 918" stroke="${text}" stroke-width="5" opacity="0.46"/>
    <text x="470" y="1015" text-anchor="middle" fill="${text}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="38" font-weight="800">${core}</text>`;
  }

  if (includesAny(source, ["书", "经卷", "账本", "证明", "档案", "卷", "榜", "票"])) {
    return `<path d="M298 455 Q470 390 642 455 L642 870 Q470 805 298 870 Z" fill="#f8fafc" opacity="0.82"/>
    <path d="M470 424 L470 826" stroke="${accent}" stroke-width="6" opacity="0.72"/>
    <path d="M344 548 L430 526 M344 618 L430 596 M516 526 L600 548 M516 596 L600 618" stroke="#0f172a" stroke-width="8" opacity="0.55"/>
    <text x="470" y="724" text-anchor="middle" fill="#0f172a" font-family="Microsoft YaHei, Arial, sans-serif" font-size="36" font-weight="800">${core}</text>`;
  }

  if (includesAny(source, ["卡", "玉", "石", "骨", "铃", "钟", "炉", "种", "印"])) {
    return `<path d="M470 374 L650 528 L598 812 L470 950 L342 812 L290 528 Z" fill="${second}" opacity="0.7" stroke="${accent}" stroke-width="9"/>
    <path d="M342 528 L598 812 M650 528 L342 812 M470 374 L470 950" stroke="${text}" stroke-width="4" opacity="0.38"/>
    <circle cx="470" cy="654" r="92" fill="#020617" opacity="0.22"/>
    <text x="470" y="670" text-anchor="middle" fill="${text}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="40" font-weight="800">${core}</text>`;
  }

  return `<rect x="312" y="450" width="316" height="420" rx="42" fill="#0f172a" opacity="0.72" stroke="${accent}" stroke-width="8"/>
    <circle cx="470" cy="596" r="96" fill="${second}" opacity="0.2" stroke="${accent}" stroke-width="5"/>
    <path d="M380 742 C430 690 510 690 560 742" fill="none" stroke="${text}" stroke-width="8" opacity="0.62"/>
    <text x="470" y="660" text-anchor="middle" fill="${text}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="40" font-weight="800">${core}</text>`;
}

function coverCharacterSilhouette(item, colors) {
  const { accent, second, text } = colors;
  const role = safeSvgText(item.protagonistRole || item.protagonist);
  return `<g opacity="0.92">
    <ellipse cx="470" cy="922" rx="122" ry="40" fill="#020617" opacity="0.42"/>
    <circle cx="470" cy="702" r="74" fill="#111827" stroke="${accent}" stroke-width="6"/>
    <path d="M330 1040 C350 870 402 788 470 788 C538 788 590 870 610 1040 Z" fill="#111827" stroke="${accent}" stroke-width="6"/>
    <path d="M408 680 C440 715 505 715 538 680" fill="none" stroke="${second}" stroke-width="7" opacity="0.7"/>
    <path d="M332 912 C244 906 208 836 188 750 M608 912 C696 906 732 836 752 750" fill="none" stroke="${accent}" stroke-width="12" opacity="0.52"/>
    <text x="470" y="1130" text-anchor="middle" fill="${text}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="30" font-weight="700" opacity="0.9">${role}</text>
  </g>`;
}

function coverSvg(item) {
  const [bg, accent, second, text] = item.palette;
  const titleParts = splitCoverLines(item.title, item.title.length > 16 ? 8 : 9, 3);
  const sceneType = coverSceneType(item);
  const colors = { bg, accent, second, text };
  const subtitle = item.mode === "ai_manhua_drama" ? "AI MANHUA ORIGINAL COVER" : "AI SHORT DRAMA ORIGINAL COVER";
  const titleStart = 1198 - Math.max(0, titleParts.length - 2) * 42;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="941" height="1672" viewBox="0 0 941 1672">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="58%">
      <stop offset="0" stop-color="${second}" stop-opacity="0.72"/>
      <stop offset="1" stop-color="${bg}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="softShadow"><feDropShadow dx="0" dy="22" stdDeviation="24" flood-color="#020617" flood-opacity="0.48"/></filter>
  </defs>
  <rect width="941" height="1672" fill="url(#bg)"/>
  <rect width="941" height="1672" fill="url(#glow)" opacity="0.82"/>
  <circle cx="780" cy="286" r="210" fill="${accent}" opacity="0.14" filter="url(#blur)"/>
  <circle cx="158" cy="1160" r="270" fill="${second}" opacity="0.12" filter="url(#blur)"/>
  ${coverSceneBackdrop(sceneType, colors)}
  <rect x="68" y="82" width="805" height="1508" rx="30" fill="none" stroke="${accent}" stroke-width="4" opacity="0.66"/>
  <rect x="92" y="108" width="757" height="1458" rx="22" fill="#020617" opacity="0.12"/>
  <text x="104" y="168" fill="${accent}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="25" font-weight="800">${subtitle}</text>
  <text x="104" y="214" fill="${text}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="25" opacity="0.72">${safeSvgText(item.trope)} · ${safeSvgText(item.setting)}</text>
  <g filter="url(#softShadow)">
    ${coverPropShape(item, colors)}
    ${coverCharacterSilhouette(item, colors)}
  </g>
  <rect x="92" y="1156" width="757" height="328" rx="24" fill="#020617" opacity="0.58"/>
  ${titleParts
    .map(
      (line, index) =>
        `<text x="122" y="${titleStart + index * 76}" fill="${text}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="61" font-weight="900">${safeSvgText(line)}</text>`
    )
    .join("\n  ")}
  <text x="122" y="1430" fill="${accent}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="28" font-weight="800">核心道具：${safeSvgText(item.coreItem)}</text>
  <text x="122" y="1476" fill="${text}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="25" opacity="0.78">${safeSvgText(item.category)} / ${safeSvgText(item.antagonist)}压迫局</text>
  <path d="M122 1518 L816 1518" stroke="${accent}" stroke-width="3" opacity="0.46"/>
  <text x="122" y="1558" fill="${text}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="22" opacity="0.62">前三集验证包 · 买断 · 按集 · 分成</text>
</svg>
`;
  writeText(path.join(projectRoot, "public", "site", item.coverImage), svg);
}

function episodeTitleFor(item, index) {
  const openings = item.episodeBeats || [
    "开局反杀",
    "旧账现身",
    "第一场交易",
    "不该出现的人",
    "禁地入口",
    "同盟试探",
    "假证据",
    "暗线浮出",
    "城中追捕",
    "身份裂痕",
    "第二个规则",
    "被偷走的名单",
    "夜半审判",
    "反派递刀",
    "旧案重启",
    "核心失控",
    "全网围猎",
    "真相倒计时",
    "主角失势",
    "底牌公开",
    "盟友背叛",
    "终局谈判",
    "最后一次反转",
    "新危机来信"
  ];
  return openings[(index - 1) % openings.length];
}

function buildEpisode(item, index) {
  const title = episodeTitleFor(item, index);
  const arcNames = item.mode === "ai_manhua_drama"
    ? ["强钩子开局", "付费承接", "世界观扩大", "真相爆发", "终局兑现"]
    : ["爆点开局", "关系拉扯", "证据升级", "舆论反噬", "情绪兑现"];
  const arc = index <= 3 ? arcNames[0] : index <= 9 ? arcNames[1] : index <= 15 ? arcNames[2] : index <= 21 ? arcNames[3] : arcNames[4];
  const hook = `${item.protagonist}在${item.setting}里发现${item.coreItem}与“${title}”有关，原本要害她的人反而被迫求她出手。`;
  const summary = `${item.protagonist}围绕${item.coreItem}展开调查或交易，先被${item.antagonist}制造压力，再抓住一个被忽略的细节，把局势从被动防守改成主动设局。本集重点展示${item.worldSignal}，让观众看到题材差异和主角能力。`;
  const endingHook = `${item.antagonist}留下的新证据显示：${item.secret}。`;

  return {
    episodeNumber: index,
    title,
    hook,
    summary,
    endingHook,
    characters: [item.protagonist, item.ally, item.antagonist].filter(Boolean),
    locations: item.locations,
    reversalPoint: endingHook,
    productionValue: `本集提供可直接制作的${item.mode === "ai_manhua_drama" ? "逐格漫剧分镜" : "逐镜头短剧执行表"}、对白/字幕、音效、景深、主体聚焦、中英文提示词和反向提示词。`,
    scriptText: `开场直接落在“${hook}”，不要解释设定，先让观众看到主角被迫选择。中段把冲突拆成三步：${item.antagonist}制造压力，${item.protagonist}发现${item.coreItem}的异常，主角用反常动作改写规则。结尾停在“${endingHook}”，不解释答案，给下一集留下追问。`,
    paidScope: index > 3,
    status: "published",
    arc,
    isFreePreview: index <= 3,
    ...(item.mode === "ai_manhua_drama"
      ? { aiManhuaDrama: buildManhuaDetail(item, index, title, hook, summary, endingHook) }
      : { aiShortDrama: buildShortDramaDetail(item, index, title, hook, summary, endingHook) })
  };
}

function buildManhuaDetail(item, index, title, hook, summary, endingHook) {
  const promptBaseZh = `竖屏国漫分镜，${item.visualStyle}，${item.protagonist}，${item.setting}，${item.coreItem}，第${index}集《${title}》，强反转，干净线稿，电影感景深，预留对白气泡空间`;
  const promptBaseEn = `vertical manhua storyboard, ${item.englishVisual}, protagonist ${item.protagonistEn}, episode ${index}, cinematic panel composition, expressive eyes, foreground blur, layered background depth, strong cliffhanger`;
  const panelFns = ["开场压迫", "人物判断", "外部冲突", "线索露出", "规则改写", "结尾钩子"];

  return {
    panelCount: 6,
    scriptText: `本集以${hook}开场，画面必须先建立${item.worldSignal}。中段通过${item.coreItem}让主角和${item.antagonist}产生正面对抗，最后用${endingHook}制造下一集点击。`,
    layoutNotes: [
      "第一格必须是强钩子，不做设定讲解。",
      "中段用关键道具、规则或身份差制造选择。",
      "最后一格只释放一个新信息，避免提前解答。"
    ],
    panels: panelFns.map((fn, panelIndex) => ({
      panelNumber: panelIndex + 1,
      timecode: `00:${String(panelIndex * 6).padStart(2, "0")}-00:${String(panelIndex * 6 + 6).padStart(2, "0")}`,
      durationSeconds: 6,
      function: fn,
      composition: `${item.visualStyle}场景中，${item.protagonist}被放在画面三分线位置，${item.coreItem}作为视觉锚点，背景保留${item.worldSignal}。`,
      dialogueBubble: panelIndex === 0 ? hook : panelIndex === panelFns.length - 1 ? endingHook : `${item.protagonist}：先别急，真正的破绽在这里。`,
      narrationBox: panelIndex === 1 ? summary : "",
      soundEffect: panelIndex === panelFns.length - 1 ? "低频鼓点后突然静音，系统或道具发出解锁声。" : "环境低频、脚步、衣料摩擦和远处人群声。",
      foregroundBlur: "用门框、雾气、屏幕边缘、货架或树影做轻微前景虚化，不遮挡人物眼神。",
      focusSubject: `焦点锁定${item.protagonist}眼睛，其次锁定${item.coreItem}。`,
      backgroundDepth: `背景保留${item.worldSignal}，形成题材识别度，不堆无关细节。`,
      cameraMovement: panelIndex === 0 ? "从大远景缓慢推近到主角眼睛。" : panelIndex === panelFns.length - 1 ? "缓慢推近关键道具，再硬切黑屏。" : "正反打结合轻微横移，强化压迫感。",
      action: `${item.protagonist}先克制观察，再用${item.coreItem}反向逼迫${item.antagonist}暴露目的。`,
      weirdMotion: "环境元素反向流动或灯光轻微闪烁，制造非现实压迫感。",
      aiPromptZh: `${promptBaseZh}，格${panelIndex + 1}，${fn}，${item.coreItem}特写，前景虚化，主体眼神清晰，强悬念`,
      aiPromptEn: `${promptBaseEn}, panel ${panelIndex + 1}, key prop close-up, clear protagonist eyes, dramatic lighting, no readable text`,
      negativePrompt: "避免脸部漂移、手指畸形、文字乱码、背景过乱、气泡压住眼神、风格突然写实化。"
    }))
  };
}

function buildShortDramaDetail(item, index, title, hook, summary, endingHook) {
  const promptBaseZh = `9:16竖屏，${item.visualStyle}，${item.protagonist}，${item.setting}，${item.coreItem}，第${index}集《${title}》，高反差电影光影，强反转`;
  const promptBaseEn = `vertical 9:16 cinematic short drama, ${item.englishVisual}, protagonist ${item.protagonistEn}, episode ${index}, readable screen or clue detail, tense acting, shallow foreground blur, fast thriller pacing`;
  const shotFns = ["开场钩子", "确认危机", "第一阻碍", "取证动作", "关系对峙", "反转线索", "局势失控", "结尾钩子"];
  let cursor = 0;

  return {
    runtimeSeconds: 60,
    scriptText: `本集用${hook}做前3秒强钩子。${summary}。结尾用${endingHook}形成追更问题。`,
    editingNotes: [
      "前3秒必须出现冲突、证据或倒计时。",
      "每5-8秒给一次新信息。",
      "证据画面给观众0.5秒阅读时间。",
      "结尾停在新证据，不解释答案。"
    ],
    shots: shotFns.map((fn, shotIndex) => {
      const duration = shotIndex === 0 ? 5 : shotIndex === shotFns.length - 1 ? 9 : 7;
      const start = cursor;
      cursor += duration;
      return {
        shotNumber: shotIndex + 1,
        timecode: `00:${String(start).padStart(2, "0")}-00:${String(cursor).padStart(2, "0")}`,
        durationSeconds: duration,
        function: fn,
        visual: `${item.setting}中，${item.protagonist}发现${item.coreItem}的异常，背景保留${item.worldSignal}，人物处在冷光和压力中心。`,
        dialogueOrSubtitle: shotIndex === 0 ? hook : shotIndex === shotFns.length - 1 ? endingHook : `${item.protagonist}：这不是巧合，是有人提前排好了。`,
        audioCue: shotIndex === shotFns.length - 1 ? "低频鼓点停止，只留一次系统提示音或证据落桌声。" : "环境噪声压低，突出键盘、脚步、手机震动或心跳。",
        foregroundBlur: "前景用手机边框、玻璃、门框或路人肩膀轻微虚化，制造窥视感。",
        focusSubject: `焦点锁定${item.protagonist}眼睛和${item.coreItem}上的关键信息。`,
        backgroundDepth: `背景保留${item.worldSignal}，不让路人抢主体。`,
        cameraMovement: shotIndex === 0 ? "从关键证据急推到主角眼睛。" : shotIndex === shotFns.length - 1 ? "缓慢推近证据后硬切黑屏。" : "手持跟拍与正反打交替。",
        actorDirection: `${item.protagonist}外表克制，动作快，眼神先判断后反击。`,
        editingRhythm: "每5-8秒一次信息变化，台词短句化，证据出现时停半拍。",
        aiPromptZh: `${promptBaseZh}，镜头${shotIndex + 1}，${fn}，${item.coreItem}清晰可见，前景虚化，主体眼神清晰`,
        aiPromptEn: `${promptBaseEn}, shot ${shotIndex + 1}, clear clue detail, focused eyes, controlled camera, no readable text except abstract UI shapes`,
        negativePrompt: "避免过曝、脸部变形、口型错位、路人抢主体、字幕遮挡眼神、现代场景混入古装元素。"
      };
    })
  };
}

function masterMarkdown(master) {
  return `# 《${master.title.zh}》剧本母版

- slug: ${master.slug}
- 模式: ${master.primaryMode}
- 类型: ${master.category}
- 集数: ${master.episodeCount}
- 免费验证: ${master.freeEpisodeCount} 集

## 一句话卖点

${master.logline}

## 剧情简介

${master.synopsis}
`;
}

function productionMode(master) {
  return {
    slug: master.slug,
    primaryMode: master.primaryMode,
    supportedModes: master.supportedModes,
    defaultAspectRatio: "9:16",
    episodeDurationSeconds: { min: 45, max: 75 },
    panelCount: { min: 6, max: 9 },
    visualStyle: master.visualStyle
  };
}

function imageTasks(master) {
  return {
    slug: master.slug,
    mode: master.primaryMode,
    tasks: [
      {
        id: `${master.slug}-cover`,
        episodeNumber: null,
        assetType: "cover",
        mode: master.primaryMode,
        promptZh: master.coverPromptZh,
        promptEn: master.coverPromptEn,
        outputPath: `public/site/${master.coverImage}`,
        outputFormat: "png",
        aspectRatio: "9:16",
        status: "pending_png_generation"
      }
    ]
  };
}

function coverGenerationTask(master, item) {
  return {
    id: `${master.slug}-cover-png`,
    slug: master.slug,
    title: item.title,
    mode: item.mode,
    outputPath: `public/site/${master.coverImage}`,
    outputFormat: "png",
    aspectRatio: "9:16",
    prompt: item.coverPromptEn,
    promptZh: item.coverPromptZh,
    negativePrompt: [
      "no text",
      "no logo",
      "no watermark",
      "no existing IP character",
      "no poster typography",
      "avoid malformed hands",
      "avoid duplicate faces",
      "avoid low-detail background"
    ],
    sourceSignals: {
      trope: item.trope,
      protagonistRole: item.protagonistRole,
      setting: item.setting,
      coreItem: item.coreItem,
      antagonist: item.antagonist,
      visualStyle: item.visualStyle
    },
    status: fs.existsSync(path.join(projectRoot, "public", "site", master.coverImage)) ? "generated" : "pending"
  };
}

function writeContentSource(item) {
  const baseDir = path.join(contentSourceDir, item.slug);
  const episodes = Array.from({ length: 24 }, (_, index) => buildEpisode(item, index + 1));
  const master = {
    schemaVersion: "1.0.0",
    slug: item.slug,
    title: { zh: item.title, en: item.titleEn },
    primaryMode: item.mode,
    supportedModes: [item.mode],
    freeEpisodeCount: 3,
    episodeCount: 24,
    logline: item.logline,
    synopsis: item.synopsis,
    category: item.category,
    coverImage: item.coverImage,
    recommendedPlatforms: item.platforms,
    audienceTags: item.tags,
    productionDifficulty: item.difficulty || "medium",
    visualStyle: item.visualStyle,
    coverPromptZh: item.coverPromptZh,
    coverPromptEn: item.coverPromptEn,
    characters: [
      {
        name: item.protagonist,
        role: item.protagonistRole,
        visualAnchor: item.visualAnchor,
        desire: item.desire,
        secret: item.secret,
        arc: "从被动卷入到主动改写规则。"
      },
      {
        name: item.ally,
        role: "关键盟友 / 线索持有者",
        visualAnchor: item.allyVisual || "沉默、克制、掌握关键线索。",
        desire: "证明自己不是事件的牺牲品。",
        secret: "掌握一段会改变主角判断的旧证据。",
        arc: "从试探主角到共同推进真相。"
      },
      {
        name: item.antagonist,
        role: "主要对手 / 规则操控者",
        visualAnchor: item.antagonistVisual || "体面、冷静、善于隐藏真实目的。",
        desire: "夺回主角掌握的关键规则。",
        secret: item.secret,
        arc: "从幕后施压到被迫正面暴露。"
      }
    ],
    storyWorld: {
      setting: item.setting,
      coreSystem: item.coreItem,
      hiddenRule: item.secret
    },
    conflictDesign: {
      surfaceConflict: `${item.protagonist}必须在${item.setting}中对抗${item.antagonist}制造的局。`,
      deepConflict: item.secret,
      antagonistPressure: `${item.antagonist}不断利用${item.coreItem}逼主角让步。`,
      emotionalTension: "主角越想保护自己，越必须公开更危险的真相。"
    },
    arcOutline: [
      { arc: "强钩子开局", episodes: "1-3", purpose: "免费验证", event: "主角发现核心规则并第一次反击。", reversal: "关键道具并非偶然出现。" },
      { arc: "付费承接", episodes: "4-9", purpose: "后续购买承接", event: "敌人正面施压，盟友登场。", reversal: "盟友也隐瞒了旧证据。" },
      { arc: "世界观扩大", episodes: "10-15", purpose: "扩大题材价值", event: "核心规则牵出更大组织。", reversal: "主角过去与真相有关。" },
      { arc: "真相爆发", episodes: "16-21", purpose: "高价值反转", event: "主角失势后公开底牌。", reversal: "对手真正目的被反向利用。" },
      { arc: "终局兑现", episodes: "22-24", purpose: "结局和续作钩子", event: "主角改写规则。", reversal: "新危机来自更高层级。" }
    ],
    episodeOutline: episodes.map((episode) => ({
      episodeNumber: episode.episodeNumber,
      title: episode.title,
      hook: episode.hook,
      summary: episode.summary,
      endingHook: episode.endingHook,
      isFreePreview: episode.isFreePreview,
      arc: episode.arc,
      productionPriority: "high"
    })),
    modeAdaptation: item.mode === "ai_manhua_drama"
      ? {
          aiManhuaDrama: {
            aspectRatio: "9:16",
            panelCount: { min: 6, max: 9 },
            visualStyle: item.visualStyle,
            globalPromptZh: item.coverPromptZh,
            globalPromptEn: item.coverPromptEn
          }
        }
      : {
          aiShortDrama: {
            aspectRatio: "9:16",
            episodeDurationSeconds: { min: 45, max: 75 },
            visualStyle: item.visualStyle,
            globalPromptZh: item.coverPromptZh,
            globalPromptEn: item.coverPromptEn
          }
        },
    commercialPolicy: {
      freeScope: "第 1-3 集免费验证包。",
      buyout: `一次性开放《${item.title}》第 4-24 集完整制作包。`,
      payPerEpisode: `优先开放《${item.title}》第 4-6 集作为按集购买承接。`,
      revenueShare: `开放《${item.title}》第 4-10 集作为第一批分成合作内容。`,
      forbidden: ["不得套用现有小说、动漫、影视 IP", "不得转售原始制作包", "不得绕开授权续写后续付费集"]
    }
  };

  writeJson(path.join(baseDir, "master.json"), master);
  writeText(path.join(baseDir, "master.md"), masterMarkdown(master));
  writeJson(path.join(baseDir, "production-mode.json"), productionMode(master));
  writeJson(path.join(baseDir, "image-tasks", "storyboard-reference-tasks.json"), imageTasks(master));
  writeJson(path.join(baseDir, "image-tasks", "cover-generation-task.json"), coverGenerationTask(master, item));
  writeText(
    path.join(baseDir, "visual-references", "characters.md"),
    `# 《${item.title}》角色视觉参考\n\n## ${item.protagonist}\n\n${item.visualAnchor}\n\n## ${item.ally}\n\n${item.allyVisual || "关键盟友，气质克制，携带重要证据。"}\n\n## ${item.antagonist}\n\n${item.antagonistVisual || "主要对手，外表体面，真实目的隐藏很深。"}\n`
  );
  episodes.forEach((episode) => {
    writeJson(path.join(baseDir, "episodes", `episode-${String(episode.episodeNumber).padStart(3, "0")}.json`), episode);
  });
  return { master, episodes };
}

const manhuaItems = [
  ["star-forge-apprentice", "星炉弃徒：我把废矿炼成天庭", "废矿修仙", "被逐出宗门的炼器少女", "星炉残片", "灵矿黑市", "仙盟执事"],
  ["ghost-market-heir", "鬼市少主：我在阴阳铺收万界欠条", "民俗鬼市", "继承阴阳铺的女掌柜", "万界欠条", "午夜鬼市", "白面账房"],
  ["nine-tail-contract", "九尾契约：退婚后我成了妖都债主", "妖都退婚", "被退婚的人族少女", "九尾债契", "妖都王庭", "狐族少主"],
  ["doomsday-herbalist", "末日药王：我用灵草养活安全区", "末日灵草", "末日药师", "变异灵草箱", "废土药田", "安全区议长"],
  ["bunker-school", "末世学院：我把废校改成避难城", "废校避难", "天才转学生", "地下校规核心", "废弃中学", "校董会"],
  ["sword-snow-courier", "雪剑驿站：我替死人送最后一封信", "雪国送信", "雪原驿使", "亡者信匣", "北境驿站", "边军统领"],
  ["forbidden-library", "禁书楼：我靠弹幕修复失传功法", "弹幕修仙", "禁书楼管理员", "失传功法弹幕", "浮空藏书楼", "藏经长老"],
  ["palace-puppet-empress", "傀儡女帝：我把朝堂改成审判直播", "女帝权谋", "被架空的少年女帝", "审判玉玺", "金殿朝堂", "摄政王"],
  ["salt-merchant-princess", "盐商郡主：我用账本掀翻王府", "古风经商", "盐商养女", "血账账本", "江南盐仓", "王府管事"],
  ["celestial-railway", "仙轨列车：我在云端售卖渡劫票", "仙侠列车", "云端列车乘务长", "渡劫车票", "云上海站", "雷劫司官"],
  ["city-god-intern", "城隍实习生：我给亡魂排队申诉", "城隍职场", "新任城隍实习生", "申诉木牌", "夜半城隍庙", "判官"],
  ["cyber-sutra", "赛博经卷：废柴程序员修成机械佛", "赛博修行", "失业程序员", "机械经卷", "霓虹数据寺", "算法住持"],
  ["monster-dorm", "怪谈宿舍：我把规则怪物收进班级群", "校园怪谈", "宿舍楼长", "规则班级群", "封闭宿舍楼", "旧校长"],
  ["beast-king-physician", "兽王医馆：被流放后我治好了万兽国", "兽世医馆", "流放女医", "万兽药箱", "兽王边城", "祭司长"],
  ["wasteland-teahouse", "荒原茶馆：我用一壶茶换末日情报", "废土茶馆", "荒原茶馆老板", "情报茶壶", "沙暴公路", "雇佣兵首领"],
  ["mirror-palace", "镜宫逆徒：我偷走反派的命格剧本", "镜像命格", "镜宫叛徒", "命格镜页", "万镜宫", "命师"],
  ["dragon-kiln-girl", "龙窑少女：我烧出能说话的瓷军", "龙窑机关", "窑场少女", "龙窑火种", "古窑山城", "贡瓷太监"],
  ["rain-god-repair", "雨神修理铺：我修坏的不是伞是天命", "神明修理", "修伞铺少女", "断雨伞骨", "雨巷神祠", "失职雨神"],
  ["academy-exam-god", "科举神榜：我把考场变成修罗副本", "科举副本", "寒门女考生", "神榜墨卷", "贡院考场", "主考官"],
  ["spirit-farm-city", "灵田城主：我在天灾后种出浮空城", "种田天灾", "灵田守城人", "浮空灵种", "灾后荒城", "粮商盟主"],
  ["phoenix-bone-divorce", "凤骨和离：前夫求我救全宗", "和离修仙", "被和离的凤骨女修", "凤骨灵印", "雪山宗门", "前夫宗主"],
  ["demon-lawyer", "魔门律所：我替反派打赢天道官司", "魔门律政", "魔门讼师", "天道案卷", "魔门律所", "天庭监察"],
  ["mountain-sea-delivery", "山海快递：我送错包裹救了三界", "山海快递", "快递少女", "错投包裹", "山海驿道", "海神使者"],
  ["paper-army-girl", "纸甲少女：我折出一支阴兵军团", "纸术阴兵", "纸扎铺少女", "纸甲兵符", "白事街", "阴司捕头"],
  ["black-card-cultivation", "黑卡修仙：我刷爆仙盟功德榜", "功德爽文", "负债散修", "功德黑卡", "仙盟交易所", "功德榜主"],
  ["snow-village-medium", "雪村走阴人：我听见井底喊我名字", "东北民俗", "雪村走阴人", "井底铜铃", "封雪古村", "村祠老人"],
  ["jade-shop-rebirth", "玉铺重生：我用碎玉看穿全家谎言", "重生宅斗", "玉铺少东家", "碎玉罗盘", "老宅玉铺", "继母"],
  ["whale-island-singer", "鲸岛歌姬：我的歌能唤醒沉海城", "海岛奇幻", "失声歌姬", "鲸骨琴", "沉海鲸岛", "海商会长"],
  ["clocktower-alchemist", "钟楼炼金师：我偷走明天的三分钟", "时间炼金", "钟楼炼金师", "三分钟怀表", "旧城钟楼", "时间商人"],
  ["lava-monastery", "熔岩寺：我在火山口养成废太子", "火山养成", "熔岩寺女护法", "火山莲灯", "火山古寺", "废太子的叔父"],
  ["lunar-court", "月庭司命：我改错一个人的死期", "司命改命", "月庭司命官", "错死命牌", "月下命殿", "天规审判者"],
  ["tomb-appraiser", "古墓估价师：我给千年女王开价", "古墓鉴宝", "古董估价师", "女王陪葬册", "地下王陵", "盗墓财团"],
  ["snowfield-caravan", "雪原商队：我把破车队养成北境王庭", "雪原商战", "商队女领队", "北境通行印", "暴雪商路", "关隘军阀"],
  ["dream-eater-cafe", "食梦咖啡馆：我用噩梦还清债务", "都市奇幻", "咖啡馆债务人", "噩梦账单", "深夜咖啡馆", "梦境债主"],
  ["mech-princess", "铁甲郡主：我在古代造出第一台战甲", "古代机甲", "工部郡主", "战甲蓝图", "王朝工坊", "兵部尚书"],
  ["plague-ink-girl", "疫墨少女：我用毒画封住全城鬼门", "毒画民俗", "药墨画师", "疫墨画轴", "瘟城画院", "鬼门祭司"],
  ["ocean-market", "海市赊刀人：我卖的刀只斩未来", "海市预言", "赊刀少女", "未来刀契", "雾上海市", "船帮龙头"],
  ["cloud-circus", "云端戏班：我演完一出戏改了王朝", "戏班权谋", "云端戏班花旦", "改命戏谱", "云上戏台", "太史令"],
  ["blood-moon-tailor", "血月裁缝：我给仇人缝上真相", "裁缝复仇", "血月裁缝", "真相红线", "旧城裁缝铺", "豪门少爷"],
  ["wasteland-zoo", "末日动物园：我把变异兽养成护城军", "末日异兽", "动物园管理员", "异兽饲养册", "废城动物园", "基地司令"]
];

const shortItems = [
  ["wrong-heir-live", "真千金开播后，全家塌房", "豪门直播", "被抱错的真千金", "直播证据链", "豪门发布会", "假千金"],
  ["divorce-countdown", "离婚倒计时：我的律师是前任", "离婚逆袭", "离婚谈判师", "倒计时协议", "律所会议室", "前夫家族"],
  ["village-millionaire", "返乡后，我把烂村拍成顶流", "乡村逆袭", "返乡女导演", "短视频账本", "破旧山村", "村霸承包商"],
  ["mother-in-law-trial", "婆婆审判日：全家都在直播间认罪", "家庭审判", "全职妈妈", "家庭直播录音", "客厅直播间", "控制欲婆婆"],
  ["blind-date-algorithm", "相亲算法把我推给仇人", "都市甜悬", "数据产品经理", "相亲算法后台", "科技公司", "旧案仇人"],
  ["midnight-hotline", "午夜热线：她接到十年前的自己", "时间悬疑", "心理热线接线员", "午夜来电录音", "深夜热线室", "匿名来电人"],
  ["contract-bride-investigator", "合约新娘查到丈夫死亡证明", "合约婚姻", "合约新娘", "死亡证明复印件", "婚礼后台", "豪门继承人"],
  ["inheritance-live-auction", "遗产直播拍卖：我竞价买回亲妈", "遗产反转", "债务主播", "遗产拍卖号牌", "直播拍卖厅", "遗产代理人"],
  ["office-reversal-room", "反转办公室：每个工位都有秘密", "职场悬疑", "新人审计员", "匿名工位卡", "深夜办公室", "部门总监"],
  ["rain-night-witness", "雨夜证人：她的行车记录仪说谎", "雨夜探案", "女代驾司机", "行车记录仪", "雨夜高架桥", "事故车主"]
];

const palettes = [
  ["#0f172a", "#38bdf8", "#7dd3fc", "#f8fafc"],
  ["#2f1b3d", "#f97316", "#facc15", "#fff7ed"],
  ["#11281f", "#34d399", "#a7f3d0", "#ecfdf5"],
  ["#301934", "#f472b6", "#c084fc", "#fdf2f8"],
  ["#24140e", "#fb923c", "#fde68a", "#fff7ed"],
  ["#172554", "#60a5fa", "#c4b5fd", "#eff6ff"],
  ["#1f2937", "#ef4444", "#fca5a5", "#f9fafb"],
  ["#0c1f1a", "#14b8a6", "#99f6e4", "#f0fdfa"]
];

function makeItem(row, index, mode) {
  const [slug, title, trope, protagonistRole, coreItem, setting, antagonist] = row;
  const isManhua = mode === "ai_manhua_drama";
  const protagonist = protagonistRole.replace(/^(被|新任|失业|流放|返乡|全职|女)?/, "").slice(0, 4) || (isManhua ? "云瑶" : "林知夏");
  const palette = palettes[index % palettes.length];
  const category = isManhua ? `AI${trope}漫剧` : `${trope}AI短剧`;
  const coverImage = `assets/covers/hot-catalog/cover-${slug}.png`;
  const modeLabel = isManhua ? "AI漫剧" : "AI短剧";
  const platforms = isManhua ? ["抖音", "快手", "小红书", "TikTok", "YouTube Shorts"] : ["抖音", "快手", "视频号", "小红书", "ReelShort"];
  const visualStyle = isManhua
    ? `${trope}题材，竖屏国漫，强光影，符号化道具，人物眼神特写`
    : `${trope}题材，现代短剧电影感，冷暖对比，证据特写，强情绪表演`;
  return {
    slug,
    title,
    titleEn: title,
    mode,
    category,
    trope,
    protagonist,
    protagonistEn: "lead character",
    protagonistRole,
    ally: isManhua ? "隐线盟友" : "关键证人",
    antagonist,
    setting,
    coreItem,
    secret: `${coreItem}背后藏着${antagonist}不敢公开的旧案。`,
    worldSignal: `${setting}、${coreItem}、${trope}视觉符号`,
    locations: [setting, "临时据点", "隐藏档案室"],
    visualStyle,
    visualAnchor: isManhua
      ? "年轻亚洲女性，利落长发，带有题材核心道具，眼神冷静，服装兼具现实质感和幻想符号。"
      : "亚洲女性主角，现代职业装或生活化服装，表情克制，手中握着关键证据或手机。",
    desire: `查清${coreItem}背后的真相，并从${antagonist}手里夺回主动权。`,
    logline: `${protagonistRole}意外掌握${coreItem}，在${setting}里被${antagonist}逼入死局，却反手把规则改成自己的生意。`,
    synopsis: `${title}讲述${protagonistRole}在${setting}中发现${coreItem}并卷入一场被精心安排的骗局。她一开始只想自保，却发现${antagonist}控制的规则正在吞掉更多人。前三集用强钩子验证题材，中段不断放大世界观和人物关系，后段揭开${coreItem}背后的旧案，让主角从被选择的人变成改写规则的人。`,
    tags: isManhua
      ? [trope, "强反转", "爽感逆袭", "小说感", "AI漫剧"]
      : [trope, "现实反转", "女性成长", "强情绪", "AI短剧"],
    platforms,
    palette,
    coverImage,
    coverSymbol: Array.from(coreItem).slice(0, 2).join(""),
    coverPromptZh: `生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《${title}》。核心内容：${protagonistRole}在${setting}里发现${coreItem}，被${antagonist}逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、${setting}的高细节环境、清晰可见的${coreItem}、题材符号“${trope}”。风格：${visualStyle}，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。`,
    coverPromptEn: `Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "${title}". Core story: a young Asian female lead, ${protagonistRole}, discovers ${coreItem} in ${setting}, pressured by ${antagonist}, then turns the rules against them. The image must show the lead character, the detailed setting of ${setting}, the key prop ${coreItem} clearly visible, and strong ${trope} genre signals. Style: ${isManhua ? "premium cinematic Chinese manhua cover art" : "premium cinematic vertical short drama poster"}, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.`,
    englishVisual: isManhua ? `${trope} fantasy manhua style` : `${trope} modern vertical drama style`,
    difficulty: index % 5 === 0 ? "high" : "medium",
    episodeBeats: isManhua
      ? ["禁物现身", "第一次设局", "盟友试探", "旧案裂缝", "规则反噬", "夜半交易", "敌人递刀", "身份倒转", "禁地开门", "底牌被盗", "全城围猎", "旧主回归", "真相账本", "主角失势", "反派登台", "核心失控", "公开审判", "同盟崩裂", "第二规则", "反手开局", "终局追杀", "命运改写", "最后交易", "新门打开"]
      : ["直播事故", "证据失真", "全网误解", "旧案重启", "假证人", "关系破局", "对手反咬", "深夜通话", "账号暴露", "舆论围猎", "关键错字", "亲人翻供", "合同陷阱", "镜头说谎", "证人失踪", "主角背锅", "全员审判", "底牌公开", "真凶换脸", "投票倒计时", "证据归零", "最后直播", "反转认罪", "新案推送"]
  };
}

function catalogItems() {
  return [
    ...manhuaItems.map((row, index) => makeItem(row, index, "ai_manhua_drama")),
    ...shortItems.map((row, index) => makeItem(row, index + manhuaItems.length, "ai_short_drama"))
  ];
}

async function main() {
  ensureDirectory(coverDir);
  ensureDirectory(scriptsDataDir);
  const items = catalogItems();
  const importFiles = [];
  const generated = [];

  for (const item of items) {
    writeContentSource(item);
    const data = buildScriptData(item.slug, {
      sourceDir: contentSourceDir,
      outputDir: scriptsDataDir,
      status: "published",
      featured: false
    });
    const scriptDataPath = path.join(scriptsDataDir, `${item.slug}.json`);
    writeJson(scriptDataPath, data);
    await generateFreePreview(data, scriptDataPath, { updateAssets: true });
    importFiles.push(`scripts-data/${item.slug}.json`);
    generated.push({
      slug: item.slug,
      title: item.title,
      mode: item.mode,
      category: item.category,
      coverImage: item.coverImage
    });
  }

  const importResult = spawnSync("node", ["scripts/import-script-data.js", ...importFiles], {
    cwd: projectRoot,
    encoding: "utf8",
    shell: false
  });

  if (importResult.status !== 0) {
    throw new Error(`Import failed:\n${importResult.stdout}\n${importResult.stderr}`);
  }

  console.log(
    JSON.stringify(
      {
        generated: generated.length,
        aiManhuaDrama: generated.filter((item) => item.mode === "ai_manhua_drama").length,
        aiShortDrama: generated.filter((item) => item.mode === "ai_short_drama").length,
        import: JSON.parse(importResult.stdout),
        items: generated
      },
      null,
      2
    )
  );
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  catalogItems,
  writeContentSource
};
