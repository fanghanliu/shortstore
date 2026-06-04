# 后端与数据库 MVP 实施规划

## 1. 文档目标

这份文档用于承接前面的正式网站架构重置，把“接入后端和数据库”拆成可以执行的第一版 MVP。

当前阶段的重点不是一次性做完整平台，而是先让网站从静态文件驱动，升级为“数据库管理剧本 + API 提供数据 + 后端记录下载”的正式业务骨架。

第一版要解决三件事：

1. 剧本库和详情页的数据不再手写在 HTML 里。
2. 免费前三集下载行为可以被记录。
3. 后续买断、按集、分成、登录、后台管理都有清晰的数据扩展位置。

## 2. 当前状态

当前项目已经完成了第一轮静态拆分：

| 模块 | 当前状态 |
| --- | --- |
| 首页 | 已从单页销售页改向平台入口 |
| 剧本库 | 已有静态 `scripts.html` |
| 剧本详情页 | 已有静态 `script-lie-scent.html` |
| 免费包下载 | 已有本地 Markdown 下载文件 |
| 下载确认 | 已有前端弹窗和授权确认 |
| 数据来源 | 仍主要写死在 HTML / Markdown / JSON 文件中 |
| 后端 | 暂无 |
| 数据库 | 暂无 |
| 登录注册 | 暂无，计划后置 |

这说明第一阶段已经能展示正式体验，但还不能支撑规模化运营。

## 3. MVP 边界

### 第一版必须做

- 搭建后端服务。
- 接入数据库。
- 建立核心数据表。
- 提供剧本列表 API。
- 提供剧本详情 API。
- 提供免费包信息 API。
- 提供下载记录 API。
- 前端从 API 获取剧本库与详情数据。
- 保留游客下载能力。

### 第一版暂不做

- 在线支付。
- 登录注册。
- 用户中心。
- 管理后台完整界面。
- 分成结算系统。
- 视频数据自动抓取。
- 文件上传后台。
- 复杂权限系统。

这些不是不重要，而是放到数据库骨架稳定之后再做。

## 4. 推荐技术路线

当前项目是静态 HTML / CSS / JS。为了平滑过渡，有两条路线：

### 方案 A：轻量后端优先

```text
前端：保留现有 HTML / CSS / JS
后端：Node.js + Express
数据库：SQLite 起步，后续迁移 PostgreSQL
ORM：Prisma
```

优点：

- 对当前项目改动最小。
- 可以最快接入 API 和数据库。
- 适合先验证业务流程。
- 不需要立刻重构成 React 或 Next.js。

缺点：

- 页面工程化能力较弱。
- 后续如果页面和交互变复杂，仍可能需要迁移。

### 方案 B：正式全栈重构

```text
前端：Next.js + TypeScript
后端：Next.js API Routes / Server Actions
数据库：PostgreSQL
ORM：Prisma
```

优点：

- 更接近正式网站架构。
- SEO、路由、组件化、接口都更统一。
- 适合长期演进。

缺点：

- 第一轮迁移成本更高。
- 会同时涉及前端框架、构建流程、部署方式和数据层。

### 当前建议

第一版建议采用：

```text
Node.js + Express + Prisma + SQLite
```

原因是我们现在最需要先建立数据骨架，而不是马上把全部前端推倒重写。SQLite 可以让本地开发和数据建模很快跑起来，后续再迁移到 PostgreSQL。

等业务表稳定后，再决定是否迁移到 Next.js 或 React。

## 5. MVP 数据模型

第一版只建最关键的表。不要一开始就把订单、分成、后台、用户中心全部做满。

### scripts 剧本表

保存每套剧本的主信息。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 剧本 ID |
| slug | string | URL 标识，例如 `lie-scent` |
| title | string | 中文标题 |
| title_en | string | 英文标题，可选 |
| logline | text | 一句话爆点 |
| synopsis | text | 剧情简介 |
| category | string | 主类型 |
| cover_image | string | 封面图地址 |
| status | string | draft / published / archived |
| featured | boolean | 是否主推 |
| recommended_platforms | json | 推荐平台 |
| audience_tags | json | 受众标签 |
| production_difficulty | string | 制作难度 |
| episode_count | number | 预计总集数 |
| free_episode_count | number | 免费集数，默认 3 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### script_assets 剧本资源表

保存免费包、完整包、说明文档等文件信息。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 资源 ID |
| script_id | string | 所属剧本 |
| asset_type | string | free_preview / full_script / usage_guide / license |
| title | string | 文件标题 |
| version | string | 版本号，例如 `v1` |
| file_path | string | 文件路径或下载地址 |
| file_format | string | md / pdf / zip / json |
| file_size | number | 文件大小，可选 |
| is_public | boolean | 是否公开下载 |
| status | string | draft / published / archived |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### script_episodes 剧集表

保存剧集层级信息，第一版可只录前三集摘要。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 剧集 ID |
| script_id | string | 所属剧本 |
| episode_number | number | 第几集 |
| title | string | 单集标题 |
| hook | text | 开场钩子 |
| summary | text | 单集摘要 |
| ending_hook | text | 结尾悬念 |
| is_free_preview | boolean | 是否属于免费前三集 |
| status | string | draft / published |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### downloads 下载记录表

记录免费包下载行为。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 下载记录 ID |
| script_id | string | 剧本 ID |
| asset_id | string | 下载资源 ID |
| visitor_id | string | 游客标识 |
| user_id | string | 用户 ID，第一版可为空 |
| ip_address | string | IP 地址 |
| user_agent | text | 浏览器信息 |
| referrer | string | 来源页面 |
| license_confirmed | boolean | 是否勾选授权确认 |
| created_at | datetime | 下载时间 |

### continuation_options 续作方式表

保存每套剧本支持哪些后续合作方式。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 选项 ID |
| script_id | string | 剧本 ID |
| type | string | buyout / pay_per_episode / revenue_share |
| title | string | 展示标题 |
| description | text | 说明 |
| starting_price | number | 起始价格，可选 |
| enabled | boolean | 是否开放 |
| sort_order | number | 排序 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

## 6. 暂缓但预留的数据表

这些表第一版可以先不建，或只在 Prisma schema 中预留草案，不接业务流程。

| 表名 | 用途 | 建议阶段 |
| --- | --- | --- |
| users | 注册登录用户 | Phase 2 |
| user_favorites | 用户收藏剧本 | Phase 2 |
| test_reports | 用户回传前三集测试数据 | Phase 2 |
| orders | 买断和按集订单 | Phase 3 |
| order_items | 订单明细 | Phase 3 |
| revenue_share_applications | 分成合作申请 | Phase 3 |
| admin_audit_logs | 后台操作日志 | Phase 4 |

这样做的好处是：当前不会被复杂系统拖住，但业务方向已经留好了位置。

## 7. 第一版 API 设计

### 剧本列表

```text
GET /api/scripts
```

用途：

- 支撑剧本库页面。
- 支持基础筛选和排序。

建议查询参数：

```text
category
platform
audience
difficulty
featured
status
q
sort
page
pageSize
```

返回核心字段：

```json
{
  "items": [
    {
      "id": "script_lie_scent",
      "slug": "lie-scent",
      "title": "她闻到谎言",
      "logline": "她能闻到谎言的味道，却闻不出最爱的人哪一句是真。",
      "category": "悬疑甜虐",
      "coverImage": "assets/lie-scent-cover.jpg",
      "featured": true,
      "freeEpisodeCount": 3,
      "episodeCount": 60
    }
  ],
  "total": 1
}
```

### 剧本详情

```text
GET /api/scripts/:slug
```

用途：

- 支撑详情页。
- 返回剧本主信息、前三集摘要、下载资源、续作方式。

### 免费包信息

```text
GET /api/scripts/:slug/free-preview
```

用途：

- 详情页下载模块展示文件信息。
- 下载前明确版本、格式、授权边界。

### 创建下载记录

```text
POST /api/downloads
```

请求字段：

```json
{
  "scriptSlug": "lie-scent",
  "assetId": "asset_lie_scent_free_v1",
  "visitorId": "visitor_xxx",
  "licenseConfirmed": true
}
```

返回字段：

```json
{
  "downloadId": "download_xxx",
  "downloadUrl": "/downloads/free-preview-lie-scent-v1.md"
}
```

第一版可以返回本地文件地址；后续迁移对象存储后，返回短期签名链接。

## 8. 前端改造方式

第一版不要把页面体验推倒重做，只把数据来源替换掉。

### scripts.html

当前：

- 卡片写死在 HTML。

改造后：

- 页面加载时请求 `GET /api/scripts?status=published`。
- 用 JS 渲染剧本卡片。
- 筛选条件先在前端完成，后续再接后端查询。

### script-lie-scent.html

当前：

- 内容写死在 HTML。

改造后：

- 可以先保留静态页。
- 新增 `script-data.js` 或扩展 `script-detail.js` 请求 `GET /api/scripts/lie-scent`。
- 逐步把标题、简介、标签、下载文件、续作方式替换为 API 数据。

### 下载按钮

当前：

- 勾选授权确认后，直接下载本地 Markdown。

改造后：

1. 勾选授权确认。
2. 前端调用 `POST /api/downloads`。
3. 后端写入下载记录。
4. 前端跳转到返回的 `downloadUrl`。

这一步是第一版后端接入的关键闭环。

## 9. 文件存储策略

### MVP 阶段

继续使用本地文件：

```text
downloads/free-preview-lie-scent-v1.md
downloads/free-preview-lie-scent-v1.pdf
```

数据库只保存文件路径。

### 正式阶段

迁移到对象存储：

```text
Cloudflare R2 / 阿里云 OSS / 腾讯云 COS / AWS S3
```

后端不直接暴露永久文件地址，而是生成短期下载链接。

### 文件版本规则

建议统一命名：

```text
free-preview-{slug}-v1.md
free-preview-{slug}-v1.pdf
full-script-{slug}-v1.zip
usage-guide-{slug}-v1.md
license-summary-{slug}-v1.md
```

这样后续上传数据库、生成下载记录、做版本追踪都会更稳。

## 10. 种子数据策略

第一版需要一份种子数据，把已有剧本导入数据库。

建议先录入：

1. 《她闻到谎言》
2. 《直播复仇》
3. 《最后一座云城》
4. 《恋爱算法》

第一版种子数据最少包含：

- 剧本主信息。
- 标签。
- 三集摘要。
- 免费包资源。
- 三种续作方式。

已有本地 JSON 可以作为导入来源，但不要直接把全部字段一股脑塞入数据库。先挑选页面和业务需要的字段。

## 11. 实施顺序

### Step 1：初始化后端

新增：

```text
server.js
package.json
prisma/schema.prisma
prisma/seed.js
```

目标：

- 本地可以启动 API 服务。
- 可以访问健康检查接口。

验收：

```text
GET /api/health
```

返回：

```json
{
  "ok": true
}
```

### Step 2：建立数据库模型

先建：

- scripts
- script_assets
- script_episodes
- downloads
- continuation_options

验收：

- 可以运行 Prisma migration。
- 可以运行 seed。
- 数据库里有《她闻到谎言》。

### Step 3：实现剧本 API

实现：

```text
GET /api/scripts
GET /api/scripts/:slug
GET /api/scripts/:slug/free-preview
```

验收：

- 剧本库能拿到列表。
- 详情页能拿到《她闻到谎言》。
- 免费包接口能返回文件路径和版本号。

### Step 4：实现下载记录 API

实现：

```text
POST /api/downloads
```

验收：

- 点击下载时能写入数据库。
- 数据库能查到下载记录。
- 前端能拿到文件下载地址。

### Step 5：前端接 API

先改：

- `scripts.html`
- `script-detail.js`

验收：

- 剧本库卡片来自 API。
- 详情页下载记录能进入数据库。
- 本地下载体验不倒退。

## 12. 登录注册的后置策略

用户提到登录注册可以最后做，这个顺序是合理的。

第一版保持：

```text
游客可直接下载免费前三集
```

但要提前做两件事：

1. 给游客生成 `visitor_id`。
2. 下载记录表预留 `user_id`。

这样后续登录系统上线后，可以逐步把游客行为绑定到用户账户。

建议登录注册上线时机：

- 用户要收藏剧本时。
- 用户要提交测试数据时。
- 用户要申请分成合作时。
- 用户要买断或按集购买时。

也就是说，免费下载仍然低门槛；正式业务再要求登录。

## 13. 管理后台的后置策略

第一版不急着做完整后台，但要先避免数据只能靠手改数据库。

建议第一阶段用：

```text
Prisma seed + 简单脚本导入
```

第二阶段再做轻量后台：

- 新增剧本。
- 编辑剧本。
- 上下架剧本。
- 上传或配置免费包文件。
- 查看下载记录。

第三阶段再加入：

- 用户管理。
- 订单管理。
- 分成申请审核。
- 数据看板。

## 14. 安全与风控 MVP

第一版至少要做：

- 下载前必须勾选授权确认。
- 后端记录 `license_confirmed`。
- 记录 IP 和 user agent。
- 简单下载频率限制。
- 只允许下载 `published` 状态的资源。
- 不允许前端传任意文件路径让后端下载。

暂不做但要预留：

- 登录后下载。
- 文件水印。
- 签名下载链接。
- 管理员操作日志。
- 反爬策略。

## 15. 成功验收标准

这轮后端数据库 MVP 完成后，应该达到：

1. 新增一套剧本时，不需要手改 `scripts.html`。
2. 剧本详情页可以从数据库读取核心信息。
3. 免费前三集文件由数据库资源表管理。
4. 用户下载免费包时，数据库产生一条下载记录。
5. 未来接登录、订单、分成时，不需要推翻现有表结构。

## 16. 第一版建议任务清单

建议下一步正式进入代码前，按这个顺序执行：

1. 新建 `package.json`，确定后端依赖。
2. 新建 `server.js`，提供 Express API。
3. 安装并初始化 Prisma。
4. 建立 SQLite 数据库。
5. 写 `prisma/schema.prisma`。
6. 写 `prisma/seed.js`，导入《她闻到谎言》。
7. 实现 `GET /api/scripts`。
8. 实现 `GET /api/scripts/:slug`。
9. 实现 `POST /api/downloads`。
10. 修改前端下载流程，接入下载记录 API。

## 17. 我的建议

下一步不要先改 UI，也不要立刻批量生成大量剧本。

最优顺序是：

```text
后端数据库 MVP -> 剧本数据导入规范 -> 再批量生成可上线剧本 -> 最后做 UI 精修
```

原因很简单：如果数据库结构没有先定，批量生成的剧本后面还要二次整理；如果 UI 先大改，数据接入后也可能再返工。

所以接下来最适合进入：

```text
Phase 2：后端与数据库最小骨架代码实现
```

第一版只需要让《她闻到谎言》从数据库里跑通。跑通一套之后，再批量导入其他剧本，整个系统就会稳很多。
