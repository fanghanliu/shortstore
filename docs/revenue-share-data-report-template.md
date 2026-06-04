# 版权分成数据回传模板与审核标准

## 1. 文档目标

本文档用于定义版权分成合作中，用户每月需要回传哪些视频数据、收益数据和证明材料，以及后台如何审核这些数据。

它承接两份前置文档：

- `revenue-share-operation-plan.md`：定义版权分成整体运营流程。
- `revenue-share-agreement-terms.md`：定义分成协议必须写清楚的条款。

本文档解决的问题是：

```text
用户说这个月赚了多少钱，平台凭什么相信？
平台如何把用户提交的数据变成可审核、可结算、可追溯的记录？
```

## 2. 基本原则

### 2.1 每月回传

默认采用自然月结算。

建议节奏：

```text
每月 1-5 日：用户提交上月数据
每月 6-10 日：平台审核
每月 11-15 日：双方确认并完成分成结算
```

### 2.2 一条视频一条记录

用户不能只填一个总收益数字，必须按视频逐条提交。

每条视频至少要能回答：

- 哪部剧本？
- 哪一集？
- 发在哪个平台？
- 发在哪个账号？
- 视频链接是什么？
- 播放量是多少？
- 收益是多少？
- 有什么截图能证明？

### 2.3 收益截图必须和视频链接对应

收益证明不能只是一张总收益截图。平台需要知道这笔收益是否来自授权剧本视频。

如果平台后台只能显示账号总收益，用户需要额外说明：

- 本月该账号所有相关视频列表。
- 其中哪些视频属于授权剧本。
- 授权剧本视频收益如何计算。
- 是否存在其他视频收益混入。

### 2.4 系统记录，人工审核

MVP 阶段不建议承诺自动分账。

系统负责：

- 收集数据。
- 保存截图。
- 标记审核状态。
- 生成结算单。
- 留存操作记录。

人工负责：

- 判断截图真实性。
- 判断收益归属。
- 判断是否存在异常。
- 确认最终结算金额。

## 3. 用户月度回传总表

用户每月应先提交一张月度总表。

### 3.1 基础信息

| 字段 | 是否必填 | 说明 |
| --- | --- | --- |
| 分成项目 | 必填 | 对应哪部剧本的分成合作 |
| 结算周期开始 | 必填 | 例如 2026-06-01 |
| 结算周期结束 | 必填 | 例如 2026-06-30 |
| 发布平台 | 必填 | 抖音、快手、视频号、TikTok 等 |
| 发布账号 | 必填 | 必须是协议登记账号 |
| 本月发布视频数 | 必填 | 授权剧本相关视频数量 |
| 本月总播放量 | 必填 | 授权剧本相关视频总播放量 |
| 本月申报收益 | 必填 | 用户申报的授权剧本相关收益 |
| 是否包含投流 | 必填 | 是 / 否 |
| 是否包含带货 | 必填 | 是 / 否 |
| 是否包含付费解锁 | 必填 | 是 / 否 |
| 用户备注 | 可选 | 说明异常情况、平台延迟结算等 |

### 3.2 用户确认声明

每次提交时，用户应确认：

```text
我确认本次提交的视频链接、播放数据、收益金额和截图材料真实、完整，未故意隐瞒、拆分、转移或混入与本剧本无关的收益。
```

后台字段建议：

```text
statement.projectId
statement.periodStart
statement.periodEnd
statement.platform
statement.accountName
statement.videoCount
statement.reportedViewCount
statement.reportedRevenueCents
statement.includesPaidTraffic
statement.includesCommerce
statement.includesPaidUnlock
statement.userNote
statement.userConfirmedAt
```

## 4. 单条视频回传字段

每条视频一条记录。

| 字段 | 是否必填 | 说明 |
| --- | --- | --- |
| 剧集编号 | 必填 | 例如第4集 |
| 视频标题 | 必填 | 平台展示标题 |
| 视频链接 | 必填 | 可公开访问或平台后台链接 |
| 发布平台 | 必填 | 必须在授权平台内 |
| 发布账号 | 必填 | 必须在授权账号内 |
| 发布时间 | 必填 | 视频发布时间 |
| 播放量 | 必填 | 截至回传时播放量 |
| 点赞量 | 建议必填 | 用于判断内容表现 |
| 评论量 | 建议必填 | 用于判断互动 |
| 收藏量 | 可选 | 平台支持则填写 |
| 转发量 | 可选 | 平台支持则填写 |
| 完播率 | 可选 | 平台支持则填写 |
| 视频收益 | 必填 | 该视频对应收益 |
| 收益类型 | 必填 | 广告、创作者激励、付费解锁、带货等 |
| 是否投流 | 必填 | 是 / 否 |
| 投流金额 | 条件必填 | 如果投流则填写 |
| 备注 | 可选 | 平台异常、视频下架、数据延迟等 |

后台字段建议：

```text
video.statementId
video.projectId
video.episodeNumber
video.title
video.videoUrl
video.platform
video.accountName
video.publishedAt
video.viewCount
video.likeCount
video.commentCount
video.favoriteCount
video.shareCount
video.completionRate
video.reportedRevenueCents
video.revenueType
video.hasPaidTraffic
video.paidTrafficCents
video.note
```

## 5. 截图和证明材料

截图是分成合作中最重要的证据之一。

### 5.1 必传截图

每月必须上传：

| 截图类型 | 说明 |
| --- | --- |
| 视频列表截图 | 展示本月相关视频列表、标题、发布时间 |
| 单条视频数据截图 | 展示播放、点赞、评论等数据 |
| 收益后台截图 | 展示本月收益或单条视频收益 |
| 结算/提现截图 | 如平台已结算或能提现，需要上传 |
| 账号主页截图 | 用于确认发布账号与协议一致 |

### 5.2 条件必传截图

满足条件时需要上传：

| 场景 | 需要材料 |
| --- | --- |
| 投流 | 投流后台截图、投流金额、投流时间 |
| 带货 | 商品佣金后台截图、订单归因说明 |
| 付费解锁 | 付费订单或平台结算截图 |
| 多平台发布 | 每个平台单独上传后台截图 |
| 视频下架 | 下架通知截图、原因说明 |
| 收益延迟 | 平台结算周期说明截图 |

### 5.3 截图要求

截图应尽量包含：

- 平台名称。
- 账号名称。
- 视频标题或链接。
- 时间范围。
- 播放量或收益数字。
- 截图时间。

不建议接受：

- 被大面积打码到无法核验的截图。
- 只截数字、不截账号和平台的截图。
- 无法对应视频链接的收益截图。
- 明显拼接、裁切过度或分辨率过低的截图。

后台字段建议：

```text
evidence.statementId
evidence.videoId
evidence.evidenceType
evidence.filePath
evidence.originalFileName
evidence.uploadedBy
evidence.uploadedAt
evidence.reviewStatus
```

## 6. 收益类型分类

用户提交收益时，必须选择收益类型。

建议枚举：

| 类型 | 说明 | 默认是否纳入分成 |
| --- | --- | --- |
| `platform_ad` | 平台广告收益 | 是 |
| `creator_incentive` | 创作者激励 | 是 |
| `paid_unlock` | 付费解锁收益 | 是 |
| `commerce` | 带货佣金 | 视协议 |
| `brand_deal` | 商单合作 | 视协议 |
| `live_stream` | 直播收益 | 视协议 |
| `private_domain` | 私域转化 | 视协议 |
| `other` | 其他收益 | 需说明 |

如果某类收益未在协议中约定，后台应标记为“需人工确认”，不要自动纳入结算。

## 7. 后台审核标准

### 7.1 完整性审核

检查：

- 是否提交月度总表。
- 是否逐条提交视频。
- 每条视频是否有链接。
- 每条视频是否填写对应集数。
- 是否上传必传截图。
- 收益截图是否覆盖结算周期。
- 是否填写用户确认声明。

缺失关键材料时，状态应为：

```text
needs_more_evidence
```

### 7.2 授权范围审核

检查：

- 平台是否在授权范围内。
- 账号是否在授权账号列表中。
- 视频是否对应授权剧集。
- 是否使用了未交付剧集。
- 是否出现未授权矩阵账号。

如果超出授权范围，应标记为异常。

### 7.3 数据一致性审核

检查：

- 视频链接里的播放量与截图是否接近。
- 用户填写播放量与截图是否一致。
- 收益截图时间范围是否匹配。
- 视频标题和截图标题是否对应。
- 多个平台收益是否被重复计算。
- 账号总收益是否混入无关视频收益。

### 7.4 异常风险审核

重点关注：

- 播放量很高但收益为 0。
- 收益截图只截数字，不显示账号和平台。
- 多条视频使用同一张收益截图。
- 视频链接无法打开。
- 发布账号与协议不一致。
- 用户回传的视频集数超过授权批次。
- 用户长期不提交截图，只填自报数字。
- 用户申报收益明显低于平台常识区间。

异常时可要求补充：

- 录屏证明。
- 更完整后台截图。
- 平台收益明细。
- 提现记录。
- 账号后台临时只读权限。

## 8. 审核状态设计

月度结算单建议状态：

| 状态 | 含义 |
| --- | --- |
| `draft` | 用户正在填写 |
| `submitted` | 用户已提交 |
| `needs_more_evidence` | 需要补充材料 |
| `reviewing` | 平台审核中 |
| `confirmed` | 平台确认收益和分成 |
| `disputed` | 双方对数据或金额有争议 |
| `paid` | 用户已完成分成支付 |
| `voided` | 作废 |

单条视频建议状态：

| 状态 | 含义 |
| --- | --- |
| `submitted` | 已提交 |
| `verified` | 已核验 |
| `needs_evidence` | 缺少证明 |
| `invalid` | 无效视频 |
| `disputed` | 存在争议 |

截图材料建议状态：

| 状态 | 含义 |
| --- | --- |
| `pending` | 待审核 |
| `accepted` | 已采纳 |
| `rejected` | 不采纳 |
| `needs_clearer_version` | 需要更清晰版本 |

## 9. 分成计算模板

### 9.1 基础公式

```text
有效收益 = 平台确认的授权剧本相关收益
平台应得 = 有效收益 × 平台分成比例
用户保留 = 有效收益 - 平台应得
```

### 9.2 示例

```text
结算周期：2026-06-01 至 2026-06-30
授权剧本：《她闻到谎言》
有效收益：¥12,000
平台分成比例：30%
平台应得：¥3,600
用户保留：¥8,400
```

### 9.3 成本扣除

MVP 阶段建议默认不扣除成本。

如果协议允许扣除，应记录：

- 成本类型。
- 成本金额。
- 成本凭证。
- 是否平台确认。
- 扣除前收益。
- 扣除后收益。

字段建议：

```text
statement.reportedRevenueCents
statement.confirmedRevenueCents
statement.deductibleCostCents
statement.netRevenueCents
statement.platformShareRatio
statement.platformShareCents
statement.userShareCents
```

## 10. 用户提交页面建议

用户中心后续可以增加“我的分成项目”。

用户进入某个分成项目后，应看到：

- 项目剧本。
- 授权平台。
- 授权账号。
- 当前开放剧集。
- 本月是否已提交数据。
- 上月结算状态。
- 下一批交付条件。

### 10.1 月度数据提交表单

建议分四步：

```text
步骤1：填写结算周期和平台账号
步骤2：逐条添加视频链接和数据
步骤3：上传收益截图和证明材料
步骤4：确认声明并提交
```

### 10.2 用户端提示文案

建议提示：

```text
请按视频逐条提交数据。若平台后台只能展示账号总收益，请上传完整后台截图，并说明本剧本视频收益如何计算。平台审核通过后会生成本月结算金额。
```

## 11. 后台审核页面建议

后台需要一个“分成数据审核”页面。

列表字段：

- 项目名称
- 用户
- 剧本
- 结算周期
- 申报收益
- 申报视频数
- 截图数量
- 审核状态
- 提交时间

详情页字段：

- 月度总表
- 视频清单
- 截图材料
- 异常提示
- 审核备注
- 平台确认收益
- 平台应得分成
- 状态操作

后台操作：

- 通过审核。
- 要求补充材料。
- 标记争议。
- 作废。
- 确认结算金额。
- 标记已支付。
- 解锁下一批交付。

## 12. 异常处理规则

### 12.1 缺少材料

处理：

```text
状态改为 needs_more_evidence
填写需要补充的材料
暂停确认结算
不开放下一批剧集
```

### 12.2 数据争议

处理：

```text
状态改为 disputed
记录争议原因
要求用户补充证明
必要时暂停交付
```

### 12.3 逾期未提交

处理：

```text
系统提醒
后台标记逾期
暂停下一批交付
连续逾期可终止项目
```

### 12.4 疑似虚报或漏报

处理：

```text
要求补充完整后台截图或录屏
必要时要求只读后台权限
暂停交付
记录风险事件
严重时终止授权
```

## 13. 最小可用字段清单

如果进入代码阶段，MVP 至少需要以下字段。

### 13.1 月度结算单

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

### 13.2 视频数据

```text
id
statementId
projectId
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
createdAt
updatedAt
```

### 13.3 证明材料

```text
id
statementId
videoId
evidenceType
filePath
originalFileName
reviewStatus
adminNote
uploadedAt
```

## 14. MVP 不建议做的事

早期不建议直接做：

- 自动分账。
- 自动识别所有平台收益。
- 完全依赖用户自填收益。
- 用户无合同直接开放分成。
- 一次性交付全部剧本。
- 没有截图证明就确认结算。
- 没有审核就开放下一批剧集。

这些都会把业务风险提前放大。

## 15. 下一步建议

下一步可以写：

```text
docs/revenue-share-system-design.md
```

把前面三份文档收束成数据库模型、接口、用户中心页面和后台页面规划。

建议先规划，不急着代码落地。因为版权分成涉及的对象已经不只是订单，而是一整套项目管理系统。
