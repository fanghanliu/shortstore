# 动态剧本详情页改造规划

## 1. 文档目标

当前项目已经具备 4 套已上架剧本，并且剧本库可以从数据库读取列表。下一步需要把剧本详情页也彻底标准化，避免每套剧本都手写一个独立 HTML。

本规划的目标是：

```text
所有剧本统一走数据库驱动的动态详情页
```

这样后续新增剧本时，只需要维护：

- `scripts-data/{slug}.json`
- 免费验证包 Markdown
- 封面和分镜图资源

而不需要再手写一套新的详情页代码。

## 2. 当前状态

### 已完成

| 模块 | 状态 |
| --- | --- |
| 剧本库 | `scripts.html` 已从 `GET /api/scripts` 读取 |
| 剧本数据 | 4 套剧本已进入数据库 |
| 免费包 | 4 套剧本均有前三集免费验证包 |
| 下载记录 | 下载前调用 `POST /api/downloads` |
| 双语提示词 | `aiPromptZh` / `aiPromptEn` 已进入数据结构和导入校验 |
| 通用详情页 | 已有 `script-preview.html?slug=...` |

### 当前问题

| 问题 | 说明 |
| --- | --- |
| 详情页体验不统一 | 《她闻到谎言》使用 `script-lie-scent.html`，其他剧本使用 `script-preview.html` |
| 通用详情页信息不够完整 | 当前只展示标题、logline、简介、前三集和下载入口 |
| 续作方式展示不足 | API 已返回 `continuationOptions`，但通用页还没有完整展示 |
| 视觉资产展示不足 | 通用页没有展示封面、分镜样片、视觉锚点 |
| 下载包信息不够明确 | 只展示版本和格式，缺少文件清单、授权边界、使用说明 |
| 路由不够正式 | `script-preview.html?slug=last-cloud-city` 可用，但不像正式站点路径 |

## 3. 改造原则

### 原则一：详情页只从 API 取数据

详情页不再硬编码单套剧本内容。

页面应该通过：

```text
GET /api/scripts/:slug
```

读取：

- 剧本主信息
- 标签
- 推荐平台
- 前三集摘要
- 双语 AI 提示词
- 免费包资源
- 续作方式

### 原则二：HTML 负责结构，JS 负责渲染

`script-preview.html` 应作为模板页，只保留通用容器。

`script-preview.js` 负责：

- 读取 slug
- 请求 API
- 渲染模块
- 绑定下载按钮
- 处理加载失败状态

### 原则三：新增剧本不新增 HTML

未来上架新剧本时，不允许再新增：

```text
script-{slug}.html
```

除非该剧本是需要特殊营销页的重点项目。

标准流程应该是：

```text
新增 scripts-data/{slug}.json
新增 downloads/{slug}/free-preview-{slug}-v1.md
导入数据库
剧本库自动出现
详情页自动可访问
```

## 4. 目标详情页结构

动态详情页建议分为以下模块。

### 4.1 Hero 模块

展示：

- 剧本标题
- 英文标题
- 一句话爆点
- 主类型
- 推荐平台
- 免费包状态
- 下载 CTA
- 返回剧本库入口

数据来源：

| 页面字段 | API 字段 |
| --- | --- |
| 标题 | `title` |
| 英文标题 | `titleEn` |
| 一句话爆点 | `logline` |
| 类型 | `category` |
| 平台标签 | `recommendedPlatforms` |
| 免费集数 | `freeEpisodeCount` |

### 4.2 剧本概览模块

展示：

- 剧情简介
- 受众标签
- 制作难度
- 预计完整集数
- 适合平台
- 适合账号方向

数据来源：

| 页面字段 | API 字段 |
| --- | --- |
| 剧情简介 | `synopsis` |
| 受众标签 | `audienceTags` |
| 制作难度 | `productionDifficulty` |
| 预计集数 | `episodeCount` |
| 推荐平台 | `recommendedPlatforms` |

### 4.3 前三集验证模块

每集展示：

- 集数
- 标题
- 核心钩子
- 剧情摘要
- 结尾悬念
- 中文 AI 提示词
- 英文 AI 提示词

数据来源：

```text
episodes[]
```

要求：

- 只展示 `isFreePreview = true` 的集数。
- 默认展示前三集。
- 中文提示词和英文提示词必须同时存在。
- 页面上要明确区分 `中文提示词` 和 `English prompt`。

### 4.4 免费包下载模块

展示：

- 免费包标题
- 版本号
- 文件格式
- 文件清单
- 授权边界提示
- 下载按钮

数据来源：

```text
assets[]
```

过滤规则：

```text
assetType = free_preview
isPublic = true
status = published
```

下载流程：

1. 用户点击下载。
2. 弹出授权确认。
3. 用户勾选确认。
4. 前端调用 `POST /api/downloads`。
5. 后端写入下载记录。
6. 前端触发文件下载。

### 4.5 续作方式模块

展示三种方式：

- 一次性买断
- 按集付费
- 版权分成

数据来源：

```text
continuationOptions[]
```

展示字段：

- `title`
- `description`
- `startingPrice`
- `type`

页面文案要继续强调：

```text
先用前三集验证，再决定后续方式。
```

### 4.6 授权说明模块

展示固定规则：

- 免费包仅授权前三集测试。
- 不包含第4集及以后内容。
- 不构成完整版权转让。
- 不得转售、打包上传、拆分售卖或作为素材库分发。

后续可从数据库或独立配置文件读取，但第一版可以先保留固定文案。

### 4.7 状态与错误模块

需要处理：

- 加载中
- 剧本不存在
- 免费包未开放
- API 服务未启动
- 下载记录写入失败

当前 `script-preview.js` 只有简单失败提示，需要增强。

## 5. 路由设计

### 当前可用路由

```text
script-preview.html?slug=last-cloud-city
script-preview.html?slug=live-revenge
script-preview.html?slug=love-algorithm
```

### 第一版建议

继续保留查询参数路由：

```text
script-preview.html?slug={slug}
```

理由：

- 当前项目仍是静态 HTML + Express 静态服务。
- 改造成本低。
- 不影响 API 和数据库。

### 后续正式路由

等前端框架化或 Express 路由增强后，再升级为：

```text
/scripts/{slug}
```

例如：

```text
/scripts/lie-scent
/scripts/last-cloud-city
```

## 6. 《她闻到谎言》迁移策略

当前《她闻到谎言》有独立页面：

```text
script-lie-scent.html
```

它视觉更丰富，包含封面、分镜样片和更完整的展示结构。

### 不建议立刻删除

原因：

- 这个页面已经可用。
- 它可以作为动态详情页的设计参考。
- 直接删除可能影响现有链接。

### 建议迁移顺序

#### Step 1：通用页补齐能力

先让 `script-preview.html` 具备独立页的大部分能力：

- 封面或视觉图
- 分镜样片
- 前三集验证
- 双语提示词
- 下载模块
- 续作方式
- 授权说明

#### Step 2：让《她闻到谎言》也可走通用页

确保访问：

```text
script-preview.html?slug=lie-scent
```

体验不弱于当前独立页的核心功能。

#### Step 3：剧本库统一指向通用页

将 `script-library.js` 中：

```text
script-lie-scent.html
```

改为：

```text
script-preview.html?slug=lie-scent
```

#### Step 4：保留旧页跳转

`script-lie-scent.html` 可以暂时保留，后续改成跳转或下线。

## 7. API 需要补强的内容

当前 `GET /api/scripts/:slug` 已返回：

- 剧本主信息
- assets
- episodes
- continuationOptions

第一版够用。

后续可以补：

### 7.1 visualAssets

用于详情页展示封面、分镜图和视觉样片。

当前可以先从约定路径推导：

```text
assets/storyboards/{slug}/frame-01.png
```

但更稳定的方式是后续新增表或 JSON 字段：

```text
visualAssets: [
  {
    type: "storyboard_frame",
    url: "assets/storyboards/live-revenge/frame-01.png",
    title: "直播开播"
  }
]
```

### 7.2 licenseSummary

用于未来不同剧本有不同授权边界时扩展。

第一版先不做。

### 7.3 fileManifest

用于展示免费包里包含哪些文件。

第一版可在前端固定展示。

## 8. 前端改造范围

### 必改文件

```text
script-preview.html
script-preview.js
script-library.js
styles.css
```

### 暂不改文件

```text
script-lie-scent.html
```

等通用页体验稳定后再迁移。

## 9. Phase 1 实施任务

### 任务 1：增强通用详情页 Hero

目标：

- 显示标题、英文名、logline、标签、平台、集数。
- 根据 `coverImage` 或分镜图展示视觉预览。

验收：

- 四套剧本进入详情页后 Hero 不空。
- 移动端文字不溢出。

### 任务 2：增强前三集模块

目标：

- 每集卡片展示标题、钩子、摘要、结尾悬念。
- 双语 AI 提示词分开展示。

验收：

- 页面中能看到 `中文提示词` 和 `English prompt`。
- 四套剧本前三集都能渲染。

### 任务 3：增强下载模块

目标：

- 显示免费包名称、版本、格式、文件清单。
- 下载仍写入 `Download` 表。

验收：

- 四套剧本都能下载对应 Markdown。
- 下载记录里的 `scriptId` 和 `assetId` 正确。

### 任务 4：新增续作方式模块

目标：

- 渲染 `continuationOptions`。
- 展示买断、按集、分成说明。

验收：

- 四套剧本都显示 3 种续作方式。

### 任务 5：剧本库统一跳转

目标：

- 所有卡片统一跳转到 `script-preview.html?slug={slug}`。

验收：

- 剧本库 4 张卡片都无断链。

## 10. Phase 2 实施任务

### 任务 1：迁移《她闻到谎言》

目标：

- 通用页承载《她闻到谎言》的核心体验。
- 独立页不再作为主入口。

### 任务 2：规范视觉资产

目标：

统一：

```text
assets/covers/cover-{slug}.png
assets/storyboards/{slug}/frame-01.png
```

### 任务 3：补详情页 SEO 信息

目标：

- 动态更新 `document.title`
- 补充 `meta description`
- 后续框架化时迁移到服务端渲染

## 11. 风险点

### 风险一：通用页过于模板化

如果所有剧本详情页完全一样，可能缺少主推剧本的销售张力。

解决：

- 通用页负责标准体验。
- 主推剧本后续可加 `featured` 专属模块。

### 风险二：提示词展示过长

中英双语提示词会让卡片高度变长。

解决：

- 使用折叠区域。
- 默认展示中文，英文可展开。
- 或每集卡片内分成两栏。

### 风险三：下载包和详情数据不一致

数据库里的前三集摘要和 Markdown 里的正文可能出现不一致。

解决：

- 以 `scripts-data/*.json` 为结构化展示源。
- 以 Markdown 为交付文件。
- 导入脚本只校验关键字段，不强行同步全文。

## 12. 第一版验收标准

动态详情页第一版完成后，必须满足：

1. 剧本库 4 套剧本都能进入详情页。
2. 每个详情页都来自 `GET /api/scripts/:slug`。
3. 每个详情页都展示前三集。
4. 每集都展示中文提示词和英文提示词。
5. 每个详情页都能下载正确的免费包。
6. 下载后 `Download` 表新增记录。
7. 每个详情页都展示续作方式。
8. 原有《她闻到谎言》下载链路不被破坏。

## 13. 下一步建议

下一步进入代码阶段，先做 Phase 1：

```text
增强 script-preview.html + script-preview.js
```

优先完成：

1. 详情页展示更完整。
2. 双语提示词展示更专业。
3. 续作方式从 API 渲染。
4. 剧本库全部跳转到通用页。

等通用详情页体验稳定后，再把《她闻到谎言》的独立页迁移或保留为主推专题页。
