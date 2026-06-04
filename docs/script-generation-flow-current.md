# 当前剧本生成与上架流程梳理

## 1. 这份文档解决什么问题

你记忆中的流程大致是：

1. 先提供一个剧本创意或完整剧本。
2. 生成对应的故事板 JSON。
3. 执行脚本生成中英文提示词和商业模板。
4. 再整理成可上架、可下载、可续作转化的数据。

当前项目里确实存在这条链路，但它分成了两套体系：

- 旧生成体系：`storyboard.json -> product-template.json`
- 新上架体系：`scripts-data/*.json -> 数据库 -> API -> 页面`

如果后续要做“自动化生成剧本”，应该把这两套体系打通。

## 2. 当前核心文件

### 2.1 故事板 JSON

示例文件：

```text
她闻到谎言.storyboard.json
last_cloud_city_storyboard.json
live_revenge_storyboard.json
love_algorithm_storyboard.json
```

作用：

- 保存完整分镜故事板。
- 每个场景包含中文和英文环境、角色动作、镜头、音效。
- 是生成中英文 AI 画面提示词和商业模板的主要输入。

核心结构：

```json
{
  "global_metadata": {
    "video_type": { "zh": "...", "en": "..." },
    "recommended_aspect_ratio": "9:16 ...",
    "target_platforms": ["抖音", "TikTok", "Sora"],
    "visual_style_tags": ["..."],
    "estimated_total_duration": "36-72分钟"
  },
  "scenes": [
    {
      "scene_id": "001",
      "estimated_scene_duration": "6s",
      "environment": {
        "location": { "zh": "...", "en": "..." },
        "lighting": { "zh": "...", "en": "..." }
      },
      "characters": [
        {
          "name": "角色名",
          "visual_anchor": { "zh": "...", "en": "..." },
          "action": { "zh": "...", "en": "..." }
        }
      ],
      "camera_movement": { "zh": "...", "en": "..." },
      "audio_cue": { "zh": "...", "en": "..." }
    }
  ]
}
```

### 2.2 商业模板 JSON

示例文件：

```text
她闻到谎言.product-template.json
last_cloud_city.product-template.json
live_revenge.product-template.json
love_algorithm.product-template.json
```

作用：

- 把故事板包装成可销售的“AI短剧故事板生产包”。
- 包含销售页文案、人物设定、分集大纲、中英文提示词库、交付清单、授权和价格建议。
- 这是旧模式下的商品模板，不是当前数据库直接入库格式。

核心结构：

```json
{
  "schema_version": "1.0.0",
  "product_type": "AI短剧故事板生产包",
  "product_metadata": {},
  "sales_page": {},
  "story_package": {},
  "characters": [],
  "episode_outline": [],
  "production_package": {},
  "prompt_library": {},
  "visual_samples": {},
  "pricing_and_license": {},
  "delivery": {},
  "source_storyboard_summary": {},
  "scenes": []
}
```

### 2.3 标准上架 JSON

示例文件：

```text
scripts-data/lie-scent.json
scripts-data/last-cloud-city.json
scripts-data/live-revenge.json
scripts-data/love-algorithm.json
```

作用：

- 当前数据库导入脚本使用的标准格式。
- 只保存页面展示、前三集免费验证、下载包和续作方式所需字段。
- 这是现在网站上架剧本的主格式。

核心结构：

```json
{
  "script": {},
  "episodes": [],
  "assets": [],
  "continuationOptions": []
}
```

## 3. 当前用到的脚本

### 3.1 `store.js`

位置：

```text
store.js
```

作用：

- 早期用于硬编码生成部分故事板 JSON。
- 目前里面有两个生成器：
  - `buildLiveRevengeStoryboard`
  - `buildLoveAlgorithmStoryboard`
- 可以生成：
  - `live_revenge_storyboard.json`
  - `love_algorithm_storyboard.json`

命令示例：

```powershell
node store.js live_revenge live_revenge_storyboard.json
node store.js love_algorithm love_algorithm_storyboard.json
```

返回结果：

- 输出一个 `*_storyboard.json` 文件。
- 控制台输出类似：

```text
Wrote live_revenge_storyboard.json
```

注意：

- 这个脚本不是通用剧本生成器。
- 它只支持已经写死在代码里的 profile。
- 如果你给我一个新剧本，当前不能靠它自动生成新故事板，除非先把新剧本写成同样的生成函数。

### 3.2 `build-product-template.js`

位置：

```text
build-product-template.js
```

作用：

- 读取 `*.storyboard.json`。
- 根据内置 `productProfiles` 补充商品资料。
- 生成 `*.product-template.json`。
- 自动生成中英文场景提示词样例和提示词库。

命令示例：

```powershell
node build-product-template.js 她闻到谎言.storyboard.json
node build-product-template.js live_revenge_storyboard.json
node build-product-template.js love_algorithm_storyboard.json
```

也可以指定输出文件：

```powershell
node build-product-template.js live_revenge_storyboard.json live_revenge.product-template.json
```

返回结果：

- 输出一个 `*.product-template.json` 文件。
- 控制台输出类似：

```text
Wrote live_revenge.product-template.json
```

输入：

- `storyboard.global_metadata`
- `storyboard.scenes`
- 文件名对应的内置 `productProfiles`

主要输出：

- `product_metadata`
- `sales_page`
- `story_package`
- `characters`
- `episode_outline`
- `production_package`
- `prompt_library`
- `visual_samples`
- `pricing_and_license`
- `delivery`
- `source_storyboard_summary`
- 原始 `scenes`

中英文提示词来自：

- `global_style_prompt_zh`
- `global_style_prompt_en`
- `character_consistency_prompts`
- `scene_prompt_samples`
- `negative_prompt`
- `platform_prompt_notes`

其中 `scene_prompt_samples` 是从前几个场景抽取：

- 中文：地点 + 光线 + 角色动作 + 镜头运动
- 英文：英文地点 + 英文光线 + 英文角色动作 + 英文镜头运动

### 3.3 `scripts/import-script-data.js`

位置：

```text
scripts/import-script-data.js
```

作用：

- 读取 `scripts-data/*.json`。
- 校验字段是否完整。
- 写入 SQLite / Prisma 数据库。
- 使用 upsert，重复执行不会重复创建剧本。

命令示例：

```powershell
node scripts/import-script-data.js scripts-data/lie-scent.json
node scripts/import-script-data.js scripts-data/*.json
```

也可以通过 npm script：

```powershell
npm run import:script -- scripts-data/lie-scent.json
npm run import:script -- scripts-data/*.json
```

返回结果：

```json
{
  "imported": [
    {
      "slug": "lie-scent",
      "title": "她闻到谎言",
      "assets": 1,
      "episodes": 3,
      "continuationOptions": 3
    }
  ]
}
```

会写入这些数据库表：

- `Script`
- `ScriptAsset`
- `ScriptEpisode`
- `ContinuationOption`

校验规则：

- `script.slug` 必填，且只能是小写英文、数字、短横线。
- `script.title`、`logline`、`synopsis`、`category` 必填。
- `recommendedPlatforms` 必须是数组。
- `audienceTags` 必须是数组。
- `published` 状态必须至少有 3 集免费预览。
- 免费预览集必须有 `aiPromptZh` 和 `aiPromptEn`。
- `published` 状态必须有公开的 `free_preview` 资源。
- `continuationOptions` 至少要有一种启用。
- 非 draft 资源的 `filePath` 必须存在。

### 3.4 其他辅助脚本

```text
scripts/check-text-encoding.js
```

作用：

- 检查文本文件是否出现乱码风险。

命令：

```powershell
npm run check:text
```

```text
scripts/smoke-api.js
```

作用：

- 启动服务器并跑一轮接口冒烟测试。
- 会测试剧本列表、详情页、免费包、下载、用户、后台、续作请求、订单和分成项目。

命令：

```powershell
npm run test:api
```

## 4. 当前完整人工流程

### Step 1：生成或整理故事板

目标文件：

```text
{name}_storyboard.json
```

目前有两种来源：

1. 手工或 AI 对话生成完整 `storyboard.json`。
2. 对已有硬编码剧本，执行 `store.js` 生成。

要求：

- 必须有 `global_metadata`。
- 必须有 `scenes`。
- 每个场景最好有中英双语字段。

### Step 2：生成商业模板

命令：

```powershell
node build-product-template.js {name}_storyboard.json {name}.product-template.json
```

输出：

```text
{name}.product-template.json
```

用途：

- 商品销售页文案。
- 中英文提示词库。
- 人物设定。
- 分集大纲。
- 交付清单。
- 商业授权和价格建议。

### Step 3：整理免费前三集验证包

参考模板：

```text
docs/free-package-template.md
docs/free-three-episodes-package.md
```

输出示例：

```text
downloads/free-preview-lie-scent-v1.md
downloads/{slug}/free-preview-{slug}-v1.md
```

用途：

- 给用户免费下载。
- 用户可直接用前三集制作视频验证。

### Step 4：整理标准上架数据

目标文件：

```text
scripts-data/{slug}.json
```

需要包含：

- `script`：剧本主信息。
- `episodes`：至少前三集，含中英文 AI 提示词。
- `assets`：免费预览包资源。
- `continuationOptions`：买断、按集付费、版权分成。

### Step 5：导入数据库

命令：

```powershell
node scripts/import-script-data.js scripts-data/{slug}.json
```

批量导入：

```powershell
node scripts/import-script-data.js scripts-data/*.json
```

### Step 6：服务器接口返回数据

启动：

```powershell
npm run dev
```

剧本列表接口：

```text
GET /api/scripts?status=published
```

返回：

```json
{
  "items": [
    {
      "id": "...",
      "slug": "lie-scent",
      "title": "她闻到谎言",
      "titleEn": "She Smells Lies",
      "logline": "...",
      "synopsis": "...",
      "category": "...",
      "coverImage": "assets/cover-lie-scent.png",
      "status": "published",
      "featured": true,
      "recommendedPlatforms": ["抖音", "TikTok"],
      "audienceTags": ["女性向", "都市悬疑"],
      "productionDifficulty": "medium",
      "episodeCount": 60,
      "freeEpisodeCount": 3
    }
  ],
  "total": 1
}
```

剧本详情接口：

```text
GET /api/scripts/{slug}
```

返回：

```json
{
  "id": "...",
  "slug": "lie-scent",
  "title": "她闻到谎言",
  "assets": [],
  "episodes": [],
  "continuationOptions": []
}
```

免费包接口：

```text
GET /api/scripts/{slug}/free-preview
```

返回：

```json
{
  "script": {},
  "asset": {
    "id": "asset_lie_scent_free_v1",
    "title": "《她闻到谎言》前三集免费验证包",
    "version": "v1.0",
    "filePath": "downloads/free-preview-lie-scent-v1.md",
    "fileFormat": "md",
    "fileSize": null
  }
}
```

下载记录接口：

```text
POST /api/downloads
```

请求：

```json
{
  "scriptSlug": "lie-scent",
  "assetId": "asset_lie_scent_free_v1",
  "visitorId": "visitor_xxx",
  "licenseConfirmed": true
}
```

返回：

```json
{
  "downloadId": "...",
  "downloadUrl": "/downloads/free-preview-lie-scent-v1.md"
}
```

## 5. 当前流程的关键缺口

现在还没有一个真正的“一键从用户提供剧本生成所有文件”的脚本。

当前缺口是：

1. 没有通用脚本把“用户给的剧本文本”变成 `storyboard.json`。
2. `build-product-template.js` 的商品资料依赖内置 `productProfiles`，新剧本会走默认模板，资料不够完整。
3. `product-template.json` 不能直接入库，还需要转成 `scripts-data/{slug}.json`。
4. 免费前三集验证包目前主要靠人工整理。
5. 分镜图片、封面图和完整下载包还没有统一自动生成链路。

## 6. 建议的自动化目标流程

后续可以把目标流程设计成：

```text
用户提供剧本 / 创意
  -> generate-storyboard.js
  -> {slug}_storyboard.json
  -> build-product-template.js
  -> {slug}.product-template.json
  -> build-free-preview.js
  -> downloads/{slug}/free-preview-{slug}-v1.md
  -> build-script-data.js
  -> scripts-data/{slug}.json
  -> import-script-data.js
  -> 数据库上架
```

自动化后理想命令：

```powershell
npm run generate:script -- --input drafts/new-script.md --slug new-script
```

最终应该自动产出：

- `storyboards/{slug}.storyboard.json`
- `products/{slug}.product-template.json`
- `downloads/{slug}/free-preview-{slug}-v1.md`
- `scripts-data/{slug}.json`
- 可选的封面图和分镜图任务清单
- 数据库导入结果

## 7. 当前最可靠的手动命令顺序

如果现在要按现有能力生产一套剧本，顺序是：

```powershell
# 1. 准备好 storyboard JSON
# 例如：new_script_storyboard.json

# 2. 生成商业模板
node build-product-template.js new_script_storyboard.json new_script.product-template.json

# 3. 按 docs/free-package-template.md 整理免费前三集包
# 输出到 downloads/{slug}/free-preview-{slug}-v1.md

# 4. 按 docs/script-data-import-standard.md 整理 scripts-data/{slug}.json

# 5. 导入数据库
node scripts/import-script-data.js scripts-data/{slug}.json

# 6. 跑接口测试
npm run test:api
```

这就是当前项目真实存在的生成、包装、导入和返回数据流程。
