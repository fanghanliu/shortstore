const fs = require("node:fs");
const path = require("node:path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  PageBreak,
  Packer,
  Paragraph,
  Table,
  TableLayoutType,
  TableCell,
  TableRow,
  VerticalAlign,
  TextRun,
  WidthType
} = require("docx");

const projectRoot = path.join(__dirname, "..");
const scriptsDataDir = path.join(projectRoot, "scripts-data");

function parseArgs(argv) {
  const args = {
    type: "free_preview",
    slug: "",
    episodeStart: null,
    episodeEnd: null,
    episodeNumbers: [],
    updateAssets: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === "--type") {
      args.type = argv[index + 1] || args.type;
      index += 1;
    } else if (current === "--slug") {
      args.slug = argv[index + 1] || "";
      index += 1;
    } else if (current === "--episode-start") {
      args.episodeStart = Number(argv[index + 1]);
      index += 1;
    } else if (current === "--episode-end") {
      args.episodeEnd = Number(argv[index + 1]);
      index += 1;
    } else if (current === "--episodes") {
      args.episodeNumbers = String(argv[index + 1] || "")
        .split(/[,，、\s]+/)
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value));
      index += 1;
    } else if (current === "--update-assets") {
      args.updateAssets = true;
    }
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function listScriptDataFiles(slug) {
  if (slug) {
    return [path.join(scriptsDataDir, `${slug}.json`)];
  }

  return fs
    .readdirSync(scriptsDataDir)
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => path.join(scriptsDataDir, fileName));
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const DOCX_THEME = {
  pageWidth: 11906,
  pageHeight: 16838,
  usableWidth: 10148,
  fontSans: "Microsoft YaHei",
  fontMono: "Consolas",
  ink: "262626",
  body: "444444",
  muted: "808080",
  accent: "A65A52",
  accentDark: "743B36",
  paper: "F7F5F0",
  panel: "FBFAF7",
  panelAlt: "F4F0EA",
  label: "EFE8E2",
  line: "E3DED6"
};

const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
};

const fineBorders = {
  top: { style: BorderStyle.SINGLE, size: 2, color: DOCX_THEME.line },
  bottom: { style: BorderStyle.SINGLE, size: 2, color: DOCX_THEME.line },
  left: { style: BorderStyle.SINGLE, size: 2, color: DOCX_THEME.line },
  right: { style: BorderStyle.SINGLE, size: 2, color: DOCX_THEME.line },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: DOCX_THEME.line },
  insideVertical: { style: BorderStyle.SINGLE, size: 2, color: DOCX_THEME.line }
};

function cleanInline(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function text(value, options = {}) {
  return new TextRun({
    text: String(value || ""),
    font: options.font || DOCX_THEME.fontSans,
    bold: Boolean(options.bold),
    italics: Boolean(options.italics),
    size: options.size || 22,
    color: options.color
  });
}

function paragraph(value, options = {}) {
  return new Paragraph({
    children: [text(value, options)],
    spacing: {
      before: options.before || 0,
      after: options.after ?? 120,
      line: options.line || 300
    },
    alignment: options.alignment,
    indent: options.indent,
    shading: options.shading ? { fill: options.shading } : undefined,
    border: options.border
  });
}

function heading(value, level = HeadingLevel.HEADING_1) {
  const config = {
    [HeadingLevel.HEADING_1]: { size: 36, color: DOCX_THEME.accent, before: 360, after: 120 },
    [HeadingLevel.HEADING_2]: { size: 30, color: DOCX_THEME.accent, before: 300, after: 120 },
    [HeadingLevel.HEADING_3]: { size: 26, color: DOCX_THEME.accent, before: 240, after: 100 },
    [HeadingLevel.HEADING_4]: { size: 22, color: DOCX_THEME.ink, before: 180, after: 80 },
    [HeadingLevel.HEADING_5]: { size: 18, color: DOCX_THEME.muted, before: 120, after: 60 }
  }[level] || { size: 24, color: DOCX_THEME.accent, before: 220, after: 100 };

  return new Paragraph({
    children: [text(value, { bold: true, size: config.size, color: config.color })],
    heading: level,
    spacing: {
      before: config.before,
      after: config.after
    }
  });
}

function bullet(value) {
  return new Paragraph({
    children: [
      text("• ", { bold: true, color: DOCX_THEME.accent, size: 19 }),
      text(value, { bold: true, color: DOCX_THEME.accent, size: 19 })
    ],
    spacing: {
      after: 60,
      line: 300
    },
    indent: { left: 260, hanging: 170 }
  });
}

function tableCell(value, options = {}) {
  const children = Array.isArray(value)
    ? value
    : [paragraph(value, { bold: options.bold, after: 40, size: options.size || 18, color: options.color || DOCX_THEME.body })];

  return new TableCell({
    children,
    shading: options.shading ? { fill: options.shading } : undefined,
    width: options.width ? { size: options.width, type: WidthType.DXA } : undefined,
    verticalAlign: options.verticalAlign || VerticalAlign.CENTER,
    margins: {
      top: options.marginY || 150,
      bottom: options.marginY || 150,
      left: options.marginX || 170,
      right: options.marginX || 170
    }
  });
}

function table(rows, options = {}) {
  return new Table({
    width: {
      size: options.width || DOCX_THEME.usableWidth,
      type: WidthType.DXA
    },
    columnWidths: options.columnWidths,
    layout: TableLayoutType.FIXED,
    borders: options.borders || noBorders,
    rows
  });
}

function labelParagraph(en, zh = "", options = {}) {
  const label = zh ? `${en}\n${zh}` : en;
  return paragraph(label, {
    bold: true,
    size: options.size || 12,
    color: options.color || DOCX_THEME.muted,
    after: options.after ?? 40,
    line: 240
  });
}

function valueParagraph(value, options = {}) {
  return paragraph(cleanInline(value || "未填写"), {
    bold: options.bold ?? true,
    size: options.size || 18,
    color: options.color || DOCX_THEME.body,
    after: options.after ?? 60,
    line: options.line || 300
  });
}

function topBar(left, right) {
  const halfWidth = Math.floor(DOCX_THEME.usableWidth / 2);
  return table([
    new TableRow({
      children: [
        tableCell([labelParagraph(left, "", { after: 0 })], { width: halfWidth, shading: DOCX_THEME.paper }),
        tableCell([labelParagraph(right, "", { after: 0 })], {
          width: DOCX_THEME.usableWidth - halfWidth,
          shading: DOCX_THEME.paper
        })
      ]
    })
  ], { columnWidths: [halfWidth, DOCX_THEME.usableWidth - halfWidth] });
}

function sectionTitle(number, titleZh, titleEn, options = {}) {
  const prefix = number ? `${number}  ` : "";
  return new Paragraph({
    children: [
      text(prefix, { bold: true, size: options.size || 26, color: DOCX_THEME.accent }),
      text(titleZh, { bold: true, size: options.size || 26, color: DOCX_THEME.accent }),
      text(`  /  ${titleEn}`, { bold: true, size: 18, color: DOCX_THEME.muted })
    ],
    spacing: { before: options.before ?? 260, after: options.after ?? 160 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "D9D3CB", space: 6 }
    }
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function infoCard(labelEn, labelZh, value, width = DOCX_THEME.usableWidth / 2) {
  return tableCell([labelParagraph(labelEn, labelZh), valueParagraph(value, { color: DOCX_THEME.accentDark })], {
    width,
    shading: DOCX_THEME.panel,
    marginY: 150,
    marginX: 180
  });
}

function infoGrid(items, columns = 2) {
  const rows = [];
  const cellWidth = Math.floor(DOCX_THEME.usableWidth / columns);
  const columnWidths = Array.from({ length: columns }, (_, index) =>
    index === columns - 1 ? DOCX_THEME.usableWidth - cellWidth * (columns - 1) : cellWidth
  );
  for (let index = 0; index < items.length; index += columns) {
    const slice = items.slice(index, index + columns);
    while (slice.length < columns) slice.push(["", "", ""]);
    rows.push(
      new TableRow({
        children: slice.map(([en, zh, value], cellIndex) => infoCard(en, zh, value, columnWidths[cellIndex]))
      })
    );
  }
  return table(rows, { columnWidths });
}

function navigationTable(items) {
  const columnWidths = [900, 3700, DOCX_THEME.usableWidth - 4600];
  return table(
    items.map(
      ([number, titleZh, titleEn]) =>
        new TableRow({
          children: [
            tableCell([valueParagraph(number, { size: 26, color: DOCX_THEME.accent })], {
              width: columnWidths[0],
              shading: DOCX_THEME.paper
            }),
            tableCell([valueParagraph(titleZh, { size: 20, color: DOCX_THEME.ink })], {
              width: columnWidths[1],
              shading: DOCX_THEME.paper
            }),
            tableCell([labelParagraph(titleEn, "", { size: 14, after: 0 })], {
              width: columnWidths[2],
              shading: DOCX_THEME.paper
            })
          ]
        })
    ),
    { columnWidths }
  );
}

function promptBox(labelZh, labelEn, value) {
  return table(
    [
      new TableRow({
        children: [
          tableCell(
            [
              labelParagraph(labelEn, labelZh, { color: DOCX_THEME.accent, size: 13 }),
              paragraph(value || "未填写", {
                font: DOCX_THEME.fontMono,
                size: 16,
                color: DOCX_THEME.body,
                line: 285,
                after: 0
              })
            ],
            { width: DOCX_THEME.usableWidth, shading: DOCX_THEME.panel, verticalAlign: VerticalAlign.TOP }
          )
        ]
      })
    ],
    { borders: fineBorders, columnWidths: [DOCX_THEME.usableWidth] }
  );
}

function scriptCoverBlocks(script, subtitleZh, subtitleEn, metaItems = []) {
  return [
    topBar("AI SCRIPT PRODUCTION PACKAGE", "PREMIUM WORD EDITION"),
    new Paragraph({
      children: [text(script.title, { bold: true, size: 46, color: DOCX_THEME.ink })],
      spacing: { before: 260, after: 0 }
    }),
    new Paragraph({
      children: [
        text(subtitleZh, { bold: true, size: 26, color: DOCX_THEME.accent }),
        text(`  /  ${subtitleEn}`, { bold: true, size: 18, color: DOCX_THEME.muted })
      ],
      spacing: { before: 120, after: 280 }
    }),
    infoGrid([["LOGLINE", "一句话卖点", script.logline], ...metaItems], 2),
    new Paragraph({
      children: [text("STRUCTURED LAYOUT  ·  CLEAN TYPOGRAPHY  ·  BILINGUAL LABELS", { bold: true, size: 15, color: DOCX_THEME.muted })],
      alignment: AlignmentType.RIGHT,
      spacing: { before: 160, after: 260 }
    })
  ];
}

function episodeBoard(episode) {
  return metadataTable([
    ["OPENING HOOK\n开场钩子", episode.hook || "未填写"],
    ["SUMMARY\n本集概要", episode.summary || "未填写"],
    ["ENDING HOOK\n结尾钩子", episode.endingHook || "未填写"]
  ]);
}

function buildDocument({ creator, title, description, children }) {
  return new Document({
    creator,
    title,
    description,
    styles: {
      default: {
        document: {
          run: {
            font: DOCX_THEME.fontSans,
            size: 22,
            color: DOCX_THEME.body
          },
          paragraph: {
            spacing: { line: 300, after: 120 }
          }
        }
      },
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: {
            font: DOCX_THEME.fontSans,
            size: 22,
            color: DOCX_THEME.body
          },
          paragraph: {
            spacing: { line: 300, after: 120 }
          }
        }
      ]
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: DOCX_THEME.pageWidth,
              height: DOCX_THEME.pageHeight
            },
            margin: {
              top: 879,
              right: 879,
              bottom: 879,
              left: 879,
              header: 397,
              footer: 397
            }
          }
        },
        children
      }
    ]
  });
}

function metadataTable(rows) {
  const columnWidths = [2100, DOCX_THEME.usableWidth - 2100];
  return table(
    rows.map(
      ([label, value]) =>
        new TableRow({
          children: [
            tableCell([labelParagraph(label, "")], { width: columnWidths[0], shading: DOCX_THEME.label }),
            tableCell([valueParagraph(value, { bold: true, color: DOCX_THEME.ink })], {
              width: columnWidths[1],
              shading: DOCX_THEME.panel
            })
          ]
        })
    ),
    { borders: fineBorders, columnWidths }
  );
}

function normalizeList(values) {
  if (!Array.isArray(values) || !values.length) return "未填写";
  return values.filter(Boolean).join("、") || "未填写";
}

function productionUnitBlocks(unit, fallback = {}) {
  const title = unit.sceneHeading || fallback.heading || "镜头 / 场次";
  const labelWidth = 2000;
  const valueWidth = DOCX_THEME.usableWidth - labelWidth;
  const columnWidths = [labelWidth, valueWidth];
  const row = (en, zh, value, shading = DOCX_THEME.panel) =>
    new TableRow({
      children: [
        tableCell([labelParagraph(en, zh)], { width: labelWidth, shading: DOCX_THEME.label, verticalAlign: VerticalAlign.TOP }),
        tableCell([valueParagraph(value, { bold: true, color: DOCX_THEME.body, size: 18 })], {
          width: valueWidth,
          shading,
          verticalAlign: VerticalAlign.TOP
        })
      ]
    });

  return [
    paragraph(title, {
      bold: true,
      size: 20,
      color: DOCX_THEME.accentDark,
      shading: DOCX_THEME.paper,
      before: 80,
      after: 80,
      line: 280
    }),
    table(
      [
        row("VISUAL DESIGN", "画面设计", unit.visualDesign || unit.visual || unit.composition || ""),
        row("CAMERA LANGUAGE", "镜头语言", unit.cameraLanguage || unit.cameraMovement || "", DOCX_THEME.panelAlt),
        row("ACTION", "人物动作", unit.characterAction || unit.actorDirection || unit.action || ""),
        row("DRAMA PURPOSE", "情绪与戏剧目的", unit.dramaticPurpose || "", DOCX_THEME.panelAlt),
        row("DIALOGUE", "台词", unit.dialogue || unit.dialogueOrSubtitle || unit.dialogueBubble || ""),
        row("SOUND", "音效与环境声", unit.soundDesign || unit.audioCue || unit.soundEffect || "", DOCX_THEME.panelAlt),
        row("ENDING HOOK", "结尾钩子", unit.endingHook || fallback.endingHook || ""),
        row("AI PROMPT CN", "AI 中文提示词", unit.aiPromptZh || "", DOCX_THEME.panelAlt),
        row("PROMPT EN", "AI English Prompt", unit.aiPromptEn || ""),
        row("NEGATIVE", "反向提示词", unit.negativePrompt || "", DOCX_THEME.panelAlt)
      ],
      { borders: noBorders, columnWidths }
    ),
    paragraph("", { after: 120, line: 120 })
  ];
}

function productionSceneBlocks(episode) {
  const children = [];
  const scriptText = episode.scriptText || episode.aiShortDrama?.scriptText || episode.aiManhuaDrama?.scriptText;

  if (episode.productionValue) {
    children.push(heading("制作价值说明", HeadingLevel.HEADING_3), paragraph(episode.productionValue));
  }

  if (scriptText) {
    children.push(heading("完整制作正文", HeadingLevel.HEADING_3), paragraph(scriptText));
  }

  if (episode.aiManhuaDrama?.layoutNotes?.length) {
    children.push(heading("漫剧导演执行原则", HeadingLevel.HEADING_3));
    episode.aiManhuaDrama.layoutNotes.forEach((item) => children.push(bullet(item)));
  }

  if (episode.aiManhuaDrama?.panels?.length) {
    children.push(heading("逐格高级分镜执行稿", HeadingLevel.HEADING_3));
    episode.aiManhuaDrama.panels.forEach((panel) => {
      children.push(
        ...productionUnitBlocks(panel, {
          heading: `格 ${panel.panelNumber || ""}｜${panel.timecode || ""}｜${panel.function || "画面"}`,
          endingHook: episode.endingHook
        })
      );
    });
  }

  if (episode.aiShortDrama?.editingNotes?.length) {
    children.push(heading("短剧导演执行原则", HeadingLevel.HEADING_3));
    episode.aiShortDrama.editingNotes.forEach((item) => children.push(bullet(item)));
  }

  if (episode.aiShortDrama?.shots?.length) {
    children.push(heading("逐镜头高级执行稿", HeadingLevel.HEADING_3));
    episode.aiShortDrama.shots.forEach((shot) => {
      children.push(
        ...productionUnitBlocks(shot, {
          heading: `镜头 ${shot.shotNumber || ""}｜${shot.timecode || ""}｜${shot.function || "画面"}`,
          endingHook: episode.endingHook
        })
      );
    });
  }

  if (!children.length) {
    children.push(heading("制作执行表", HeadingLevel.HEADING_3));
    children.push(paragraph("当前集尚未录入逐镜头制作表；请先补齐 content-source 中的 aiShortDrama.shots 或 aiManhuaDrama.panels。"));
  }

  return children;
}

function safeInternalSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function safeDownloadName(value) {
  return String(value || "")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function compactEpisodeScope(numbers) {
  const sorted = Array.from(new Set(numbers)).sort((a, b) => a - b);
  if (!sorted.length) return "continuation";

  const ranges = [];
  let start = sorted[0];
  let previous = sorted[0];

  for (let index = 1; index <= sorted.length; index += 1) {
    const current = sorted[index];
    if (current === previous + 1) {
      previous = current;
      continue;
    }

    ranges.push(start === previous ? String(start) : `${start}-${previous}`);
    start = current;
    previous = current;
  }

  return ranges.join("-");
}

function buildDeliveryOutputRelativePath(script, deliveryType, options = {}) {
  const safeSlug = safeInternalSlug(script.slug);
  const episodeStart = options.episodeStart;
  const episodeEnd = options.episodeEnd;
  const episodeNumbers = Array.isArray(options.episodeNumbers) ? options.episodeNumbers : [];

  if (deliveryType === "buyout") {
    return path.join("downloads", safeSlug, "deliveries", "buyout-full-package-v1.docx").replace(/\\/g, "/");
  }

  if (deliveryType === "revenue_share") {
    const start = episodeStart || 4;
    const end = episodeEnd || 10;
    return path
      .join("downloads", safeSlug, "deliveries", `revenue-share-episodes-${start}-${end}-package-v1.docx`)
      .replace(/\\/g, "/");
  }

  const scope = compactEpisodeScope(
    episodeNumbers.length
      ? episodeNumbers
      : [episodeStart, episodeEnd].filter((value) => Number.isInteger(value))
  );
  return path.join("downloads", safeSlug, "deliveries", `episodes-${scope}-package-v1.docx`).replace(/\\/g, "/");
}

function normalizeDeliveryEpisodeNumbers(script, deliveryType, options = {}) {
  const freeEpisodeCount = script.freeEpisodeCount || 3;
  const episodeCount = script.episodeCount || Math.max(freeEpisodeCount, options.episodeEnd || freeEpisodeCount);
  const firstPaidEpisode = freeEpisodeCount + 1;

  if (deliveryType === "buyout") {
    const numbers = [];
    for (let episodeNumber = firstPaidEpisode; episodeNumber <= episodeCount; episodeNumber += 1) {
      numbers.push(episodeNumber);
    }
    return numbers;
  }

  if (Array.isArray(options.episodeNumbers) && options.episodeNumbers.length) {
    return Array.from(new Set(options.episodeNumbers)).sort((a, b) => a - b);
  }

  const episodeStart = options.episodeStart || firstPaidEpisode;
  const episodeEnd = options.episodeEnd || (deliveryType === "revenue_share" ? Math.min(10, episodeCount) : episodeStart);
  const numbers = [];
  for (let episodeNumber = episodeStart; episodeNumber <= episodeEnd; episodeNumber += 1) {
    numbers.push(episodeNumber);
  }
  return numbers;
}

function formatDeliveryType(type) {
  if (type === "buyout") return "一次性买断";
  if (type === "revenue_share") return "版权分成";
  return "按集购买";
}

function buildContinuationDeliveryDoc(data, options = {}) {
  const script = data.script;
  const deliveryType = options.deliveryType || "pay_per_episode";
  const freeEpisodeCount = script.freeEpisodeCount || 3;
  const totalEpisodeCount = script.episodeCount || Math.max(freeEpisodeCount, options.episodeEnd || freeEpisodeCount);
  const episodeNumbers = normalizeDeliveryEpisodeNumbers(script, deliveryType, options);
  const episodeMap = new Map((data.episodes || []).map((episode) => [episode.episodeNumber, episode]));
  const existingEpisodes = episodeNumbers
    .map((episodeNumber) => episodeMap.get(episodeNumber))
    .filter(Boolean);
  const missingEpisodeNumbers = episodeNumbers.filter((episodeNumber) => !episodeMap.has(episodeNumber));
  const rangeLabel = episodeNumbers.length
    ? `第 ${episodeNumbers[0]}-${episodeNumbers[episodeNumbers.length - 1]} 集`
    : "后续剧集";
  const deliveryLabel = formatDeliveryType(deliveryType);

  const children = [
    ...scriptCoverBlocks(script, `${deliveryLabel}交付包`, "CONTINUATION DELIVERY PACKAGE", [
      ["DELIVERY", "合作方式", deliveryLabel],
      ["SCOPE", "交付范围", deliveryType === "buyout" ? `第 ${freeEpisodeCount + 1}-${totalEpisodeCount} 集` : rangeLabel],
      ["GENRE", "剧本类型", script.category],
      ["PURPOSE", "文件用途", "后续剧集制作与授权交付"]
    ]),
    topBar("DOCUMENT NAVIGATION", "目录 / CONTENTS"),
    sectionTitle("00", "内容导航", "Contents"),
    navigationTable([
      ["01", "交付说明", "DELIVERY NOTES"],
      ["02", "授权边界", "RIGHTS BOUNDARY"],
      ["03", "剧集内容", "EPISODE CONTENT"],
      ...episodeNumbers.slice(0, 12).map((episodeNumber, index) => [
        String(index + 4).padStart(2, "0"),
        `第 ${episodeNumber} 集`,
        `EPISODE ${String(episodeNumber).padStart(2, "0")}`
      ])
    ]),
    sectionTitle("01", "交付说明", "Delivery Notes"),
    paragraph(options.deliveryNote || "请先阅读本交付包的授权边界和制作注意事项，再进行后续视频制作、团队分发或账号投放。"),
    bullet("本文件仅面向本次审批通过的合作范围使用。"),
    bullet("请勿将原始剧本、分镜、提示词或交付包转售、公开上传或二次分发。"),
    bullet("如需扩大合作范围，请在用户中心重新提交后续合作申请。"),
    sectionTitle("02", "授权边界", "Rights Boundary")
  ];

  if (deliveryType === "buyout") {
    children.push(
      bullet("买断交付范围以本次后台审批与订单说明为准。"),
      bullet("除双方另有书面约定外，买断不代表可转售原始剧本文档或提示词资源包。")
    );
  } else if (deliveryType === "revenue_share") {
    children.push(
      bullet("版权分成合作仅允许在双方确认的平台、账号和剧集范围内制作发布。"),
      bullet("用户需要按约定周期回传视频链接、播放数据、收益数据和截图凭证。"),
      bullet("收益口径、分成比例、结算周期和违约处理，以双方确认的协议或合作说明为准。")
    );
  } else {
    children.push(
      bullet("按集购买仅授权本次购买的剧集范围，不包含未购买剧集的制作和改编授权。"),
      bullet("如本批次效果良好，可继续按集购买后续内容。")
    );
  }

  children.push(
    sectionTitle("03", "剧集内容", "Episode Content"),
    paragraph(
      existingEpisodes.length
        ? "以下内容包含本次可交付剧集的概要、分镜拆解和中英双语 AI 提示词。"
        : "当前数据库尚未录入本次范围内的后续剧集正文。请在正式交付用户前补齐对应剧集数据并重新生成交付包。"
    )
  );

  episodeNumbers.forEach((episodeNumber) => {
    const episode = episodeMap.get(episodeNumber);
    children.push(
      topBar(`EPISODE ${String(episodeNumber).padStart(2, "0")}  ·  DELIVERY BOARD`, `第 ${episodeNumber} 集 / EPISODE ${String(episodeNumber).padStart(2, "0")}`),
      sectionTitle(String(episodeNumber).padStart(2, "0"), episode?.title || "待补齐", `Episode ${String(episodeNumber).padStart(2, "0")}`, { size: 36, before: 360 })
    );

    if (!episode) {
      children.push(
        metadataTable([
          ["内容状态", "待补齐"],
          ["处理建议", "请先在数据库中录入本集标题、概要、开场钩子、结尾钩子和中英双语 AI 提示词，再重新生成交付包。"]
        ])
      );
      return;
    }

    children.push(
      labelParagraph("HOOK / SUMMARY / CLIFFHANGER", ""),
      episodeBoard(episode),
      sectionTitle("", "剧情正文", "Script Text", { before: 180, size: 24 }),
      valueParagraph(episode.summary || "未填写", { bold: true, size: 18, color: DOCX_THEME.body }),
      sectionTitle("", "分镜拆解", "Storyboard Notes", { before: 180, size: 24 }),
      bullet(`开场：用“${episode.hook || "本集核心冲突"}”作为前 3 秒冲突点。`),
      bullet("推进：保持短句、快节奏和强信息密度，确保每 5-8 秒有一次情绪或信息变化。"),
      bullet(`收尾：用“${episode.endingHook || "下一集悬念"}”承接评论区讨论和下一集点击。`),
      promptBox("AI 中文提示词", "AI PROMPT CN", episode.aiPromptZh || "未填写"),
      promptBox("AI English Prompt", "PROMPT EN", episode.aiPromptEn || "Not provided")
    );
    children.push(...productionSceneBlocks(episode));
  });

  if (missingEpisodeNumbers.length) {
    children.push(
      sectionTitle("04", "待补齐清单", "Missing Episode Checklist"),
      paragraph(`以下剧集尚未录入数据库：第 ${missingEpisodeNumbers.join("、")} 集。正式面向用户交付前，需要补齐内容并重新生成 docx。`)
    );
  }

  return buildDocument({
    creator: "短剧本铺",
    title: `${script.title} ${deliveryLabel}交付包`,
    description: script.logline,
    children
  });
}

function buildFreePreviewDoc(data) {
  const script = data.script;
  const freeEpisodes = (data.episodes || [])
    .filter((episode) => episode.isFreePreview && episode.status === "published")
    .sort((a, b) => a.episodeNumber - b.episodeNumber)
    .slice(0, script.freeEpisodeCount || 3);

  assert(freeEpisodes.length >= 3, `${script.slug} requires at least 3 published free preview episodes`);

  const children = [
    ...scriptCoverBlocks(script, "前三集免费验证包", "EPISODES 01-03 VALIDATION PACK", [
      ["GENRE", "剧本类型", script.category],
      ["PLATFORMS", "推荐平台", normalizeList(script.recommendedPlatforms)],
      ["AUDIENCE", "目标受众", normalizeList(script.audienceTags)],
      ["DIFFICULTY", "制作难度", script.productionDifficulty || "未填写"],
      ["SCOPE", "免费范围", `第 1-${script.freeEpisodeCount || 3} 集，仅用于测试验证`]
    ]),
    topBar("DOCUMENT NAVIGATION", "目录 / CONTENTS"),
    sectionTitle("00", "内容导航", "Contents"),
    navigationTable([
      ["01", "项目总览", "PROJECT OVERVIEW"],
      ["02", "使用说明", "USAGE NOTES"],
      ["03", "授权边界", "RIGHTS BOUNDARY"],
      ["04", "剧本概览", "STORY OVERVIEW"],
      ...freeEpisodes.map((episode) => [
        String(episode.episodeNumber + 4).padStart(2, "0"),
        `第 ${episode.episodeNumber} 集：${episode.title}`,
        `EPISODE ${String(episode.episodeNumber).padStart(2, "0")}`
      ]),
      ["08", "发布测试记录表", "RELEASE TESTING SHEET"],
      ["09", "后续合作方式", "COLLABORATION OPTIONS"]
    ]),
    topBar("PROJECT INFORMATION", "项目总览 / OVERVIEW"),
    sectionTitle("01", "项目总览", "Project Overview"),
    infoGrid([
      ["GENRE", "剧本类型", script.category],
      ["PLATFORMS", "推荐平台", normalizeList(script.recommendedPlatforms)],
      ["AUDIENCE", "目标受众", normalizeList(script.audienceTags)],
      ["DIFFICULTY", "制作难度", script.productionDifficulty || "未填写"],
      ["SCOPE", "免费范围", `第 1-${script.freeEpisodeCount || 3} 集，仅用于测试验证`]
    ], 2),
    sectionTitle("02", "使用说明", "Usage Notes"),
    paragraph("这份文档用于帮助你快速判断该剧本是否适合制作成短视频内容。你可以使用前三集进行视频制作和发布测试，并根据播放、互动、涨粉和收益数据判断是否继续投入。"),
    bullet("建议先制作 1-3 条测试视频，不要一开始投入过高成本。"),
    bullet("发布后记录播放量、点赞、评论、收藏、涨粉和观众反馈。"),
    bullet("如果数据表现较好，可以回到用户中心提交测试反馈并申请后续合作。"),
    sectionTitle("03", "授权边界", "Rights Boundary"),
    bullet("免费验证包仅授权你使用前三集内容进行测试发布。"),
    bullet("免费验证包不包含第 4 集及以后内容的制作权、改编权或转售权。"),
    bullet("不得将本文档打包转售、上传资源平台、作为课程资料二次分发。"),
    bullet("继续制作后续内容，需要选择买断、按集购买或版权分成合作。"),
    sectionTitle("04", "剧本概览", "Story Overview"),
    valueParagraph(script.synopsis, { bold: true, size: 18, color: DOCX_THEME.body, line: 317 })
  ];

  freeEpisodes.forEach((episode) => {
    children.push(
      topBar(`EPISODE ${String(episode.episodeNumber).padStart(2, "0")}  ·  PRODUCTION BOARD`, `第 ${episode.episodeNumber} 集 / EPISODE ${String(episode.episodeNumber).padStart(2, "0")}`),
      sectionTitle(String(episode.episodeNumber).padStart(2, "0"), episode.title, `Episode ${String(episode.episodeNumber).padStart(2, "0")}`, { size: 36, before: 360 }),
      labelParagraph("HOOK / SUMMARY / CLIFFHANGER", ""),
      episodeBoard(episode),
      sectionTitle("", "剧情正文", "Script Text", { before: 180, size: 24 }),
      valueParagraph(episode.summary, { bold: true, size: 18, color: DOCX_THEME.body }),
      sectionTitle("", "分镜拆解", "Storyboard Notes", { before: 180, size: 24 }),
      bullet(`开场：用“${episode.hook}”作为前 3 秒冲突点，优先放大情绪或悬念。`),
      bullet(`推进：围绕本集核心线索展开，镜头节奏保持短句、快切和强信息密度。`),
      bullet(`收尾：用“${episode.endingHook}”作为评论区和下一集承接点。`),
      promptBox("AI 中文提示词", "AI PROMPT CN", episode.aiPromptZh),
      promptBox("AI English Prompt", "PROMPT EN", episode.aiPromptEn)
    );
    children.push(...productionSceneBlocks(episode));
  });

  children.push(
    sectionTitle("08", "发布测试记录表", "Release Testing Sheet"),
    metadataTable([
      ["发布平台", ""],
      ["视频链接", ""],
      ["发布时间", ""],
      ["播放量", ""],
      ["点赞量", ""],
      ["评论量", ""],
      ["收藏量", ""],
      ["涨粉量", ""],
      ["是否值得继续", ""]
    ]),
    sectionTitle("09", "后续合作方式", "Collaboration Options"),
    bullet("一次性买断：适合已经验证出较好数据、希望快速连续更新的团队。"),
    bullet("按集购买：适合想控制风险、边做边看数据的账号。"),
    bullet("版权分成：适合有制作和运营能力，但希望降低前期采购成本的创作者或团队。")
  );

  return buildDocument({
    creator: "短剧本铺",
    title: `${script.title} 前三集免费验证包`,
    description: script.logline,
    children
  });
}

async function generateFreePreview(data, sourcePath, options) {
  const slug = data.script.slug;
  const safeSlug = safeInternalSlug(slug);
  const outputDir = path.join(projectRoot, "downloads", safeSlug);
  const outputRelativePath = path.join("downloads", safeSlug, `free-preview-${safeSlug}-v1.docx`).replace(/\\/g, "/");
  const outputPath = path.join(projectRoot, outputRelativePath);
  const downloadName = `${safeDownloadName(data.script.title)}-前三集免费验证包.docx`;

  ensureDirectory(outputDir);

  const document = buildFreePreviewDoc(data);
  const buffer = await Packer.toBuffer(document);
  fs.writeFileSync(outputPath, buffer);

  if (options.updateAssets) {
    const freeAsset = (data.assets || []).find((asset) => asset.assetType === "free_preview" && asset.isPublic);
    assert(freeAsset, `${slug} has no public free_preview asset`);
    freeAsset.filePath = outputRelativePath;
    freeAsset.fileFormat = "docx";
    freeAsset.title = `《${data.script.title}》前三集免费验证包`;
    writeJson(sourcePath, data);
  }

  return {
    slug,
    output: outputRelativePath,
    downloadName,
    bytes: buffer.length,
    updatedAssets: options.updateAssets
  };
}

async function generateContinuationDeliveryPackage(data, options = {}) {
  const script = data.script;
  const deliveryType = options.deliveryType || "pay_per_episode";
  const outputRelativePath =
    options.outputRelativePath || buildDeliveryOutputRelativePath(script, deliveryType, options);
  const outputPath = path.join(projectRoot, outputRelativePath);

  ensureDirectory(path.dirname(outputPath));

  const document = buildContinuationDeliveryDoc(data, options);
  const buffer = await Packer.toBuffer(document);
  fs.writeFileSync(outputPath, buffer);

  return {
    slug: script.slug,
    deliveryType,
    output: outputRelativePath.replace(/\\/g, "/"),
    bytes: buffer.length
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  const files = listScriptDataFiles(options.slug);
  const results = [];

  for (const filePath of files) {
    assert(fs.existsSync(filePath), `Script data file not found: ${filePath}`);
    const data = readJson(filePath);
    if (options.type === "free_preview") {
      results.push(await generateFreePreview(data, filePath, options));
    } else if (["buyout", "pay_per_episode", "revenue_share"].includes(options.type)) {
      results.push(
        await generateContinuationDeliveryPackage(data, {
          deliveryType: options.type,
          episodeStart: Number.isInteger(options.episodeStart) ? options.episodeStart : undefined,
          episodeEnd: Number.isInteger(options.episodeEnd) ? options.episodeEnd : undefined,
          episodeNumbers: options.episodeNumbers
        })
      );
    } else {
      throw new Error(`Unsupported --type ${options.type}`);
    }
  }

  console.log(JSON.stringify({ generated: results }, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  buildFreePreviewDoc,
  buildContinuationDeliveryDoc,
  buildDeliveryOutputRelativePath,
  generateFreePreview,
  generateContinuationDeliveryPackage,
  safeDownloadName
};
