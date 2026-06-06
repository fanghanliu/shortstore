# 高级批量剧本生产模板

这份文档把《灰烬图书馆》已经验证通过的付费交付结构，抽象为后续批量生产的统一模板。

目标不是再写一次固定题材脚本，而是让每一部新剧都按同一条高级链路产出：

```text
题材与人设
-> 每集正文
-> 每集 9 个高级 AI 漫剧分镜 beat
-> 自动生成 9 个 panels
-> 自动生成 8 个 AI 短剧 shots
-> 自动生成中英文提示词
-> 自动质检
-> 生产 DOCX
-> 导入数据库
```

## 1. 模板文件

核心模板：

```text
scripts/lib/advanced-production-template.js
```

它负责：

- 统一 `panel` / `shot` 字段结构。
- 自动生成 `sceneHeading`、`timecode`、`aiPromptZh`、`aiPromptEn`、`negativePrompt`。
- 自动生成 `aiManhuaDrama.panels` 和 `aiShortDrama.shots`。
- 检查每集是否达到付费交付厚度。
- 写出 `run-daily-script-production.js` 可直接消费的 `generated-xxx.json`。

质检入口：

```text
scripts/validate-advanced-production-payload.js
```

批量生产入口：

```text
scripts/run-advanced-batch-production.js
```

命令：

```bash
npm run validate:advanced-script -- --input automation-briefs/generated-ash-library-contract.json
```

## 2. 每部剧需要人工或 Codex 填写的内容

每部剧只需要填四类信息。

### 2.1 master

必须包含：

```js
{
  slug,
  title: { zh, en },
  primaryMode,
  supportedModes,
  logline,
  synopsis,
  category,
  recommendedPlatforms,
  audienceTags,
  productionDifficulty,
  commercialPolicy,
  characters,
  worldview,
  visualStyle,
  tone
}
```

建议标准：

- `logline` 必须有商业钩子。
- `synopsis` 必须写清前三集的付费钩子。
- `characters` 每个角色至少包含 `motivation`、`fear`、`secret`、`visualDesign`。
- `worldview` 必须说明规则与代价。
- `visualStyle` 必须能直接指导画面生成。

### 2.2 episode 基础信息

每集必须包含：

```js
{
  episodeNumber,
  title,
  hook,
  summary,
  endingHook
}
```

最低要求：

- `summary` 不少于 240 个中文字符。
- `hook` 必须能在前 3 秒成立。
- `endingHook` 必须制造第 4 集或下一集需求。

### 2.3 scriptText

每集正文必须不少于 450 个中文字符。

正文必须按：

```text
铺垫
-> 压迫
-> 转折
-> 爆发
-> 余韵
```

正文不是摘要，必须写出：

- 场面调度。
- 人物当下目标。
- 隐藏冲突。
- 动作微反应。
- 证据或规则推进。
- 结尾悬念。

### 2.4 beats

每集至少 9 个 beat。

每个 beat 必须包含：

```js
{
  function,
  visualDesign,
  cameraLanguage,
  characterAction,
  dramaticPurpose,
  dialogue,
  soundDesign,
  endingHook
}
```

这些 beat 会被模板自动转成：

- `aiManhuaDrama.panels`
- `aiShortDrama.shots`
- `aiPromptZh`
- `aiPromptEn`
- `negativePrompt`

## 3. 推荐每集 9 beat 结构

```text
1. 冷开场钩子
2. 主角目标建立
3. 规则或证据出现
4. 第一次压迫升级
5. 关键人物对峙
6. 信息反转
7. 代价显现
8. 关系变化
9. 结尾强钩子
```

不同题材可以换名字，但不能丢掉戏剧功能。

## 4. 生产代码模式

新剧脚本推荐这样写：

```js
const path = require("node:path");
const {
  paragraph,
  buildAdvancedEpisode,
  buildAdvancedPayload,
  writeAdvancedProductionInput
} = require("./lib/advanced-production-template");

const slug = "your-script-slug";
const theme = {
  titleZh: "中文剧名",
  titleEn: "English Title",
  zhStyle: "竖屏风格、画面质感、人物设计、光影规则",
  enStyle: "vertical cinematic style, consistent character design, strong suspense"
};

const episode = buildAdvancedEpisode({
  episode: {
    episodeNumber: 1,
    title: "第 1 集标题",
    hook: "强钩子",
    summary: "不少于 240 字的剧情摘要",
    endingHook: "结尾钩子"
  },
  scriptText: paragraph([
    "正文段落 1",
    "正文段落 2",
    "正文段落 3"
  ]),
  beats: [
    {
      function: "冷开场钩子",
      visualDesign: "画面设计",
      cameraLanguage: "镜头语言",
      characterAction: "人物动作",
      dramaticPurpose: "情绪与戏剧目的",
      dialogue: "台词",
      soundDesign: "音效与环境声",
      endingHook: "本格钩子"
    }
  ],
  theme
});

const payload = buildAdvancedPayload({
  slug,
  status: "published",
  featured: false,
  trendEvidence: [],
  master,
  episodes: [episode]
});

writeAdvancedProductionInput(
  path.join(__dirname, "..", "automation-briefs", `generated-${slug}.json`),
  payload
);
```

## 5. 批量生产标准流程

单部剧：

```bash
node scripts/write-your-advanced-sample.js
npm run validate:advanced-script -- --input automation-briefs/generated-your-slug.json
node scripts/run-daily-script-production.js --input automation-briefs/generated-your-slug.json
```

批量剧：

```text
1. 每部剧先生成 generated-xxx.json。
2. 对每个 generated-xxx.json 执行 validate:advanced-script。
3. 全部通过后，再逐部调用 run-daily-script-production.js。
4. 任意一部失败，只跳过该部，不阻塞整批。
5. 每批完成后抽查前端详情页和 DOCX。
```

批量 dry-run：

```bash
npm run run:advanced-batch-production -- \
  --input automation-briefs/generated-ash-library-contract.json \
  --dry-run \
  --manifest automation-briefs/advanced-batch-dry-run.json
```

批量正式生产：

```bash
npm run run:advanced-batch-production -- \
  --input-dir automation-briefs \
  --prefix generated- \
  --manifest automation-briefs/advanced-batch-production.json
```

如果整批里有某一部失败，默认只记录失败项并继续跑下一部。需要遇到失败就停止时，加：

```bash
--stop-on-error
```

## 6. 质检门槛

默认门槛：

| 项目 | 标准 |
|---|---|
| 每集 summary | 不少于 240 字 |
| 每集 scriptText | 不少于 450 字 |
| AI 漫剧 panels | 每集不少于 9 个 |
| AI 短剧 shots | 每集不少于 8 个 |
| panel 字段 | 必须包含画面、镜头、动作、戏剧目的、台词、音效、钩子、中英文提示词 |
| shot 字段 | 同 panel |
| 英文提示词 | 不得混入中文 |

调高门槛示例：

```bash
npm run validate:advanced-script -- \
  --input automation-briefs/generated-xxx.json \
  --min-summary-chars 320 \
  --min-script-text-chars 650 \
  --min-panels 10 \
  --min-shots 9
```

## 7. 后续批量化方向

下一步可以把多个题材 spec 放进一个批量脚本：

```text
scripts/write-advanced-batch-samples.js
```

每个 spec 只填：

- 题材。
- 人设。
- 世界观。
- 三集正文。
- 三集 beats。

统一由 `advanced-production-template.js` 转成标准交付包。

这能保证 50-100 部补库时，每一部的内容厚度和交付结构都接近《灰烬图书馆》的样板标准。
