const fs = require("node:fs");
const path = require("node:path");
const { catalogItems } = require("./generate-hot-script-catalog");

const projectRoot = path.join(__dirname, "..");
const docsDir = path.join(projectRoot, "docs");
const jsonPath = path.join(docsDir, "cover-generation-task-list.json");
const markdownPath = path.join(docsDir, "cover-generation-task-list.md");

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function imageExists(item) {
  return fs.existsSync(path.join(projectRoot, "public", "site", item.coverImage));
}

function toTask(item, index) {
  return {
    index: index + 1,
    slug: item.slug,
    title: item.title,
    mode: item.mode,
    category: item.category,
    outputFileName: path.basename(item.coverImage),
    outputPath: `public/site/${item.coverImage}`,
    publicCoverImage: item.coverImage,
    aspectRatio: "9:16",
    outputFormat: "png",
    status: imageExists(item) ? "exists" : "missing",
    coreContent: {
      trope: item.trope,
      protagonistRole: item.protagonistRole,
      setting: item.setting,
      coreItem: item.coreItem,
      antagonist: item.antagonist
    },
    promptZh: item.coverPromptZh,
    promptEn: item.coverPromptEn,
    negativePrompt: "no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background"
  };
}

function markdownEscape(value) {
  return String(value || "").replace(/\|/g, "\\|");
}

function buildMarkdown(tasks) {
  const missingCount = tasks.filter((task) => task.status === "missing").length;
  const existsCount = tasks.length - missingCount;

  const lines = [
    "# 封面 PNG 批量生成任务清单",
    "",
    "这份清单用于生成真正的 9:16 PNG 剧本封面，而不是 SVG 占位图。",
    "",
    "## 使用规则",
    "",
    "- 所有图片保存到：`D:\\售卖AI短剧剧本\\public\\site\\assets\\covers\\hot-catalog\\`",
    "- 文件名必须严格使用每条任务的 `outputFileName`。",
    "- 图片比例：`9:16`。",
    "- 图片格式：`PNG`。",
    "- 封面不要文字、不要 logo、不要水印。",
    "- 生成完成后运行：`node scripts/check-hot-catalog-png-covers.js`。",
    "- 全部通过后再运行：`npm.cmd run generate:hot-catalog`，把 `content-source`、`scripts-data` 和数据库封面路径同步为 PNG。",
    "",
    "## 当前进度",
    "",
    `- 总数：${tasks.length}`,
    `- 已存在 PNG：${existsCount}`,
    `- 待生成 PNG：${missingCount}`,
    "",
    "## 任务表",
    "",
    "| # | 状态 | slug | 剧名 | 保存文件名 | 核心场景 | 核心道具 |",
    "|---:|---|---|---|---|---|---|"
  ];

  tasks.forEach((task) => {
    lines.push(
      `| ${task.index} | ${task.status} | ${task.slug} | ${markdownEscape(task.title)} | ${task.outputFileName} | ${markdownEscape(task.coreContent.setting)} | ${markdownEscape(task.coreContent.coreItem)} |`
    );
  });

  lines.push("", "## 详细提示词", "");

  tasks.forEach((task) => {
    lines.push(
      `### ${task.index}. ${task.title}`,
      "",
      `- slug：\`${task.slug}\``,
      `- 保存路径：\`${task.outputPath}\``,
      `- 核心场景：${task.coreContent.setting}`,
      `- 核心道具：${task.coreContent.coreItem}`,
      `- 主角身份：${task.coreContent.protagonistRole}`,
      `- 对手压力：${task.coreContent.antagonist}`,
      "",
      "**中文提示词**",
      "",
      "```text",
      task.promptZh,
      "```",
      "",
      "**English Prompt**",
      "",
      "```text",
      task.promptEn,
      "```",
      "",
      "**Negative Prompt**",
      "",
      "```text",
      task.negativePrompt,
      "```",
      ""
    );
  });

  return `${lines.join("\n")}\n`;
}

function main() {
  ensureDirectory(docsDir);
  const tasks = catalogItems().map(toTask);
  fs.writeFileSync(jsonPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), tasks }, null, 2)}\n`, "utf8");
  fs.writeFileSync(markdownPath, buildMarkdown(tasks), "utf8");

  console.log(
    JSON.stringify(
      {
        tasks: tasks.length,
        exists: tasks.filter((task) => task.status === "exists").length,
        missing: tasks.filter((task) => task.status === "missing").length,
        markdown: path.relative(projectRoot, markdownPath).replace(/\\/g, "/"),
        json: path.relative(projectRoot, jsonPath).replace(/\\/g, "/")
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
