# 正式网站架构重置规划

## 1. 重置背景

当前项目已经完成第一版最小可用改造，把“购买完整包”改成了“前三集免费验证”。但当前前端仍然是单页静态网站，核心转化方式是用户填写联系方式后人工发送免费包。

这个方式适合早期验证，但不适合继续向正式网站演进。

主要问题：

- 用户点击后不能直接获得内容，体验有阻断。
- 留联系方式领取会降低信任感，容易显得像不透明的营销页。
- 剧本越来越多后，单页展示会变乱。
- 本地 JSON 和 Markdown 难以承载搜索、筛选、下载、用户记录、订单、分成合作等业务。
- 没有用户系统，无法记录领取、下载、购买、申请分成、数据回传等行为。
- 没有后台管理，后续新增剧本和更新免费包会变成手工维护。

因此，下一阶段需要从“静态展示页”升级为“正式内容平台”。

## 2. 新目标

把短剧本铺建设成一个正式的 AI 短剧剧本内容平台。

用户可以：

1. 浏览剧本库。
2. 按题材、平台、风格、热度筛选剧本。
3. 点击剧本卡片进入详情页。
4. 在详情页直接下载前三集免费验证包。
5. 阅读使用说明、授权边界和注意事项。
6. 验证后选择买断、按集付费或版权分成。
7. 注册登录后管理自己的下载、收藏、购买、分成申请和数据回传。

平台可以：

1. 管理剧本数据。
2. 管理免费包文件。
3. 管理用户下载记录。
4. 管理后续购买和合作申请。
5. 追踪哪些剧本被领取、被下载、被咨询、被购买。
6. 为后续支付、订单、分成结算和后台运营打基础。

## 3. 核心产品定位

新网站不再是“一个卖剧本的落地页”，而是：

```text
AI短剧剧本库 + 免费前三集验证包 + 后续内容授权平台
```

核心体验应当像一个专业内容资产平台：

- 可以浏览。
- 可以筛选。
- 可以查看详情。
- 可以直接下载免费内容。
- 可以清楚理解授权边界。
- 可以在需要时升级到付费或合作。

首页不再承担所有功能，而是承担品牌说明、主推剧本和入口分流。

## 4. 页面架构

### 第一阶段必做页面

| 页面 | 路由建议 | 作用 |
| --- | --- | --- |
| 首页 | `/` | 品牌、主推剧本、免费验证模型说明、进入剧本库 |
| 剧本库页 | `/scripts` | 展示全部剧本，支持筛选、搜索、排序 |
| 剧本详情页 | `/scripts/:slug` | 展示单套剧本详情，可直接下载前三集免费包 |
| 免费包下载页或模块 | `/scripts/:slug/free-preview` 或详情页内模块 | 展示文件清单、授权边界、下载按钮 |
| 登录页 | `/login` | 用户登录 |
| 注册页 | `/register` | 用户注册 |

### 第二阶段页面

| 页面 | 路由建议 | 作用 |
| --- | --- | --- |
| 用户中心 | `/account` | 下载记录、收藏、购买记录、分成申请 |
| 我的下载 | `/account/downloads` | 用户下载过的免费包 |
| 我的订单 | `/account/orders` | 买断、按集付费订单 |
| 分成申请 | `/revenue-share/apply` | 提交账号、平台、历史数据、合作意向 |
| 数据回传 | `/account/test-reports` | 用户提交前三集测试数据 |

### 第三阶段页面

| 页面 | 路由建议 | 作用 |
| --- | --- | --- |
| 管理后台 | `/admin` | 内容、用户、订单、下载、分成申请管理 |
| 剧本编辑 | `/admin/scripts/:id` | 编辑剧本资料、上下架、配置免费包 |
| 文件管理 | `/admin/files` | 上传免费包、完整包、授权文档 |
| 合作审核 | `/admin/revenue-share` | 审核分成合作申请 |
| 数据看板 | `/admin/analytics` | 剧本下载、转化、购买、合作表现 |

## 5. 首页重置方向

首页应从“剧本详情 + 表单领取”变成“平台入口”。

首页核心模块建议：

1. Hero：说明平台定位。
2. 主推剧本：展示 3-6 套精选剧本。
3. 免费验证流程：领取前三集、制作发布、看数据、选择续作。
4. 剧本分类入口：悬疑、复仇、甜宠、科幻、直播、海外等。
5. 续作方式说明：买断、按集、分成。
6. 授权边界说明。
7. 进入剧本库 CTA。

首页不再承担完整剧本展示，不再用右侧抽屉收联系方式作为主路径。

### 首页主 CTA

建议从：

```text
免费领取前三集
```

升级为：

```text
进入剧本库
```

辅助 CTA：

```text
查看主推剧本
```

## 6. 剧本库页设计

剧本库页是新网站的核心入口。

### 页面目标

让用户像挑项目一样挑剧本。

### 展示字段

每张剧本卡片建议展示：

- 封面图。
- 剧本名称。
- 一句话爆点。
- 类型标签。
- 推荐平台。
- 免费包状态。
- 完整集数范围。
- 适合账号类型。
- 热度或领取次数。
- 按钮：查看详情。

### 筛选条件

第一阶段建议支持：

- 题材类型：悬疑、复仇、甜宠、科幻、直播、商战、豪门。
- 推荐平台：抖音、快手、小红书、TikTok、YouTube Shorts、ReelShort。
- 受众方向：女性向、男性向、海外向、全龄向。
- 制作难度：低、中、高。
- 免费包状态：已开放、制作中。
- 续作方式：支持买断、支持按集、支持分成。

### 排序方式

建议支持：

- 最新上架。
- 最多下载。
- 最多收藏。
- 最多咨询。
- 推荐优先。

### 空状态

如果用户筛选后无结果，应提示：

```text
当前没有匹配剧本，可以清空筛选或提交题材需求。
```

## 7. 剧本详情页设计

详情页是用户下载前三集前的关键页面。

### 页面结构

建议结构：

1. 剧本头部信息。
2. 一句话爆点和剧情简介。
3. 前三集验证目标。
4. 角色视觉锚点预览。
5. 分镜样片预览。
6. 免费包文件清单。
7. 使用说明和注意事项。
8. 授权边界。
9. 下载按钮。
10. 续作方式。
11. FAQ。

### 详情页头部字段

- 剧本名称。
- 英文名。
- 类型标签。
- 推荐平台。
- 推荐画幅。
- 建议单集时长。
- 预计完整集数。
- 免费包状态。
- 更新时间。

### 免费包下载模块

文件清单建议展示：

- `free-preview-lie-scent-v1.md`
- 前三集剧情正文。
- 前三集分镜。
- 角色视觉锚点。
- AI画面提示词。
- 发布测试指南。
- 授权边界说明。

### 下载按钮逻辑

第一阶段可以允许未登录下载，降低门槛：

```text
免费下载前三集验证包
```

但必须记录基础下载事件，例如：

- 剧本 ID。
- 文件 ID。
- 下载时间。
- IP 或匿名 visitor_id。
- 来源页面。

第二阶段可以调整为登录后下载：

```text
登录后免费下载
```

建议策略：

- 初期允许游客下载，建立信任。
- 同时提供登录后保存下载记录。
- 当付费和分成业务上线后，再逐步强化登录体系。

## 8. 下载体验设计

当前“留联系方式领取”需要替换为“直接下载”。

### 推荐体验

用户点击下载按钮后：

1. 弹出轻量确认弹窗或直接下载。
2. 弹窗展示授权边界摘要。
3. 用户勾选“我已了解前三集免费包仅限测试使用”。
4. 点击“确认下载”。
5. 浏览器下载 Markdown / ZIP / PDF 文件。

### 文件格式建议

第一阶段：

- Markdown：方便快速制作和维护。
- PDF：方便用户阅读和转发给团队。

第二阶段：

- ZIP：打包 Markdown、PDF、图片样片、JSON。

建议最终免费包下载文件包含：

```text
free-preview-lie-scent-v1.zip
  free-preview-lie-scent-v1.md
  free-preview-lie-scent-v1.pdf
  usage-guide.md
  license-summary.md
  sample-frames/
```

### 下载前授权确认

弹窗文案：

```text
本免费包仅授权前三集测试使用，不包含第4集及以后内容，不构成完整版权转让。你不得转售、打包分发或作为素材库出售。
```

按钮：

```text
我已了解，下载前三集
```

## 9. 后端架构建议

当前项目是静态页面。正式网站需要后端提供：

- 剧本数据 API。
- 文件下载 API。
- 用户注册登录。
- 用户下载记录。
- 订单和续作方式管理。
- 分成合作申请。
- 管理后台。

### 技术路线建议

如果希望快速推进，建议采用：

```text
前端：Next.js 或 React + Router
后端：Next.js API Routes / NestJS / Express
数据库：PostgreSQL
ORM：Prisma
文件存储：本地开发 + 对象存储
认证：邮箱密码 / 手机验证码 / 第三方登录后续扩展
```

### 为什么建议 PostgreSQL

- 结构化数据强。
- 适合用户、订单、下载、授权、分成等业务。
- 后续可以支持全文搜索、标签筛选、统计分析。
- 与 Prisma 配合开发效率高。

如果项目仍想先轻量一点，也可以先用 SQLite + Prisma 做本地原型，后续迁移 PostgreSQL。

## 10. 数据库表设计

以下是第一版建议数据表。

### users 用户表

用于注册登录和用户行为归属。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 用户ID |
| email | string | 邮箱 |
| phone | string | 手机号，可选 |
| password_hash | string | 密码哈希 |
| display_name | string | 昵称 |
| role | enum | user / admin |
| status | enum | active / disabled |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### scripts 剧本表

每套剧本的主数据。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 剧本ID |
| slug | string | URL标识，例如 lie-scent |
| title_zh | string | 中文名 |
| title_en | string | 英文名 |
| logline | text | 一句话爆点 |
| synopsis | text | 剧情简介 |
| category | string | 主类型 |
| cover_image_url | string | 封面图 |
| recommended_aspect_ratio | string | 推荐画幅 |
| estimated_episode_count | string | 预计集数 |
| suggested_duration | string | 单集建议时长 |
| status | enum | draft / published / archived |
| featured | boolean | 是否主推 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### script_tags 标签表

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 标签ID |
| name | string | 标签名 |
| type | enum | genre / platform / audience / difficulty |

### script_tag_relations 剧本标签关系表

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| script_id | uuid | 剧本ID |
| tag_id | uuid | 标签ID |

### characters 角色表

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 角色ID |
| script_id | uuid | 所属剧本 |
| name | string | 角色名 |
| role | string | 角色定位 |
| age | string | 年龄段 |
| visual_anchor | text | 视觉锚点 |
| personality | text | 气质关键词 |
| production_note | text | 制作注意 |
| sort_order | number | 排序 |

### episodes 剧集表

保存前三集和后续剧集元数据。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 剧集ID |
| script_id | uuid | 所属剧本 |
| episode_number | number | 第几集 |
| title | string | 标题 |
| hook | text | 核心钩子 |
| summary | text | 剧情摘要 |
| ending_hook | text | 结尾悬念 |
| is_free_preview | boolean | 是否免费预览集 |
| status | enum | draft / published |

### storyboard_scenes 分镜表

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 分镜ID |
| episode_id | uuid | 所属剧集 |
| scene_number | number | 镜头编号 |
| image_url | string | 样片图，可选 |
| visual_description | text | 画面内容 |
| character_action | text | 角色动作 |
| camera_movement | text | 镜头运动 |
| lighting | text | 光线氛围 |
| dialogue_or_subtitle | text | 字幕对白 |
| audio_cue | text | 音效音乐 |
| ai_prompt | text | AI提示词 |

### preview_packages 免费包表

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 免费包ID |
| script_id | uuid | 所属剧本 |
| version | string | 版本号 |
| title | string | 文件标题 |
| description | text | 简介 |
| file_url | string | 下载地址 |
| file_type | string | md / pdf / zip |
| file_size | number | 文件大小 |
| status | enum | draft / published / archived |
| published_at | datetime | 发布时间 |

### downloads 下载记录表

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 下载记录ID |
| user_id | uuid | 用户ID，可为空 |
| visitor_id | string | 游客ID |
| script_id | uuid | 剧本ID |
| preview_package_id | uuid | 免费包ID |
| ip_address | string | IP |
| user_agent | text | 浏览器信息 |
| source | string | 来源页面 |
| created_at | datetime | 下载时间 |

### continuation_options 续作方式表

用于配置每个剧本支持的后续方式。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 选项ID |
| script_id | uuid | 剧本ID |
| type | enum | buyout / pay_per_episode / revenue_share |
| title | string | 选项标题 |
| description | text | 说明 |
| enabled | boolean | 是否开放 |
| starting_price | number | 起始价格，可选 |
| notes | text | 注意事项 |

### orders 订单表

用于买断和按集付费。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 订单ID |
| user_id | uuid | 用户ID |
| script_id | uuid | 剧本ID |
| order_type | enum | buyout / pay_per_episode |
| status | enum | pending / paid / fulfilled / cancelled / refunded |
| amount | number | 金额 |
| currency | string | 币种 |
| created_at | datetime | 创建时间 |
| paid_at | datetime | 支付时间 |

### order_items 订单明细表

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 明细ID |
| order_id | uuid | 订单ID |
| episode_id | uuid | 剧集ID，可为空 |
| item_type | enum | episode / full_script / license |
| title | string | 明细标题 |
| price | number | 明细价格 |

### revenue_share_applications 分成申请表

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 申请ID |
| user_id | uuid | 用户ID |
| script_id | uuid | 剧本ID |
| platform | string | 计划发布平台 |
| account_url | string | 账号链接 |
| account_followers | number | 粉丝量 |
| average_views | number | 平均播放 |
| production_capacity | text | 制作能力说明 |
| message | text | 合作说明 |
| status | enum | submitted / reviewing / approved / rejected |
| reviewed_by | uuid | 审核人 |
| reviewed_at | datetime | 审核时间 |
| created_at | datetime | 提交时间 |

### test_reports 数据回传表

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 回传ID |
| user_id | uuid | 用户ID |
| script_id | uuid | 剧本ID |
| platform | string | 发布平台 |
| account_url | string | 账号链接 |
| notes | text | 用户判断 |
| created_at | datetime | 提交时间 |

### test_report_items 数据回传明细表

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 明细ID |
| report_id | uuid | 回传ID |
| episode_number | number | 第几集 |
| video_url | string | 视频链接 |
| views | number | 播放量 |
| likes | number | 点赞 |
| comments | number | 评论 |
| favorites | number | 收藏 |
| shares | number | 转发 |
| completion_rate | number | 完播率 |
| new_followers | number | 新增粉丝 |
| revenue | number | 收益，可选 |

## 11. API 设计

第一阶段建议 API：

### 剧本

```text
GET /api/scripts
GET /api/scripts/:slug
GET /api/scripts/:slug/free-preview
```

### 下载

```text
POST /api/downloads
GET /api/downloads/:id/file
```

建议下载流程：

1. 前端提交下载事件。
2. 后端记录 downloads。
3. 后端返回签名下载地址或文件流。

### 用户

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/me
```

### 分成申请

```text
POST /api/revenue-share/applications
GET /api/account/revenue-share/applications
```

### 数据回传

```text
POST /api/test-reports
GET /api/account/test-reports
```

### 管理后台

```text
GET /api/admin/scripts
POST /api/admin/scripts
PATCH /api/admin/scripts/:id
POST /api/admin/preview-packages
GET /api/admin/downloads
GET /api/admin/revenue-share/applications
PATCH /api/admin/revenue-share/applications/:id
```

## 12. 用户系统策略

你提到登录注册可以最后做，这个顺序是合理的。

建议分三步：

### Step 1：游客可下载

先允许游客直接下载前三集免费包，建立信任感。

记录：

- visitor_id。
- 下载剧本。
- 下载时间。

### Step 2：登录后增强体验

引导用户登录后获得：

- 保存下载记录。
- 收藏剧本。
- 提交测试数据。
- 申请分成合作。
- 查看后续购买记录。

### Step 3：付费和分成必须登录

涉及订单、买断、按集购买、分成申请时必须登录。

这样既降低免费入口门槛，又能让正式业务有账户归属。

## 13. 文件存储策略

第一阶段可以先把文件放在项目内：

```text
public/downloads/free-preview-lie-scent-v1.md
public/downloads/free-preview-lie-scent-v1.pdf
```

第二阶段迁移到对象存储：

- 阿里云 OSS。
- 腾讯云 COS。
- Cloudflare R2。
- AWS S3。

下载时不要直接暴露永久文件地址，最好由后端生成短期下载链接。

## 14. 管理后台能力

随着数据增加，后台是必须的。

第一版后台最少要支持：

- 新增剧本。
- 编辑剧本。
- 上架/下架剧本。
- 上传免费包。
- 设置是否开放下载。
- 查看下载记录。
- 查看分成申请。

第二版后台支持：

- 编辑角色和分镜。
- 管理订单。
- 管理用户。
- 管理标签。
- 查看数据报表。

## 15. 运营与信任补充

你提到“像诈骗网站”的风险，这个判断很关键。正式网站需要增加信任信号。

建议补充：

- 明确展示免费包文件清单。
- 明确展示授权边界。
- 下载前不强制留联系方式。
- 展示更新时间和版本号。
- 展示样片图和部分正文预览。
- 提供 FAQ。
- 提供平台规则和版权说明。
- 提供联系入口，但不作为下载前置条件。
- 保留用户下载记录和文件版本记录。

不要使用：

- 过度夸张的收益承诺。
- “稳赚爆火”类话术。
- 下载前强制加微信。
- 不透明价格。
- 模糊授权。

## 16. 安全与风控

正式网站需要考虑：

- 免费包被批量爬取。
- 文件被转售。
- 恶意注册。
- 下载接口被刷。
- 分成申请垃圾提交。
- 用户上传虚假数据。

第一阶段可以做：

- 下载频率限制。
- visitor_id 记录。
- IP 限制。
- 下载前授权确认。
- 文件水印或版本号。

第二阶段做：

- 登录下载限制。
- 邮箱验证。
- 后台审核。
- 管理员操作日志。
- 文件签名链接。

## 17. 推荐实施路线

### Phase 0：暂停当前单页继续扩张

目标：

- 不再继续往 `index.html` 里塞更多业务。
- 保留当前页面作为临时展示页。
- 用本文档作为新架构方向。

### Phase 1：前端路由拆分

目标：

- 从单页改为多页面。

页面：

- 首页 `/`
- 剧本库 `/scripts`
- 剧本详情 `/scripts/lie-scent`

数据仍可先来自本地 JSON。

验收：

- 首页只做入口。
- 剧本库能展示多套剧本。
- 详情页能展示《她闻到谎言》并提供下载按钮。

### Phase 2：直接下载免费包

目标：

- 替换“留联系方式领取”。

实现：

- 在详情页提供下载按钮。
- 下载 `free-preview-lie-scent-v1.md`。
- 下载前展示授权确认。

验收：

- 用户不需要填写联系方式即可下载。
- 授权边界清楚。
- 下载流程专业可信。

### Phase 3：后端和数据库

目标：

- 剧本数据进入数据库。
- 下载记录进入数据库。

实现：

- 搭建后端 API。
- 建立 scripts、preview_packages、downloads 等核心表。
- 前端从 API 获取剧本库和详情。

验收：

- 新增剧本不再手改 HTML。
- 下载记录可查询。
- 文件可由后端控制。

### Phase 4：用户系统

目标：

- 注册登录。
- 用户中心。

实现：

- 登录注册。
- 我的下载。
- 收藏剧本。
- 数据回传。

验收：

- 用户可查看自己下载过的剧本。
- 用户可提交前三集测试数据。

### Phase 5：交易和分成业务

目标：

- 支持买断、按集付费、分成申请。

实现：

- orders。
- order_items。
- revenue_share_applications。
- 管理后台审核。

验收：

- 用户可购买后续剧集。
- 用户可申请分成合作。
- 管理员可审核。

## 18. 技术选型建议

如果从当前静态项目正式升级，我建议优先考虑：

### 方案A：Next.js 全栈

适合：

- 想快速做正式网站。
- 需要页面路由、API、数据库、登录都在一个项目里。

技术：

- Next.js
- TypeScript
- Prisma
- PostgreSQL
- NextAuth 或自建 auth
- 对象存储

优点：

- 前后端一体。
- 页面路由自然。
- SEO 友好。
- 适合内容站。

### 方案B：React + Express

适合：

- 想前后端完全分离。
- 后续可能做独立后台和开放 API。

技术：

- React + Vite
- Express / NestJS
- Prisma
- PostgreSQL

优点：

- 架构边界清楚。
- 后端可独立扩展。

### 我的建议

当前阶段建议选：

```text
Next.js + TypeScript + Prisma + PostgreSQL
```

原因：

- 你现在最需要的是快速从静态页升级成正式网站。
- 剧本库和详情页需要 SEO。
- 后端 API 和数据库需求明确但还不复杂。
- 后续登录、下载、订单、后台都能逐步接进去。

## 19. 你可能遗漏但建议补充的功能

### 搜索

剧本数量增加后，搜索比分类更重要。

支持搜索：

- 剧本名。
- 爆点。
- 标签。
- 角色设定。
- 推荐平台。

### 收藏

用户不一定第一次就下载，可以先收藏。

### 版本管理

免费包和完整包都需要版本号。

例如：

```text
free-preview-lie-scent-v1.md
free-preview-lie-scent-v2.md
```

### 文件水印

免费包可加入：

- 文件版本号。
- 下载时间。
- 用户ID或匿名下载ID，后期可选。

### 数据看板

需要知道：

- 哪些剧本被浏览最多。
- 哪些剧本被下载最多。
- 哪些剧本下载后产生购买或分成申请。

### 内容审核

未来剧本涉及暴力、医疗、豪门、复仇等题材，最好给每套剧本加：

- 风险标签。
- 平台敏感点。
- 替代表达建议。

### 多语言

当前已有英文 prompt-ready 方向，未来可支持：

- 中文详情。
- 英文详情。
- 海外版下载包。

## 20. 第一版重构范围建议

不要一口气做登录、支付、后台。

第一版正式架构建议只做：

1. 首页变成平台入口。
2. 新增剧本库页。
3. 新增剧本详情页。
4. 详情页直接下载前三集 Markdown 文件。
5. 下载前显示授权确认。
6. 数据仍暂时来自本地 JSON。

这样能最快解决“不专业、像诈骗网站”的问题，同时不被后端复杂度拖住。

第二版再做：

1. 数据库。
2. 下载记录。
3. 后端 API。

第三版再做：

1. 登录注册。
2. 用户中心。
3. 分成申请。
4. 订单系统。

## 21. 下一步建议

下一步建议继续写一份更具体的实施文档：

```text
docs/frontend-routing-plan-v1.md
```

它专门解决：

- 当前静态文件如何拆成多页面。
- 首页、剧本库页、详情页分别放什么。
- 本地 JSON 如何临时供数据。
- 下载按钮如何先用本地文件实现。
- 哪些旧代码需要保留，哪些应该废弃。

等前端路由拆分规划完成，再开始真正改代码。这样我们不会从一个临时单页跳到另一个临时单页，而是开始向正式站点架构迁移。
