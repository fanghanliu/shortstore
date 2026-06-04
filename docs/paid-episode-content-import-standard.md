# 后续剧集内容录入与导入规范

## 1. 文档目标

本文档用于解决第 4 集以后内容如何生产、整理、入库和交付的问题。

当前系统已经有：

- `Script`：剧本主信息。
- `ScriptEpisode`：剧集摘要、钩子和中英文 AI 提示词。
- `Delivery`：用户后续内容交付记录。
- `DeliveryAsset`：具体交付文件。
- `scripts/generate-docx-deliveries.js`：根据 `scripts-data` 生成免费包、按集包、买断包和分成包。

但当前最大缺口是：

- 数据库里主要是前三集验证内容。
- 第 4 集以后没有统一录入规范。
- AI 漫剧和 AI 短剧的剧本生成模式还没有区分。
- 完整正文、分镜、提示词、参考图到底应该入库还是存文件，还没有明确边界。

结论先写在前面：

数据库不应该直接承载完整剧本文档全文。数据库负责索引、筛选、权限、集数范围和交付状态；完整内容应该优先保存在结构化文件和 DOCX 交付包中。

## 2. 先区分三种“剧本”

后续讨论剧本时，必须先说明是哪一层。

| 层级 | 名称 | 作用 | 建议存放 |
| --- | --- | --- | --- |
| 1 | 剧本母版 | 完整故事、人物、世界观、全集结构 | `content-source/{slug}/master.md` 或 `master.json` |
| 2 | 单集生产稿 | 每集正文、分镜、提示词、制作说明 | `content-source/{slug}/episodes/episode-004.md` |
| 3 | 数据库剧集索引 | 标题、钩子、概要、结尾钩子、中英提示词摘要 | `ScriptEpisode` |
| 4 | 用户交付包 | 用户实际下载的正式文件 | `downloads/{slug}/deliveries/*.docx` |
| 5 | 页面展示数据 | 剧本卡片、详情页、续作方式 | `scripts-data/{slug}.json` 导入数据库 |

不要把这五层混成一个东西。

## 3. AI 短剧与 AI 漫剧的生成模式差异

AI 短剧和 AI 漫剧都可以从同一个故事母版出发，但生产稿不一样。

### 3.1 AI 短剧

AI 短剧面向视频生成和竖屏连续剧情。

核心目标：

- 45-75 秒一集。
- 真人感或影视感画面。
- 镜头运动、表演、音效和剪辑节奏更重要。
- 每集要有强开场、强冲突、强结尾。

单集生产稿重点：

- 剧情正文。
- 对白和旁白。
- 场景调度。
- 镜头运动。
- 角色表演。
- 光线氛围。
- 音效音乐。
- AI 视频提示词。
- 剪辑节奏建议。

提示词重点：

- `vertical 9:16`
- `cinematic lighting`
- `camera movement`
- `character action`
- `acting expression`
- `short drama pacing`

适合工具：

- Sora
- Runway
- 可灵
- 即梦
- Pika
- 剪映 / CapCut

### 3.2 AI 漫剧

AI 漫剧面向漫画分镜、图文视频、动态漫或小说推文式内容。

核心目标：

- 以画格、构图、角色一致性和文字节奏推进。
- 不一定需要真实镜头运动，但需要画面连续性。
- 每集可以拆成 8-20 个漫画格或图文镜头。
- 适合做“漫画图 + 配音 + 字幕 + 轻动效”。

单集生产稿重点：

- 剧情正文。
- 漫画分格。
- 每格画面描述。
- 角色站位和表情。
- 对话气泡 / 旁白框。
- 漫画风格提示词。
- 角色设定图提示词。
- 画面比例和字体留白。
- 转场和轻动效建议。

提示词重点：

- `comic panel`
- `manhua style`
- `webtoon composition`
- `clean line art`
- `speech bubble space`
- `consistent character design`
- `panel-to-panel continuity`

适合工具：

- Midjourney
- Stable Diffusion
- ComfyUI
- 即梦图片
- 可灵图片
- 剪映 / CapCut

### 3.3 两者字段对比

| 字段 | AI 短剧 | AI 漫剧 |
| --- | --- | --- |
| 核心单位 | 镜头 / 场景 | 漫画格 / 分格 |
| 画面重点 | 影视感、运动、表演 | 构图、线条、表情、对白框 |
| 提示词重点 | 视频生成提示词 | 图片 / 漫画提示词 |
| 节奏重点 | 每 5-8 秒信息变化 | 每 1-3 格推进一个信息点 |
| 交付文件 | 短剧制作包 DOCX | 漫剧制作包 DOCX |
| 参考图 | 分镜参考图、角色定妆图 | 角色设定图、漫画分格参考图 |
| 后期 | 剪辑、字幕、配音、配乐 | 图文排版、气泡、轻动效、配音 |

## 4. 自动化生成剧本的推荐总流程

你的三步判断可以升级为下面这条流水线：

```text
1. 自动化生成剧本母版
   -> 故事设定、人物、小传、世界观、全集结构、每集概要

2. 按媒介类型生成生产资产
   -> AI短剧：正文、镜头分镜、中英文视频提示词、剪辑建议
   -> AI漫剧：正文、漫画分格、中英文图片提示词、气泡/旁白建议

3. 生成商业资产
   -> product-template.json
   -> 免费前三集验证包
   -> 第4集以后交付包
   -> 参考图任务清单

4. 生成入库资产
   -> scripts-data/{slug}.json
   -> episodes 第1-N集摘要与提示词索引
   -> assets 免费包资源
   -> continuationOptions 续作方式

5. 导入数据库
   -> node scripts/import-script-data.js scripts-data/{slug}.json

6. 生成用户交付文件
   -> node scripts/generate-docx-deliveries.js --type pay_per_episode --slug {slug} --episodes 4,5,6
   -> node scripts/generate-docx-deliveries.js --type buyout --slug {slug}
   -> node scripts/generate-docx-deliveries.js --type revenue_share --slug {slug} --episode-start 4 --episode-end 10
```

## 5. 第 4 集以后内容应该怎么存

### 5.1 数据库保存什么

`ScriptEpisode` 适合保存每集索引字段：

| 字段 | 用途 |
| --- | --- |
| `episodeNumber` | 第几集 |
| `title` | 单集标题 |
| `hook` | 开场钩子 |
| `summary` | 本集概要 |
| `endingHook` | 结尾悬念 |
| `aiPromptZh` | 本集核心中文提示词 |
| `aiPromptEn` | 本集核心英文提示词 |
| `isFreePreview` | 前三集为 true，第4集以后为 false |
| `status` | draft / published |

第 4 集以后可以进入 `ScriptEpisode`，但建议只放摘要级内容，不放完整正文和完整分镜。

原因：

- 完整正文可能很长。
- 分镜可能有 8-20 条甚至更多。
- 提示词会不断迭代。
- 付费内容直接塞数据库不利于版本管理和文件交付。

### 5.2 文件保存什么

完整内容建议保存为文件：

```text
content-source/{slug}/episodes/episode-004.md
content-source/{slug}/episodes/episode-004.json
content-source/{slug}/episodes/episode-005.md
content-source/{slug}/episodes/episode-005.json
```

文件里保存：

- 完整剧情正文。
- 完整分镜。
- 每镜头或每漫画格提示词。
- 角色视觉锚点。
- 制作说明。
- 标题和封面建议。
- 授权边界。

用户下载时，再生成：

```text
downloads/{slug}/deliveries/episodes-4-6-package-v1.docx
downloads/{slug}/deliveries/buyout-full-package-v1.docx
downloads/{slug}/deliveries/revenue-share-episodes-4-10-package-v1.docx
```

## 6. 推荐新增内部内容源结构

为了支持自动化，建议后续新增 `content-source` 目录。

```text
content-source/
  lie-scent/
    master.md
    master.json
    production-mode.json
    episodes/
      episode-001.json
      episode-002.json
      episode-003.json
      episode-004.json
      episode-005.json
    visual-references/
      character-suqingyu.md
      character-guyanchen.md
    image-tasks/
      cover-tasks.json
      storyboard-reference-tasks.json
```

说明：

- `master.md`：人类可读的完整剧本母版。
- `master.json`：自动化脚本可读的结构化母版。
- `production-mode.json`：标记是 AI 短剧、AI 漫剧，还是两者都生成。
- `episodes/*.json`：每集完整生产稿。
- `visual-references/*.md`：角色和视觉统一设定。
- `image-tasks/*.json`：参考图生成任务，不一定立即生成图片。

## 7. `production-mode.json` 标准

每套剧本需要明确媒介模式。

```json
{
  "slug": "lie-scent",
  "primaryMode": "ai_short_drama",
  "supportedModes": ["ai_short_drama", "ai_manhua_drama"],
  "defaultAspectRatio": "9:16",
  "episodeDurationSeconds": {
    "min": 45,
    "max": 75
  },
  "panelCount": {
    "min": 8,
    "max": 16
  },
  "visualStyle": {
    "ai_short_drama": "现代都市悬疑，冷蓝电影光影，真人短剧质感",
    "ai_manhua_drama": "都市悬疑国漫分镜，清晰线稿，强表情，竖屏条漫构图"
  }
}
```

字段说明：

| 字段 | 说明 |
| --- | --- |
| `primaryMode` | 主生产模式 |
| `supportedModes` | 可扩展模式 |
| `defaultAspectRatio` | 默认画幅 |
| `episodeDurationSeconds` | 短剧单集时长 |
| `panelCount` | 漫剧单集分格数量 |
| `visualStyle` | 不同模式的视觉基调 |

## 8. 单集内容源 JSON 标准

第 4 集以后建议每集一个 JSON。

### 8.1 通用字段

```json
{
  "episodeNumber": 4,
  "title": "疗养院门禁记录",
  "hook": "女主发现母亲失踪当天，男主也出现在疗养院门口。",
  "summary": "本集概要，用于入库展示和交付包索引。",
  "endingHook": "门禁记录最后一行，出现了女主自己的名字。",
  "characters": ["苏清妤", "顾宴臣"],
  "locations": ["顾氏疗养院档案室"],
  "reversalPoint": "男主不是嫌疑人，而是在替女主隐藏更危险的线索。",
  "paidScope": true,
  "status": "draft"
}
```

### 8.2 AI 短剧字段

```json
{
  "aiShortDrama": {
    "runtimeSeconds": 60,
    "scriptText": "完整剧情正文，包含旁白、对白、动作和字幕节奏。",
    "shots": [
      {
        "shotNumber": 1,
        "durationSeconds": 6,
        "visual": "疗养院档案室，女主打开落满灰尘的门禁记录。",
        "characterAction": "女主手指停在日期上，眼神骤冷。",
        "cameraMovement": "从门禁记录特写慢慢推到女主眼睛。",
        "lighting": "冷白顶灯闪烁，纸面反光。",
        "dialogueOrSubtitle": "这一天，他也在这里。",
        "audioCue": "低频心跳声，纸张翻动声。",
        "aiPromptZh": "9:16竖屏，现代都市悬疑，疗养院档案室...",
        "aiPromptEn": "vertical 9:16, modern urban suspense..."
      }
    ],
    "editingNotes": ["前3秒必须出现门禁记录日期", "结尾停在女主名字特写"]
  }
}
```

### 8.3 AI 漫剧字段

```json
{
  "aiManhuaDrama": {
    "panelCount": 12,
    "scriptText": "完整漫剧剧情正文，包含旁白框、对白气泡和转场说明。",
    "panels": [
      {
        "panelNumber": 1,
        "composition": "竖屏上半格，疗养院档案室大门半开。",
        "characterPose": "女主站在门口，手握旧钥匙。",
        "expression": "警惕、压抑、克制。",
        "dialogueBubble": "",
        "narrationBox": "她终于找到了母亲失踪那晚的档案室。",
        "sfx": "吱呀",
        "aiPromptZh": "竖屏国漫分镜，现代悬疑，疗养院档案室门口...",
        "aiPromptEn": "vertical manhua panel, modern suspense..."
      }
    ],
    "layoutNotes": ["第1-3格制造空间压迫", "第12格保留大面积黑底用于悬念字幕"]
  }
}
```

## 9. `scripts-data/{slug}.json` 如何承接后续剧集

当前 `scripts-data` 可以继续扩展 `episodes` 数组。

第 4 集以后示例：

```json
{
  "episodeNumber": 4,
  "title": "疗养院门禁记录",
  "hook": "女主发现母亲失踪当天，男主也出现在疗养院门口。",
  "summary": "苏清妤潜入顾氏疗养院旧档案室，发现母亲失踪当晚的门禁记录被人为删改。顾宴臣赶来阻止她，却暴露自己当晚也在现场。",
  "endingHook": "门禁记录最后一行，出现了苏清妤自己的名字。",
  "aiPromptZh": "9:16竖屏，现代都市悬疑，疗养院旧档案室，冷白顶灯闪烁，清冷亚洲女性翻看门禁记录，冷峻亚洲男性站在门口阴影里，高反差电影光影。",
  "aiPromptEn": "vertical 9:16, modern urban suspense, old sanitarium archive room, flickering cold white ceiling light, cold Asian female investigator reading access logs, severe Asian male standing in the doorway shadow, high-contrast cinematic lighting",
  "isFreePreview": false,
  "status": "published"
}
```

注意：

- `summary` 是入库摘要，不是完整正文。
- 完整正文和完整分镜仍在 `content-source/{slug}/episodes/episode-004.json`。
- `aiPromptZh` / `aiPromptEn` 是本集核心提示词，不是所有镜头提示词。
- `status = published` 表示可用于后台交付，不代表免费公开。
- `isFreePreview = false` 表示不是免费包内容。

## 10. 后续剧集导入命令

当前仍可复用已有导入脚本：

```powershell
node scripts/import-script-data.js scripts-data/{slug}.json
```

导入后会 upsert：

- `Script`
- `ScriptAsset`
- `ScriptEpisode`
- `ContinuationOption`

如果 `scripts-data/{slug}.json` 中包含第 4-60 集摘要，那么这些集也会进入 `ScriptEpisode`。

但正式交付用户时，应继续通过 `Delivery` / `DeliveryAsset` 控制权限，而不是让用户直接访问 `ScriptEpisode` 数据。

## 11. 后续剧集交付文件生成

现有脚本：

```text
scripts/generate-docx-deliveries.js
```

可以生成：

### 按集购买

```powershell
node scripts/generate-docx-deliveries.js --type pay_per_episode --slug lie-scent --episodes 4,5,6
```

输出：

```text
downloads/lie-scent/deliveries/episodes-4-6-package-v1.docx
```

### 一次性买断

```powershell
node scripts/generate-docx-deliveries.js --type buyout --slug lie-scent
```

输出：

```text
downloads/lie-scent/deliveries/buyout-full-package-v1.docx
```

### 版权分成

```powershell
node scripts/generate-docx-deliveries.js --type revenue_share --slug lie-scent --episode-start 4 --episode-end 10
```

输出：

```text
downloads/lie-scent/deliveries/revenue-share-episodes-4-10-package-v1.docx
```

重要限制：

如果对应集数没有录入 `scripts-data` / `ScriptEpisode`，脚本会在交付包里显示“待补齐”。所以正式交付前，必须先完成后续剧集录入。

## 12. AI 短剧与 AI 漫剧交付包差异

### AI 短剧交付包应包含

- 单集标题。
- 开场钩子。
- 完整剧情正文。
- 分镜表。
- 中文视频提示词。
- 英文视频提示词。
- 角色视觉锚点。
- 剪辑建议。
- 配音和字幕节奏。
- 平台发布建议。

### AI 漫剧交付包应包含

- 单集标题。
- 开场钩子。
- 完整剧情正文。
- 漫画分格表。
- 每格画面提示词。
- 对话气泡 / 旁白框文本。
- 角色设定图提示词。
- 画面比例、留白和排版建议。
- 轻动效建议。
- 配音和字幕节奏。

### 不建议混用

不要把 AI 短剧的镜头运动字段直接套到 AI 漫剧，也不要把 AI 漫剧的分格描述直接当成视频提示词。

同一个故事可以生成两个版本：

```text
AI短剧版：镜头语言优先
AI漫剧版：分格构图优先
```

但两个版本应该分开生成、分开标记、分开交付。

## 13. 参考图生成任务如何处理

参考图不建议直接作为数据库必填项。

推荐做成任务清单：

```text
content-source/{slug}/image-tasks/storyboard-reference-tasks.json
```

示例：

```json
{
  "slug": "lie-scent",
  "mode": "ai_short_drama",
  "tasks": [
    {
      "id": "lie-scent-ep004-shot001",
      "episodeNumber": 4,
      "assetType": "storyboard_reference",
      "promptZh": "9:16竖屏，疗养院档案室...",
      "promptEn": "vertical 9:16, old sanitarium archive room...",
      "outputPath": "public/site/assets/storyboards/lie-scent/episode-004-shot-001.png",
      "status": "planned"
    }
  ]
}
```

数据库只需要在资源真正可用时记录：

- 封面图路径：`Script.coverImage`
- 用户可下载资源：`ScriptAsset` 或 `DeliveryAsset`

参考图、分镜图、角色图可以先作为文件和任务管理，不必全部入库。

## 14. 推荐新增自动化脚本

后续可以分阶段新增脚本。

### 14.1 `build-episode-source.js`

输入：

```text
drafts/{slug}/raw-script.md
```

输出：

```text
content-source/{slug}/master.json
content-source/{slug}/episodes/episode-001.json
...
```

作用：

- 从剧本文本拆出全集结构。
- 区分前三集和第 4 集以后。
- 根据模式生成 AI 短剧或 AI 漫剧生产稿。

### 14.2 `build-script-data-from-source.js`

输入：

```text
content-source/{slug}/master.json
content-source/{slug}/episodes/*.json
```

输出：

```text
scripts-data/{slug}.json
```

作用：

- 把完整内容源压缩成数据库需要的摘要索引。
- 生成 `script`、`episodes`、`assets`、`continuationOptions`。

### 14.3 `build-delivery-docx-from-source.js`

输入：

```text
content-source/{slug}/episodes/*.json
```

输出：

```text
downloads/{slug}/deliveries/*.docx
```

作用：

- 使用完整内容源生成更丰富的用户交付包。
- 逐步替代当前只读取 `scripts-data` 摘要的交付脚本。

## 15. 当前阶段的落地顺序

不要马上做一键生成。

建议顺序：

1. 先确定 AI 短剧和 AI 漫剧的内容源字段。
2. 新增一套 `content-source/{slug}/episodes/episode-004.json` 样例。
3. 把第 4-6 集摘要补进 `scripts-data/{slug}.json`。
4. 执行 `import-script-data.js` 导入第 4-6 集索引。
5. 执行 `generate-docx-deliveries.js` 生成第 4-6 集交付包。
6. 检查用户中心交付是否能拿到正确文件。
7. 再考虑做自动化生成脚本。

## 16. 判断标准

一套后续剧集内容可以交付前，必须满足：

- 第 4 集以后至少有一批内容源文件。
- `scripts-data/{slug}.json` 中有对应集数索引。
- `ScriptEpisode.isFreePreview = false`。
- 对应 DOCX 交付包已生成。
- `DeliveryAsset.filePath` 指向真实存在的文件。
- 交付说明写清楚授权范围。
- AI 短剧和 AI 漫剧没有混用字段。

## 17. 最终结论

剧本自动化不是一个脚本，而是一条内容资产流水线。

最清晰的分法是：

```text
剧本母版
-> AI短剧 / AI漫剧生产稿
-> 数据库摘要索引
-> 用户 DOCX 交付包
-> 订单 / 分成 / 权限控制
```

数据库保存“可管理的信息”，文件保存“可交付的完整内容”。

这条边界确定后，一键生成脚本才不会把完整剧本、前三集免费包、付费剧集、商业模板、参考图任务和数据库字段搅在一起。
