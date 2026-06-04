# 版权分成系统设计方案

## 1. 文档目标

本文档用于把版权分成业务从运营规则收束成系统设计。

前置文档：

- `revenue-share-operation-plan.md`
- `revenue-share-agreement-terms.md`
- `revenue-share-data-report-template.md`

本文档回答：

1. 数据库需要新增哪些模型。
2. 后端需要新增哪些接口。
3. 用户中心需要新增哪些页面。
4. 后台管理需要新增哪些页面。
5. 版权分成如何和现有合作申请、订单、交付流程衔接。

本文档仍属于规划阶段，不直接修改代码。

## 2. 核心系统判断

版权分成不应该继续挂在普通订单下面。

现有买断、按集购买适合：

```text
合作申请 -> 订单 -> 付款 -> 交付
```

版权分成应升级为：

```text
合作申请 -> 分成项目 -> 协议确认 -> 分批交付 -> 视频回传 -> 月度结算 -> 下一批交付
```

因此后续系统应新增一个独立模块：

```text
Revenue Share Projects
```

订单可以继续存在，但只用于：

- 保底费用
- 保证金
- 已确认的分成结算款
- 违约金或补款

订单不应该再承担整个版权分成业务。

## 3. 与现有流程的衔接

### 3.1 当前已有对象

当前系统已经有：

| 对象 | 用途 |
| --- | --- |
| `User` | 用户账号 |
| `Script` | 剧本 |
| `Download` | 免费前三集下载记录 |
| `TestReport` | 前三集测试反馈 |
| `ContinuationRequest` | 后续合作申请 |
| `Order` | 买断、按集、付款订单 |
| `Delivery` | 交付记录 |
| `DeliveryAsset` | 交付文件 |

### 3.2 版权分成应如何接入

当用户提交 `ContinuationRequest.type = revenue_share` 后：

```text
后台审核申请
填写分成项目参数
上传或确认分成协议
创建 RevenueShareProject
创建第一批 RevenueShareBatch
创建对应 Delivery
用户开始制作视频
用户每月提交 RevenueShareStatement
后台审核并确认结算
达到条件后开放下一批 RevenueShareBatch
```

### 3.3 现有 0 元订单逻辑的处理

当前系统已有：

```text
分成申请通过 -> 生成 0 元订单 -> 开放交付
```

后续建议调整为：

```text
分成申请通过 -> 创建分成项目
```

是否保留 0 元订单：

- 可以短期保留，用于兼容现有用户中心展示。
- 长期应弱化，不作为版权分成主记录。
- 真正的分成管理应进入 `RevenueShareProject`。

## 4. 新增数据模型总览

建议新增五个核心模型：

```text
RevenueShareProject
RevenueShareBatch
RevenueShareStatement
RevenueShareVideo
RevenueShareEvidence
```

可选新增：

```text
RevenueShareEvent
```

用于记录操作日志和风险事件。

## 5. RevenueShareProject

### 5.1 用途

记录一项版权分成合作项目。

一个用户对一套剧本的一次分成合作，对应一个 `RevenueShareProject`。

### 5.2 建议字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | String | 项目 ID |
| `userId` | String | 合作用户 |
| `scriptId` | String | 合作剧本 |
| `continuationRequestId` | String? | 来源合作申请 |
| `status` | String | 项目状态 |
| `contractStatus` | String | 协议状态 |
| `contractFilePath` | String? | 协议文件 |
| `shareRatioPlatform` | Int | 平台分成比例，建议用整数百分比 |
| `shareRatioUser` | Int | 用户分成比例 |
| `settlementCycle` | String | 结算周期，默认 monthly |
| `authorizedPlatforms` | String | JSON 数组 |
| `authorizedAccounts` | String | JSON 数组 |
| `revenueDefinition` | String? | 收益口径说明 |
| `firstEpisodeNumber` | Int | 首个授权后续集 |
| `currentEpisodeEnd` | Int | 当前已开放到第几集 |
| `riskStatus` | String | normal / warning / paused / terminated |
| `adminNote` | String? | 后台备注 |
| `userVisibleNote` | String? | 用户可见说明 |
| `startedAt` | DateTime? | 项目开始 |
| `endedAt` | DateTime? | 项目结束 |
| `createdAt` | DateTime | 创建时间 |
| `updatedAt` | DateTime | 更新时间 |

### 5.3 状态枚举

建议 `status`：

| 状态 | 含义 |
| --- | --- |
| `draft` | 后台已创建但未正式开始 |
| `pending_contract` | 等待协议确认 |
| `active` | 合作进行中 |
| `paused` | 暂停交付或结算 |
| `terminated` | 已终止 |
| `completed` | 合作完成 |

建议 `contractStatus`：

| 状态 | 含义 |
| --- | --- |
| `not_uploaded` | 未上传 |
| `pending_user_confirmation` | 等待用户确认 |
| `confirmed` | 已确认 |
| `rejected` | 用户拒绝或需重签 |

### 5.4 关系

```text
RevenueShareProject belongsTo User
RevenueShareProject belongsTo Script
RevenueShareProject belongsTo ContinuationRequest
RevenueShareProject hasMany RevenueShareBatch
RevenueShareProject hasMany RevenueShareStatement
RevenueShareProject hasMany RevenueShareVideo
RevenueShareProject hasMany RevenueShareEvidence
```

## 6. RevenueShareBatch

### 6.1 用途

记录分批交付。

例如：

```text
第1批：第4-10集
第2批：第11-20集
```

### 6.2 建议字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | String | 批次 ID |
| `projectId` | String | 分成项目 |
| `deliveryId` | String? | 关联交付记录 |
| `batchNumber` | Int | 第几批 |
| `episodeStart` | Int | 起始集 |
| `episodeEnd` | Int | 结束集 |
| `status` | String | 批次状态 |
| `releaseCondition` | String? | 开放条件 |
| `lockedReason` | String? | 锁定原因 |
| `releasedAt` | DateTime? | 开放时间 |
| `createdAt` | DateTime | 创建时间 |
| `updatedAt` | DateTime | 更新时间 |

### 6.3 状态枚举

| 状态 | 含义 |
| --- | --- |
| `planned` | 已规划，未开放 |
| `ready` | 可开放 |
| `released` | 已交付 |
| `locked` | 暂停开放 |
| `closed` | 已关闭 |

### 6.4 与 Delivery 的关系

`RevenueShareBatch` 不直接存文件，文件仍复用现有 `Delivery` 和 `DeliveryAsset`。

这样可以保持交付系统统一：

```text
分成批次 -> Delivery -> DeliveryAsset
```

## 7. RevenueShareStatement

### 7.1 用途

记录每月结算单。

一个分成项目每个结算周期对应一张 `RevenueShareStatement`。

### 7.2 建议字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | String | 结算单 ID |
| `projectId` | String | 分成项目 |
| `userId` | String | 用户 |
| `scriptId` | String | 剧本 |
| `periodStart` | DateTime | 周期开始 |
| `periodEnd` | DateTime | 周期结束 |
| `status` | String | 结算状态 |
| `reportedRevenueCents` | Int | 用户申报收益 |
| `confirmedRevenueCents` | Int? | 平台确认收益 |
| `platformShareRatio` | Int | 平台分成比例 |
| `platformShareCents` | Int? | 平台应得 |
| `userShareCents` | Int? | 用户保留 |
| `videoCount` | Int | 视频数量 |
| `evidenceCount` | Int | 证明材料数量 |
| `userNote` | String? | 用户备注 |
| `adminNote` | String? | 后台备注 |
| `submittedAt` | DateTime? | 用户提交时间 |
| `reviewedAt` | DateTime? | 审核时间 |
| `paidAt` | DateTime? | 支付完成时间 |
| `createdAt` | DateTime | 创建时间 |
| `updatedAt` | DateTime | 更新时间 |

### 7.3 状态枚举

| 状态 | 含义 |
| --- | --- |
| `draft` | 用户草稿 |
| `submitted` | 已提交 |
| `needs_more_evidence` | 需要补充材料 |
| `reviewing` | 审核中 |
| `confirmed` | 已确认结算金额 |
| `disputed` | 存在争议 |
| `paid` | 已完成分成支付 |
| `voided` | 作废 |

## 8. RevenueShareVideo

### 8.1 用途

记录每条视频的数据。

一条视频可以属于一个结算单，也属于一个分成项目。

### 8.2 建议字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | String | 视频记录 ID |
| `projectId` | String | 分成项目 |
| `statementId` | String? | 所属结算单 |
| `batchId` | String? | 所属交付批次 |
| `episodeNumber` | Int | 对应剧集 |
| `title` | String | 视频标题 |
| `videoUrl` | String | 视频链接 |
| `platform` | String | 发布平台 |
| `accountName` | String | 发布账号 |
| `publishedAt` | DateTime | 发布时间 |
| `viewCount` | Int? | 播放量 |
| `likeCount` | Int? | 点赞 |
| `commentCount` | Int? | 评论 |
| `favoriteCount` | Int? | 收藏 |
| `shareCount` | Int? | 转发 |
| `completionRate` | Float? | 完播率 |
| `reportedRevenueCents` | Int | 用户申报收益 |
| `revenueType` | String | 收益类型 |
| `status` | String | 视频审核状态 |
| `note` | String? | 用户备注 |
| `adminNote` | String? | 后台备注 |
| `createdAt` | DateTime | 创建时间 |
| `updatedAt` | DateTime | 更新时间 |

### 8.3 状态枚举

| 状态 | 含义 |
| --- | --- |
| `submitted` | 已提交 |
| `verified` | 已核验 |
| `needs_evidence` | 需要补充证明 |
| `invalid` | 无效 |
| `disputed` | 存在争议 |

## 9. RevenueShareEvidence

### 9.1 用途

记录收益截图、后台截图、结算截图、协议文件等证明材料。

### 9.2 建议字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | String | 证明材料 ID |
| `projectId` | String | 分成项目 |
| `statementId` | String? | 所属结算单 |
| `videoId` | String? | 关联视频 |
| `evidenceType` | String | 材料类型 |
| `filePath` | String | 文件路径 |
| `originalFileName` | String? | 原文件名 |
| `uploadedBy` | String | user / admin |
| `reviewStatus` | String | 审核状态 |
| `adminNote` | String? | 审核备注 |
| `createdAt` | DateTime | 上传时间 |

### 9.3 evidenceType 枚举

| 类型 | 说明 |
| --- | --- |
| `contract` | 协议文件 |
| `account_homepage` | 账号主页截图 |
| `video_list` | 视频列表截图 |
| `video_metrics` | 单条视频数据截图 |
| `revenue_dashboard` | 收益后台截图 |
| `settlement` | 平台结算截图 |
| `withdrawal` | 提现截图 |
| `paid_traffic` | 投流截图 |
| `commerce` | 带货佣金截图 |
| `other` | 其他 |

### 9.4 reviewStatus 枚举

| 状态 | 含义 |
| --- | --- |
| `pending` | 待审核 |
| `accepted` | 已采纳 |
| `rejected` | 不采纳 |
| `needs_clearer_version` | 需要更清晰版本 |

## 10. RevenueShareEvent

### 10.1 用途

可选模型，用于记录项目操作日志和风险事件。

### 10.2 建议字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | String | 事件 ID |
| `projectId` | String | 分成项目 |
| `eventType` | String | 事件类型 |
| `actorType` | String | user / admin / system |
| `actorId` | String? | 操作者 ID |
| `message` | String | 事件描述 |
| `metadata` | String? | JSON |
| `createdAt` | DateTime | 创建时间 |

事件示例：

- 项目创建
- 协议上传
- 用户确认协议
- 批次开放
- 月度数据提交
- 后台要求补充材料
- 结算金额确认
- 分成支付完成
- 项目暂停
- 项目终止

## 11. 后端接口设计

### 11.1 用户端接口

#### 获取我的分成项目

```text
GET /api/me/revenue-share-projects
```

返回：

- 项目列表
- 剧本信息
- 项目状态
- 当前开放集数
- 下次数据提交时间
- 最近结算状态

#### 获取分成项目详情

```text
GET /api/me/revenue-share-projects/:id
```

返回：

- 项目基础信息
- 授权平台和账号
- 分成比例
- 批次列表
- 最近结算单
- 数据回传要求

#### 创建月度结算单草稿

```text
POST /api/me/revenue-share-projects/:id/statements
```

请求：

- `periodStart`
- `periodEnd`
- `platform`
- `accountName`
- `userNote`

#### 添加视频数据

```text
POST /api/me/revenue-share-statements/:id/videos
```

请求：

- `episodeNumber`
- `title`
- `videoUrl`
- `platform`
- `accountName`
- `publishedAt`
- `viewCount`
- `likeCount`
- `commentCount`
- `reportedRevenueCents`
- `revenueType`

#### 上传证明材料

```text
POST /api/me/revenue-share-statements/:id/evidence
```

MVP 阶段可以先不做真实文件上传，先支持：

- 外部图片链接
- 本地文件路径
- 后台手动录入

正式阶段再做文件上传。

#### 提交月度结算单

```text
POST /api/me/revenue-share-statements/:id/submit
```

提交后状态：

```text
draft -> submitted
```

### 11.2 后台接口

#### 创建分成项目

```text
POST /api/admin/revenue-share-projects
```

通常由后台通过版权分成申请时创建。

请求：

- `continuationRequestId`
- `shareRatioPlatform`
- `authorizedPlatforms`
- `authorizedAccounts`
- `firstBatchEpisodeStart`
- `firstBatchEpisodeEnd`
- `settlementCycle`
- `contractFilePath`
- `userVisibleNote`

#### 获取分成项目列表

```text
GET /api/admin/revenue-share-projects
```

筛选：

- 状态
- 剧本
- 用户
- 风险状态
- 结算周期

#### 更新分成项目

```text
PATCH /api/admin/revenue-share-projects/:id
```

可更新：

- 状态
- 分成比例
- 授权账号
- 协议状态
- 风险状态
- 后台备注
- 用户可见说明

#### 开放下一批剧集

```text
POST /api/admin/revenue-share-projects/:id/batches
```

创建新批次并关联交付。

#### 获取结算单列表

```text
GET /api/admin/revenue-share-statements
```

筛选：

- 状态
- 项目
- 用户
- 周期
- 是否逾期

#### 审核结算单

```text
PATCH /api/admin/revenue-share-statements/:id
```

可更新：

- `status`
- `confirmedRevenueCents`
- `platformShareCents`
- `adminNote`
- `reviewedAt`
- `paidAt`

## 12. 用户中心页面设计

### 12.1 新增导航

用户中心建议新增：

```text
我的分成项目
```

或在“我的交付”之后增加。

### 12.2 分成项目列表

每个项目卡片展示：

- 剧本名称
- 项目状态
- 分成比例
- 授权平台
- 授权账号
- 当前开放集数
- 最近结算周期
- 最近结算状态
- 下一步动作

动作：

- 查看项目
- 提交月度数据
- 查看结算单
- 查看交付内容

### 12.3 项目详情页

内容分区：

- 项目概况
- 授权范围
- 已开放批次
- 月度结算单
- 视频回传记录
- 证明材料
- 平台提示和风险状态

### 12.4 月度数据提交页面

流程：

```text
选择结算周期
填写账号和平台
添加视频数据
上传截图证明
确认声明
提交审核
```

## 13. 后台页面设计

### 13.1 分成项目管理

列表字段：

- 剧本
- 用户
- 项目状态
- 协议状态
- 授权账号
- 当前开放集数
- 分成比例
- 最近结算状态
- 风险状态
- 更新时间

操作：

- 创建项目
- 编辑项目
- 上传协议
- 开放下一批
- 暂停项目
- 终止项目

### 13.2 分成数据审核

列表字段：

- 项目
- 用户
- 周期
- 申报收益
- 申报视频数
- 截图数量
- 状态
- 提交时间

详情页：

- 月度总表
- 视频清单
- 截图材料
- 异常提示
- 审核备注
- 确认收益
- 平台应得
- 状态更新

### 13.3 风险提醒

后台应突出：

- 逾期未提交数据
- 逾期未支付分成
- 缺少截图证明
- 使用未授权账号
- 收益异常偏低
- 项目长期停更
- 待开放下一批

## 14. 状态流转

### 14.1 项目状态

```text
draft -> pending_contract -> active -> paused -> active
active -> completed
active -> terminated
paused -> terminated
```

### 14.2 批次状态

```text
planned -> ready -> released
planned -> locked
locked -> ready
released -> closed
```

### 14.3 结算单状态

```text
draft -> submitted -> reviewing -> confirmed -> paid
submitted -> needs_more_evidence -> submitted
reviewing -> disputed -> reviewing
submitted -> voided
```

## 15. 权限规则

### 15.1 用户权限

用户只能查看：

- 自己的分成项目
- 自己的结算单
- 自己提交的视频和证明材料

用户不能：

- 修改后台确认收益
- 修改分成比例
- 修改项目授权范围
- 查看其他用户项目

### 15.2 管理员权限

管理员可以：

- 创建和编辑分成项目
- 审核结算单
- 修改项目状态
- 开放或锁定批次
- 查看证明材料
- 记录风险事件

后续如有多角色后台，可再拆分：

- 运营
- 财务
- 法务
- 超级管理员

## 16. MVP 实施顺序

### Phase 1：数据库和基础接口

新增：

- `RevenueShareProject`
- `RevenueShareBatch`
- `RevenueShareStatement`
- `RevenueShareVideo`
- `RevenueShareEvidence`

先不做复杂上传和自动结算。

### Phase 2：后台创建分成项目

后台通过版权分成申请时：

- 不再只生成 0 元订单。
- 创建分成项目。
- 创建第一批交付。
- 填写授权账号、分成比例、结算周期。

### Phase 3：用户中心我的分成项目

用户可以：

- 查看分成项目。
- 查看已开放批次。
- 提交月度数据。
- 查看结算状态。

### Phase 4：后台结算审核

管理员可以：

- 查看用户提交的月度数据。
- 审核视频和截图。
- 确认收益。
- 生成平台应得分成。
- 标记已支付。

### Phase 5：分批交付联动

当结算状态正常时：

- 后台开放下一批剧集。
- 系统创建新的 Delivery。
- 用户中心显示新交付内容。

### Phase 6：自动化增强

后续再做：

- 文件上传。
- 截图 OCR。
- 平台数据 API。
- 自动逾期提醒。
- 自动结算单生成。
- 电子签。
- 支付/分账接口。

## 17. 暂不做的功能

MVP 不建议做：

- 自动分账。
- 自动抓取所有平台收益。
- 无合同自动开通分成。
- 一次性交付全部剧本。
- 用户只填总收益就允许结算。
- 不审核截图就开放下一批。
- 复杂成本扣除。
- 多级团队权限。

这些会让系统复杂度过早爆炸。

## 18. 对当前项目的改造结论

当前项目下一轮大改造建议：

```text
把版权分成从 Order 逻辑中拆出来。
```

具体表现：

- 后台通过分成申请时，进入“创建分成项目”表单。
- 用户中心新增“我的分成项目”。
- 交付仍复用 Delivery，但由 RevenueShareBatch 管理。
- 月度收益回传不进入 TestReport，而进入 RevenueShareStatement。
- 结算金额可以生成 Order，也可以先只记录在 Statement。

## 19. 验收标准

版权分成系统 MVP 完成时，应满足：

- 后台可以为分成申请创建项目。
- 项目能记录分成比例、授权账号和结算周期。
- 项目能创建第一批交付。
- 用户能看到自己的分成项目。
- 用户能提交月度视频和收益数据。
- 用户能上传或填写证明材料路径。
- 后台能审核结算单。
- 后台能确认平台应得分成。
- 结算正常后能开放下一批交付。
- 逾期或异常时能暂停项目。

## 20. 下一步建议

下一步可以进入代码前最后一份实施计划：

```text
docs/revenue-share-mvp-implementation-plan.md
```

把数据库迁移、接口、用户中心页面、后台页面拆成可执行的 Phase 1 / Phase 2 / Phase 3 任务。
