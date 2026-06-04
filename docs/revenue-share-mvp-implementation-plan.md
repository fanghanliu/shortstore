# 版权分成 MVP 实施计划

## 1. 文档目标

本文档用于把版权分成系统设计拆成可执行的代码任务。

前置文档：

- `revenue-share-operation-plan.md`
- `revenue-share-agreement-terms.md`
- `revenue-share-data-report-template.md`
- `revenue-share-system-design.md`

本文档只规划 MVP，不做完整自动化分账。

MVP 目标：

```text
后台通过版权分成申请 -> 创建分成项目 -> 开放第一批剧集 -> 用户提交月度视频和收益数据 -> 后台审核结算 -> 再开放下一批剧集
```

## 2. 范围控制

### 2.1 MVP 要做

- 新增分成项目数据模型。
- 后台可从版权分成申请创建分成项目。
- 分成项目可记录授权账号、分成比例、结算周期和协议状态。
- 分成项目可创建第一批交付。
- 用户中心可查看“我的分成项目”。
- 用户可提交月度结算数据。
- 用户可逐条提交视频链接和收益。
- 用户可填写证明材料路径或链接。
- 后台可审核月度结算单。
- 后台可确认收益和平台应得分成。
- 后台可开放下一批交付。
- 后台可暂停或终止分成项目。

### 2.2 MVP 暂不做

- 自动分账。
- 在线电子签。
- 真实文件上传。
- 平台收益 API 接入。
- 截图 OCR。
- 自动抓取播放量。
- 自动识别虚假截图。
- 复杂成本扣除。
- 多角色后台权限。
- 财务发票系统。

这些功能等 MVP 业务跑通后再做。

## 3. 总体实施阶段

建议拆成 6 个阶段：

```text
Phase 1：数据库模型和初始化脚本
Phase 2：后台创建分成项目
Phase 3：用户中心我的分成项目
Phase 4：用户提交月度数据
Phase 5：后台审核结算
Phase 6：分批交付联动
```

每个阶段完成后都要保证现有买断、按集购买、下载、用户中心、后台订单不被破坏。

## 4. Phase 1：数据库模型和初始化脚本

### 4.1 目标

先把版权分成从普通订单中拆出独立数据结构。

### 4.2 修改文件

```text
prisma/schema.prisma
scripts/init-sqlite.js
server.js
scripts/smoke-api.js
```

### 4.3 新增模型

建议一次性新增：

```text
RevenueShareProject
RevenueShareBatch
RevenueShareStatement
RevenueShareVideo
RevenueShareEvidence
```

`RevenueShareEvent` 可暂缓，先用 `adminNote` 和状态字段承接。

### 4.4 模型最小字段

#### RevenueShareProject

```text
id
userId
scriptId
continuationRequestId
status
contractStatus
contractFilePath
shareRatioPlatform
shareRatioUser
settlementCycle
authorizedPlatforms
authorizedAccounts
revenueDefinition
firstEpisodeNumber
currentEpisodeEnd
riskStatus
adminNote
userVisibleNote
startedAt
endedAt
createdAt
updatedAt
```

#### RevenueShareBatch

```text
id
projectId
deliveryId
batchNumber
episodeStart
episodeEnd
status
releaseCondition
lockedReason
releasedAt
createdAt
updatedAt
```

#### RevenueShareStatement

```text
id
projectId
userId
scriptId
periodStart
periodEnd
status
reportedRevenueCents
confirmedRevenueCents
platformShareRatio
platformShareCents
userShareCents
videoCount
evidenceCount
userNote
adminNote
submittedAt
reviewedAt
paidAt
createdAt
updatedAt
```

#### RevenueShareVideo

```text
id
projectId
statementId
batchId
episodeNumber
title
videoUrl
platform
accountName
publishedAt
viewCount
likeCount
commentCount
reportedRevenueCents
revenueType
status
note
adminNote
createdAt
updatedAt
```

#### RevenueShareEvidence

```text
id
projectId
statementId
videoId
evidenceType
filePath
originalFileName
uploadedBy
reviewStatus
adminNote
createdAt
```

### 4.5 后端辅助函数

新增：

- `toRevenueShareProjectResponse`
- `toAdminRevenueShareProjectResponse`
- `toRevenueShareStatementResponse`
- `parseJsonList` 复用现有函数
- `parseMoneyCents` 复用现有函数

### 4.6 验收标准

- `npm.cmd run db:generate` 通过。
- `npm.cmd run db:init` 通过。
- `node --check server.js` 通过。
- `npm.cmd run test:api` 通过。
- 不影响现有 `Order`、`Delivery`、`ContinuationRequest`。

## 5. Phase 2：后台创建分成项目

### 5.1 目标

当后台处理版权分成申请时，不再只是生成 0 元订单，而是创建 `RevenueShareProject`。

### 5.2 修改文件

```text
server.js
public/admin/index.html
public/admin/admin.js
public/admin/admin.css
scripts/smoke-api.js
```

### 5.3 后台接口

新增：

```text
POST /api/admin/revenue-share-projects
GET /api/admin/revenue-share-projects
GET /api/admin/revenue-share-projects/:id
PATCH /api/admin/revenue-share-projects/:id
```

### 5.4 创建项目请求字段

```text
continuationRequestId
shareRatioPlatform
authorizedPlatforms
authorizedAccounts
settlementCycle
contractStatus
contractFilePath
firstBatchEpisodeStart
firstBatchEpisodeEnd
userVisibleNote
adminNote
```

### 5.5 创建项目时自动做的事

后台创建项目时：

1. 校验来源申请必须是 `revenue_share`。
2. 校验申请状态应为 `approved` 或同时更新为 `approved`。
3. 创建 `RevenueShareProject`。
4. 创建第一批 `RevenueShareBatch`。
5. 创建一条 `Delivery`。
6. 创建交付资源路径。
7. 用户中心可看到分成项目和交付内容。

### 5.6 后台表单

版权分成申请通过时，后台表单应不同于买断和按集。

必填：

- 平台分成比例
- 用户分成比例
- 授权平台
- 授权账号
- 结算周期
- 第一批起始集
- 第一批结束集
- 协议状态
- 协议文件路径或备注

### 5.7 验收标准

- 后台处理分成申请时能创建分成项目。
- 项目列表能看到新项目。
- 用户中心后续能读取该项目。
- 第一批交付能出现在用户“我的交付”中。
- 买断和按集购买审批不受影响。

## 6. Phase 3：用户中心我的分成项目

### 6.1 目标

用户能看到自己的版权分成项目，不再只看到 0 元订单。

### 6.2 修改文件

```text
server.js
public/site/account.html
public/site/account.js
public/site/styles.css
```

### 6.3 用户接口

新增：

```text
GET /api/me/revenue-share-projects
GET /api/me/revenue-share-projects/:id
```

### 6.4 用户中心新增区域

建议新增 tab：

```text
我的分成项目
```

卡片展示：

- 剧本名称
- 项目状态
- 协议状态
- 平台分成比例
- 授权平台
- 授权账号
- 当前开放到第几集
- 最近结算状态
- 下一步动作

### 6.5 项目详情 MVP

MVP 可以先不做独立详情页，在用户中心卡片中展示：

- 已开放批次
- 结算单列表
- 提交月度数据按钮

后续再做独立详情页。

### 6.6 验收标准

- 用户登录后能看到自己的分成项目。
- 用户看不到其他人的分成项目。
- 用户能看到分成比例、授权账号和当前开放集数。
- 用户能进入提交月度数据流程。

## 7. Phase 4：用户提交月度数据

### 7.1 目标

用户可以按月提交视频链接、收益数据和证明材料路径。

### 7.2 修改文件

```text
server.js
public/site/account.html
public/site/account.js
public/site/styles.css
scripts/smoke-api.js
```

### 7.3 用户接口

新增：

```text
POST /api/me/revenue-share-projects/:id/statements
GET /api/me/revenue-share-statements/:id
POST /api/me/revenue-share-statements/:id/videos
POST /api/me/revenue-share-statements/:id/evidence
POST /api/me/revenue-share-statements/:id/submit
```

### 7.4 MVP 表单设计

建议先做一个页面内表单：

1. 选择项目。
2. 填写结算周期。
3. 添加视频记录。
4. 填写申报收益。
5. 填写证明材料路径或链接。
6. 勾选确认声明。
7. 提交审核。

### 7.5 MVP 简化方案

为降低复杂度，第一版可以：

- 不做动态多视频复杂表单。
- 先允许用户提交一个结算单和若干视频。
- 证明材料用文本路径或外部链接。
- 后续再做真实文件上传。

### 7.6 后端校验

必须校验：

- 项目属于当前用户。
- 项目状态为 `active`。
- 结算周期合法。
- 视频对应剧集在已开放批次内。
- 视频平台和账号在授权范围内。
- 提交前至少有一条视频记录。
- 提交前至少有一条证明材料。

### 7.7 验收标准

- 用户能创建月度结算单。
- 用户能添加视频数据。
- 用户能添加证明材料路径。
- 用户能提交结算单。
- 提交后状态为 `submitted`。
- 后台能看到该结算单。

## 8. Phase 5：后台审核结算

### 8.1 目标

管理员能审核用户提交的分成数据，确认收益和平台应得分成。

### 8.2 修改文件

```text
server.js
public/admin/index.html
public/admin/admin.js
public/admin/admin.css
scripts/smoke-api.js
```

### 8.3 后台接口

新增：

```text
GET /api/admin/revenue-share-statements
GET /api/admin/revenue-share-statements/:id
PATCH /api/admin/revenue-share-statements/:id
```

### 8.4 后台列表

显示：

- 项目
- 用户
- 剧本
- 结算周期
- 申报收益
- 视频数量
- 证明材料数量
- 状态
- 提交时间

### 8.5 后台审核表单

管理员可填写：

- 平台确认收益
- 平台应得分成
- 用户保留收益
- 审核备注
- 状态

状态操作：

- `reviewing`
- `needs_more_evidence`
- `confirmed`
- `disputed`
- `paid`
- `voided`

### 8.6 结算计算

MVP 可以自动根据比例计算：

```text
platformShareCents = confirmedRevenueCents * shareRatioPlatform / 100
userShareCents = confirmedRevenueCents - platformShareCents
```

管理员仍可人工确认。

### 8.7 验收标准

- 后台能看到用户提交的结算单。
- 后台能查看视频和证明材料。
- 后台能确认收益。
- 后台能标记已支付。
- 用户中心能看到结算状态变化。

## 9. Phase 6：分批交付联动

### 9.1 目标

结算正常后，后台可以开放下一批剧集。

### 9.2 修改文件

```text
server.js
public/admin/admin.js
public/site/account.js
scripts/smoke-api.js
```

### 9.3 后台接口

新增：

```text
POST /api/admin/revenue-share-projects/:id/batches
PATCH /api/admin/revenue-share-batches/:id
```

### 9.4 开放下一批请求字段

```text
episodeStart
episodeEnd
deliveryTitle
deliveryNote
assetTitle
assetPath
```

### 9.5 自动动作

开放下一批时：

1. 创建 `RevenueShareBatch`。
2. 创建 `Delivery`。
3. 创建 `DeliveryAsset`。
4. 更新项目 `currentEpisodeEnd`。
5. 用户中心显示新交付。

### 9.6 验收标准

- 后台可以创建下一批。
- 用户可以看到新交付。
- 用户只能提交已开放批次内的视频数据。
- 项目当前开放集数更新。

## 10. 现有流程改造点

### 10.1 后台审批合作申请

当前：

```text
版权分成 -> 0 元订单 -> 交付
```

改为：

```text
版权分成 -> 创建分成项目 -> 第一批交付
```

买断和按集购买保持：

```text
审批 -> 订单 -> 付款 -> 交付
```

### 10.2 用户中心合作申请

用户申请版权分成后：

- 审核前显示在“后续合作申请”。
- 审核通过后显示在“我的分成项目”。
- 后续月度数据不再走“测试反馈”，而走“分成项目数据回传”。

### 10.3 订单系统

版权分成相关订单只在以下情况生成：

- 保底费用。
- 保证金。
- 用户应支付的平台分成。
- 违约金或补款。

MVP 第一版可以先不生成结算订单，只在 `RevenueShareStatement` 中记录 `paid`。

## 11. 测试计划

### 11.1 API 冒烟测试新增流程

在 `scripts/smoke-api.js` 中新增：

1. 用户下载剧本。
2. 用户提交测试反馈。
3. 用户提交版权分成申请。
4. 管理员创建分成项目。
5. 用户读取分成项目。
6. 用户创建月度结算单。
7. 用户添加视频记录。
8. 用户添加证明材料。
9. 用户提交结算单。
10. 管理员确认收益。
11. 管理员标记已支付。
12. 管理员开放下一批交付。
13. 用户读取新交付。

### 11.2 回归测试

每个阶段都要确认：

- 免费下载不受影响。
- 测试反馈不受影响。
- 买断申请不受影响。
- 按集购买不受影响。
- 订单支付确认不受影响。
- 普通交付不受影响。
- 后台权限不受影响。

## 12. 风险点

### 12.1 范围膨胀

版权分成很容易变成完整财务系统。

控制方式：

- 第一版只做人工审核。
- 第一版不做真实文件上传。
- 第一版不做自动支付。
- 第一版不做复杂成本扣除。

### 12.2 数据可信度不足

用户提交的数据可能不真实。

控制方式：

- 必须上传截图或证明链接。
- 后台可要求补充材料。
- 争议状态不开放下一批交付。
- 合同中约定虚假数据违约责任。

### 12.3 交付泄露风险

分成模式下平台先给内容，风险较高。

控制方式：

- 默认分批交付。
- 未结算不开放下一批。
- 异常项目可暂停。
- 合同中约定不得转售和转授权。

## 13. 推荐第一轮代码范围

正式进入代码时，建议第一轮只做：

```text
Phase 1 + Phase 2
```

也就是：

- 新增数据库模型。
- 新增后台创建分成项目接口。
- 后台通过版权分成申请时创建分成项目。
- 创建第一批交付。
- 用户中心暂时只读分成项目。

不要第一轮就做完整月度结算。

原因：

- 先让“版权分成不再是 0 元订单”这个核心结构落地。
- 确认数据模型没有问题。
- 确认后台和用户中心能看到分成项目。
- 再进入数据回传和结算审核会更稳。

## 14. 完成定义

版权分成 MVP 完成时，应满足：

- 分成申请通过后会创建分成项目。
- 分成项目有协议状态、授权账号、分成比例和批次。
- 用户中心能看到分成项目。
- 用户能提交月度数据。
- 后台能审核月度数据。
- 后台能确认分成金额。
- 后台能开放下一批交付。
- 系统能阻止未开放剧集的数据提交。
- 系统能暂停异常项目。

## 15. 下一步建议

下一步可以正式进入代码前的最后确认：

```text
先执行 Phase 1 + Phase 2
```

也就是先做数据库模型、接口骨架、后台创建分成项目和第一批交付。

在进入代码前，建议先确认一个产品决策：

```text
版权分成第一批默认开放第4-10集，还是后台手动填写起止集？
```

我的建议是：后台默认填第4-10集，但允许管理员修改。
