# 剧本数据导入规范

## 1. 文档目标

这份文档用于规范每一套短剧剧本如何从本地生产文件进入数据库。

当前后端已经具备：

- `Script` 剧本主表
- `ScriptAsset` 剧本资源表
- `ScriptEpisode` 剧集表
- `ContinuationOption` 续作方式表
- `Download` 下载记录表

接下来如果要批量生成可投入使用的剧本，必须先统一入库标准。否则每套剧本的字段、文件名、封面、前三集、下载包和授权信息都会分散在不同文件里，后续维护成本会越来越高。

## 2. 核心原则

### 原则一：一套剧本一个稳定 slug

`slug` 是剧本在系统里的核心标识。

示例：

```text
lie-scent
last-cloud-city
live-revenge
love-algorithm
```

要求：

- 只能使用小写英文、数字和短横线。
- 一旦上架，不随意修改。
- 文件名、下载包、封面、详情页路由、数据库记录都围绕这个 slug 组织。

### 原则二：数据库只放结构化业务字段

数据库不应该塞入完整剧本文档全文。

数据库保存：

- 展示和筛选需要的字段。
- 前三集摘要和钩子。
- 文件资源路径。
- 续作方式。
- 下载记录。

完整剧本文档、分镜正文、提示词正文、授权说明等仍作为文件资源保存。

### 原则三：每套剧本必须先有免费前三集验证包

当前商业模型以“免费前三集验证”为入口，所以一套剧本进入可售卖状态前，至少要有：

- 剧本主信息
- 前三集摘要
- 免费包资源
- 授权边界
- 续作方式

否则只能是 `draft`，不能标记为 `published`。

## 3. 入库阶段划分

### draft 草稿

适合：

- 剧本刚生成。
- 字段还没补全。
- 免费包还没整理。
- 封面和分镜图还没配置。

可进入数据库，但不在剧本库公开展示。

### ready 待上架

适合：

- 主要字段已补齐。
- 前三集摘要已完成。
- 免费包文件已生成。
- 续作方式已配置。

当前 Prisma 模型还没有 `ready` 枚举约束，可以先继续用 `draft`，在导入数据里增加备注字段或导入脚本层判断。

### published 已上架

适合：

- 可以在 `scripts.html` 剧本库展示。
- 可以进入详情页。
- 可以下载免费前三集验证包。

要求：

- `Script.status = published`
- 免费包 `ScriptAsset.status = published`
- 免费包 `ScriptAsset.isPublic = true`
- 至少 3 条 `ScriptEpisode.isFreePreview = true`

### archived 已归档

适合：

- 下架旧版本。
- 停止对外展示。
- 保留历史下载和订单记录。

归档剧本不应该从数据库删除。

## 4. 文件组织规范

建议后续将文件按 slug 组织，而不是全部堆在根目录。

### MVP 阶段

当前仍可保持：

```text
downloads/free-preview-lie-scent-v1.md
assets/cover-lie-scent.png
assets/storyboards/frame-01.png
```

但新增剧本建议开始使用分目录：

```text
downloads/{slug}/free-preview-{slug}-v1.md
downloads/{slug}/usage-guide-{slug}-v1.md
downloads/{slug}/license-summary-{slug}-v1.md
assets/covers/cover-{slug}.png
assets/storyboards/{slug}/frame-01.png
```

### 推荐最终结构

```text
scripts-data/
  lie-scent.json
  last-cloud-city.json
  live-revenge.json
  love-algorithm.json

downloads/
  lie-scent/
    free-preview-lie-scent-v1.md
    usage-guide-lie-scent-v1.md
    license-summary-lie-scent-v1.md
  last-cloud-city/
    free-preview-last-cloud-city-v1.md

assets/
  covers/
    cover-lie-scent.png
    cover-last-cloud-city.png
  storyboards/
    lie-scent/
      frame-01.png
      frame-02.png
```

## 5. 文件命名规范

### 免费包

```text
free-preview-{slug}-v1.md
free-preview-{slug}-v1.pdf
free-preview-{slug}-v1.zip
```

示例：

```text
free-preview-lie-scent-v1.md
free-preview-last-cloud-city-v1.md
```

### 完整剧本包

```text
full-script-{slug}-v1.zip
```

### 使用说明

```text
usage-guide-{slug}-v1.md
```

### 授权摘要

```text
license-summary-{slug}-v1.md
```

### 封面图

```text
cover-{slug}.png
```

### 分镜图

```text
frame-01.png
frame-02.png
frame-03.png
```

分镜图编号必须补零，避免排序混乱。

## 6. 剧本主信息字段

每套剧本必须提供以下字段。

| 字段 | 必填 | 入库位置 | 说明 |
| --- | --- | --- | --- |
| `slug` | 是 | `Script.slug` | 稳定 URL 标识 |
| `title` | 是 | `Script.title` | 中文标题 |
| `titleEn` | 否 | `Script.titleEn` | 英文标题 |
| `logline` | 是 | `Script.logline` | 一句话爆点 |
| `synopsis` | 是 | `Script.synopsis` | 剧情简介 |
| `category` | 是 | `Script.category` | 主类型 |
| `coverImage` | 否 | `Script.coverImage` | 封面路径 |
| `status` | 是 | `Script.status` | draft / published / archived |
| `featured` | 是 | `Script.featured` | 是否主推 |
| `recommendedPlatforms` | 是 | `Script.recommendedPlatforms` | JSON 字符串数组 |
| `audienceTags` | 是 | `Script.audienceTags` | JSON 字符串数组 |
| `productionDifficulty` | 否 | `Script.productionDifficulty` | low / medium / high |
| `episodeCount` | 否 | `Script.episodeCount` | 预计总集数 |
| `freeEpisodeCount` | 是 | `Script.freeEpisodeCount` | 当前默认 3 |

## 7. 剧集字段

第一版只要求前三集入库。

每一集必须提供：

| 字段 | 必填 | 入库位置 | 说明 |
| --- | --- | --- | --- |
| `episodeNumber` | 是 | `ScriptEpisode.episodeNumber` | 第几集 |
| `title` | 是 | `ScriptEpisode.title` | 单集标题 |
| `hook` | 是 | `ScriptEpisode.hook` | 单集开场钩子 |
| `summary` | 是 | `ScriptEpisode.summary` | 单集摘要 |
| `endingHook` | 是 | `ScriptEpisode.endingHook` | 结尾悬念 |
| `aiPromptZh` | 是 | `ScriptEpisode.aiPromptZh` | 中文 AI 画面提示词 |
| `aiPromptEn` | 是 | `ScriptEpisode.aiPromptEn` | 英文 AI 画面提示词 |
| `isFreePreview` | 是 | `ScriptEpisode.isFreePreview` | 前三集为 true |
| `status` | 是 | `ScriptEpisode.status` | draft / published |

### 前三集质量要求

每一集摘要不要只是剧情简介，要能回答：

- 这一集开场靠什么抓人？
- 这一集核心冲突是什么？
- 这一集结尾为什么让用户想看下一集？
- 这一集是否适合 45-75 秒竖屏表达？
- 这一集是否同时提供中文提示词和英文提示词？

## 8. 资源字段

每套上架剧本至少需要一个 `free_preview` 资源。

| 字段 | 必填 | 入库位置 | 说明 |
| --- | --- | --- | --- |
| `id` | 建议 | `ScriptAsset.id` | 稳定资源 ID |
| `assetType` | 是 | `ScriptAsset.assetType` | free_preview / full_script / usage_guide / license |
| `title` | 是 | `ScriptAsset.title` | 文件展示标题 |
| `version` | 是 | `ScriptAsset.version` | v1.0 / v1.1 |
| `filePath` | 是 | `ScriptAsset.filePath` | 本地路径或对象存储路径 |
| `fileFormat` | 是 | `ScriptAsset.fileFormat` | md / pdf / zip / json |
| `fileSize` | 否 | `ScriptAsset.fileSize` | 文件大小，单位 byte |
| `isPublic` | 是 | `ScriptAsset.isPublic` | 免费包 true |
| `status` | 是 | `ScriptAsset.status` | draft / published / archived |

### 资源 ID 规范

```text
asset_{slug_key}_{asset_type}_v1
```

因为数据库 ID 不建议出现短横线，所以资源 ID 里的 slug 可把 `-` 替换成 `_`。

示例：

```text
asset_lie_scent_free_v1
asset_last_cloud_city_free_v1
asset_live_revenge_free_v1
```

## 9. 续作方式字段

每套上架剧本默认配置三种续作方式。

### buyout 一次性买断

```json
{
  "type": "buyout",
  "title": "一次性买断",
  "description": "一次性获得后续完整剧集和对应授权，适合已经验证数据、准备连续投放的团队。",
  "startingPrice": 1999,
  "enabled": true,
  "sortOrder": 1
}
```

### pay_per_episode 按集付费

```json
{
  "type": "pay_per_episode",
  "title": "按集付费",
  "description": "根据验证结果分批购买后续剧集，适合想控制风险、边测边做的账号团队。",
  "startingPrice": 99,
  "enabled": true,
  "sortOrder": 2
}
```

### revenue_share 版权分成

```json
{
  "type": "revenue_share",
  "title": "版权分成",
  "description": "无需先购买后续剧集，经审核后可继续制作，并按视频收益约定比例分成。",
  "startingPrice": null,
  "enabled": true,
  "sortOrder": 3
}
```

价格可以按剧本价值调整，但类型命名不要变。

## 10. 标准导入 JSON 结构

后续建议每套剧本先整理成一份标准 JSON，再由导入脚本写入数据库。

文件路径建议：

```text
scripts-data/{slug}.json
```

结构如下：

```json
{
  "script": {
    "slug": "lie-scent",
    "title": "她闻到谎言",
    "titleEn": "She Smells Lies",
    "logline": "能闻到谎言气味的危机公关女王，被一桩豪门前妻死亡案拖入旧案迷雾。",
    "synopsis": "苏清妤是业内最冷静的危机公关顾问，也是一个拥有秘密能力的人：她能闻到谎言的气味。",
    "category": "现代都市商业悬疑情感反转短剧",
    "coverImage": "assets/covers/cover-lie-scent.png",
    "status": "published",
    "featured": true,
    "recommendedPlatforms": ["抖音", "快手", "小红书", "TikTok"],
    "audienceTags": ["女性向", "都市悬疑", "豪门旧案"],
    "productionDifficulty": "medium",
    "episodeCount": 60,
    "freeEpisodeCount": 3
  },
  "episodes": [
    {
      "episodeNumber": 1,
      "title": "雨夜委托",
      "hook": "女主闻到男主身上与母亲失踪案相同的消毒水味。",
      "summary": "危机公关顾问苏清妤在雨夜接到顾氏集团继承人顾宴臣的天价委托。",
      "endingHook": "她按下录音笔，低声说：顾宴臣，你最好真的没有撒谎。",
      "aiPromptZh": "9:16竖屏，深夜危机公关公司会议室，雨夜城市霓虹，清冷亚洲女性合上文件，电影感悬疑，高反差光影。",
      "aiPromptEn": "vertical 9:16, late-night crisis PR agency conference room, rainy city neon, cold Asian female strategist closing a file, cinematic suspense, high-contrast lighting",
      "isFreePreview": true,
      "status": "published"
    }
  ],
  "assets": [
    {
      "id": "asset_lie_scent_free_v1",
      "assetType": "free_preview",
      "title": "《她闻到谎言》前三集免费验证包",
      "version": "v1.0",
      "filePath": "downloads/lie-scent/free-preview-lie-scent-v1.md",
      "fileFormat": "md",
      "isPublic": true,
      "status": "published"
    }
  ],
  "continuationOptions": [
    {
      "type": "buyout",
      "title": "一次性买断",
      "description": "一次性获得后续完整剧集和对应授权。",
      "startingPrice": 1999,
      "enabled": true,
      "sortOrder": 1
    }
  ]
}
```

## 11. 从现有 product-template 映射

当前已有的 `*.product-template.json` 可以作为数据来源，但不能直接当作最终入库格式。

### 推荐映射关系

| 来源字段 | 目标字段 |
| --- | --- |
| `product_metadata.title.zh` | `script.title` |
| `product_metadata.title.en` | `script.titleEn` |
| `product_metadata.logline.zh` | `script.logline` |
| `product_metadata.category.zh` | `script.category` |
| `product_metadata.recommended_platforms` | `script.recommendedPlatforms` |
| `story_package.synopsis` | `script.synopsis` |
| `story_package.genre_tags` | `script.audienceTags` 的一部分 |
| `story_package.first_three_episode_hooks` | `episodes[].hook` 的来源之一 |
| `story_package.episode_count_recommendation.overseas_vertical` | `script.episodeCount` 的参考 |

### 需要人工补充的字段

现有模板通常还需要补：

- `slug`
- `coverImage`
- 每集 `title`
- 每集 `summary`
- 每集 `endingHook`
- 免费包 `filePath`
- 免费包 `version`
- `productionDifficulty`
- 续作价格

## 12. 导入脚本要求

下一步建议写：

```text
scripts/import-script-data.js
```

建议支持：

```powershell
node scripts/import-script-data.js scripts-data/lie-scent.json
node scripts/import-script-data.js scripts-data/*.json
```

### 导入脚本必须做的校验

- `slug` 不能为空。
- `slug` 格式必须是小写英文、数字、短横线。
- `title`、`logline`、`synopsis`、`category` 不能为空。
- `published` 状态下必须有至少 3 集免费预览。
- `published` 状态下每一集免费预览都必须有 `aiPromptZh` 和 `aiPromptEn`。
- `published` 状态下必须有公开的 `free_preview` 资源。
- `recommendedPlatforms` 必须是数组。
- `audienceTags` 必须是数组。
- `continuationOptions` 必须至少包含一种可用方式。
- `filePath` 对应的本地文件必须存在，除非资源状态是 `draft`。

### 导入方式

导入脚本应使用 upsert。

这样重复执行不会产生重复数据：

- `Script` 按 `slug` upsert。
- `ScriptAsset` 按 `id` upsert。
- `ScriptEpisode` 按 `scriptId + episodeNumber` upsert。
- `ContinuationOption` 按 `scriptId + type` upsert。

## 13. 上架验收标准

一套剧本进入 `published` 前，必须通过以下检查：

1. 剧本库能显示卡片。
2. 卡片标题、标签、logline 不溢出。
3. 详情页能打开，或至少有可进入的详情路由规划。
4. 免费包文件可以下载。
5. 下载前能显示授权确认。
6. 下载后 `Download` 表能写入记录。
7. 数据库中有 3 条免费预览剧集。
8. 至少有 1 个公开 `free_preview` 资源。
9. 三种续作方式至少开启一种。
10. 文件名、slug、资源 ID 和数据库记录一致。

## 14. 当前四套剧本的建议 slug

| 剧本 | slug | 当前状态建议 |
| --- | --- | --- |
| 她闻到谎言 | `lie-scent` | published |
| 最后一座云端城 | `last-cloud-city` | draft，补免费包后 published |
| 第99次直播复仇 | `live-revenge` | draft，补免费包后 published |
| 恋爱算法失控中 | `love-algorithm` | draft，补免费包后 published |

## 15. 下一步执行建议

下一步不要直接手改 `seed.js` 继续塞数据。

更好的顺序是：

1. 新建 `scripts-data/lie-scent.json`，把当前 seed 数据迁移为标准导入 JSON。
2. 新建 `scripts/import-script-data.js`。
3. 用导入脚本重新导入 `lie-scent.json`，确认不会破坏现有页面。
4. 按同样结构整理另外三套剧本的 `scripts-data/*.json`。
5. 批量导入后，让剧本库从 1 套扩展到 4 套。

这样系统会从“手写种子数据”升级成“可持续批量上架剧本”的工作流。
