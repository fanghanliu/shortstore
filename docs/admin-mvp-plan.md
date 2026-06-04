# 后台管理系统 MVP 规划

## 1. 文档目标

这份文档用于规划后台管理系统第一版。

当前用户端已经完成核心业务链路：

```text
剧本库 → 剧本详情 → 下载前三集 → 注册/登录 → 用户中心 → 测试反馈 → 后续合作申请
```

现在平台开始产生运营数据：

- 哪些剧本被下载。
- 哪些用户注册了账号。
- 用户提交了哪些测试反馈。
- 用户申请了哪种后续合作。
- 哪些剧本值得继续生产、售卖或开放分成。

后台管理系统的第一版目标不是做复杂后台，而是让运营者能看见这些数据，并处理最关键的状态。

## 2. 当前基础

### 2.1 当前目录

后台静态目录已经预留：

```text
public/admin/
  index.html
  admin.css
  admin.js
```

后台访问路径：

```text
/admin/
```

### 2.2 当前数据模型

已有核心模型：

| 模型 | 用途 |
| --- | --- |
| `User` | 注册用户 |
| `Script` | 剧本主信息 |
| `ScriptAsset` | 免费包、完整包等资源 |
| `ScriptEpisode` | 前三集内容摘要和提示词 |
| `Download` | 下载记录 |
| `TestReport` | 用户提交的测试视频数据 |
| `ContinuationRequest` | 买断、按集、分成合作申请 |
| `ContinuationOption` | 每套剧本开放的续作方式 |

这些已经足够支撑后台 MVP。

## 3. 后台 MVP 定位

后台第一版只解决四件事：

```text
看见数据
筛选数据
处理状态
回到用户/剧本上下文
```

也就是：

- 看剧本列表和剧本状态。
- 看用户下载记录。
- 看测试反馈数据。
- 看后续合作申请。
- 修改申请状态。
- 修改测试反馈审核状态。
- 必要时修改剧本上下架状态。

## 4. 暂不做的能力

第一版不做：

- 在线支付管理。
- 订单系统。
- 分成结算。
- 自动抓取视频平台数据。
- 多管理员角色。
- 操作审计日志。
- 文件上传后台。
- 富文本剧本编辑器。
- 数据大屏。
- 复杂图表。
- 邮件/短信通知。

这些以后会需要，但不是后台 MVP 的第一优先级。

## 5. 后台访问和权限

### 5.1 登录方式

后台第一版复用当前账号系统：

```text
邮箱 + 密码 + HTTP-only Cookie
```

不单独做后台登录页。

如果未登录访问 `/admin/`：

```text
跳转 /auth.html?mode=login&next=/admin/
```

### 5.2 管理员判断

当前 `User` 已有字段：

```text
role
```

建议第一版使用：

```text
role = admin
```

判断管理员。

普通用户访问后台 API：

```text
403 Forbidden
```

普通用户访问后台页面：

```text
显示无权限提示或跳回用户中心
```

### 5.3 临时管理员创建方式

第一版可以先通过脚本或 Prisma Studio 手动把某个用户改成：

```text
role = admin
```

暂不做后台创建管理员。

后续可以补：

```text
scripts/make-admin.js
```

用于把指定邮箱提升为管理员。

## 6. 后台页面结构

建议后台第一版使用一个页面应用：

```text
public/admin/index.html
public/admin/admin.css
public/admin/admin.js
```

页面内部用 Tab 或侧边栏切换：

```text
概览
剧本
用户
下载
测试反馈
合作申请
```

### 6.1 概览

展示核心数字：

| 指标 | 来源 |
| --- | --- |
| 已发布剧本数 | `Script.status = published` |
| 注册用户数 | `User` |
| 下载总数 | `Download` |
| 测试反馈数 | `TestReport` |
| 待处理合作申请数 | `ContinuationRequest.status = submitted` |

第一版只需要数字卡片，不需要图表。

### 6.2 剧本管理

第一版展示：

| 字段 | 说明 |
| --- | --- |
| 标题 | `Script.title` |
| slug | `Script.slug` |
| 题材 | `Script.category` |
| 状态 | `Script.status` |
| 是否主推 | `Script.featured` |
| 总集数 | `Script.episodeCount` |
| 免费集数 | `Script.freeEpisodeCount` |
| 下载数 | 聚合 `Download` |
| 测试反馈数 | 聚合 `TestReport` |
| 合作申请数 | 聚合 `ContinuationRequest` |

第一版可操作：

- 改剧本状态：`draft / published / archived`
- 改是否主推：`featured true/false`

暂不做：

- 在线编辑完整剧本内容。
- 上传封面。
- 上传文件。
- 修改前三集正文。

这些后续再做。

### 6.3 用户管理

展示：

| 字段 | 说明 |
| --- | --- |
| 邮箱 | `User.email` |
| 昵称 | `User.displayName` |
| 微信 | `User.contactWechat` |
| 手机 | `User.contactPhone` |
| 角色 | `User.role` |
| 状态 | `User.status` |
| 下载数 | 聚合 `Download` |
| 测试反馈数 | 聚合 `TestReport` |
| 合作申请数 | 聚合 `ContinuationRequest` |
| 注册时间 | `User.createdAt` |

第一版可操作：

- 禁用/启用用户：`status = disabled / active`

暂不做：

- 修改密码。
- 删除用户。
- 复杂用户画像。

### 6.4 下载记录

展示：

| 字段 | 说明 |
| --- | --- |
| 剧本 | `Download.script.title` |
| 用户 | `Download.user.email` 或游客 |
| 资源 | `Download.asset.title` |
| visitorId | 游客标识 |
| IP | `Download.ipAddress` |
| 来源 | `Download.referrer` |
| 授权确认 | `licenseConfirmed` |
| 下载时间 | `createdAt` |

第一版只读，不做修改。

用途：

- 判断剧本热度。
- 识别重复下载。
- 追踪免费包转化。

### 6.5 测试反馈

展示：

| 字段 | 说明 |
| --- | --- |
| 剧本 | `TestReport.script.title` |
| 用户 | `TestReport.user.email` |
| 平台 | `platform` |
| 视频链接 | `videoUrl` |
| 播放 | `viewCount` |
| 点赞 | `likeCount` |
| 评论 | `commentCount` |
| 涨粉 | `followerDelta` |
| 发布时间 | `publishTime` |
| 状态 | `status` |
| 提交时间 | `createdAt` |

建议状态：

```text
submitted
reviewed
valuable
not_valuable
invalid
```

第一版可操作：

- 修改反馈状态。

用途：

- 找出高潜力剧本。
- 判断用户是否适合分成合作。
- 辅助后续买断/按集报价。

### 6.6 合作申请

展示：

| 字段 | 说明 |
| --- | --- |
| 剧本 | `ContinuationRequest.script.title` |
| 用户 | `ContinuationRequest.user.email` |
| 类型 | `buyout / pay_per_episode / revenue_share` |
| 集数范围 | `episodeRange` |
| 联系方式偏好 | `contactPreference` |
| 申请说明 | `message` |
| 是否关联测试反馈 | `testReportId` |
| 状态 | `status` |
| 提交时间 | `createdAt` |

建议状态：

```text
submitted
contacted
approved
rejected
closed
```

第一版可操作：

- 修改申请状态。

用途：

- 跟进商业合作。
- 区分未处理、已联系、已通过、已拒绝。
- 后续接订单或人工沟通。

## 7. 后台 API 规划

所有后台 API 使用：

```text
/api/admin/...
```

并要求：

```text
requireAdmin
```

### 7.1 管理员身份

```text
GET /api/admin/me
```

用途：

- 后台页面加载时确认当前用户是不是管理员。

返回：

```json
{
  "user": {
    "id": "user_xxx",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### 7.2 概览

```text
GET /api/admin/overview
```

返回：

```json
{
  "publishedScriptCount": 4,
  "userCount": 10,
  "downloadCount": 36,
  "testReportCount": 8,
  "pendingContinuationRequestCount": 3
}
```

### 7.3 剧本管理

```text
GET /api/admin/scripts
PATCH /api/admin/scripts/:id
```

第一版 `PATCH` 只允许修改：

```text
status
featured
```

### 7.4 用户管理

```text
GET /api/admin/users
PATCH /api/admin/users/:id
```

第一版 `PATCH` 只允许修改：

```text
status
role
```

注意：是否允许后台修改 `role` 要谨慎。第一版可以只允许修改 `status`，管理员提升通过脚本做。

### 7.5 下载记录

```text
GET /api/admin/downloads
```

第一版只读。

支持查询参数：

```text
scriptId
userId
visitorId
page
pageSize
```

### 7.6 测试反馈

```text
GET /api/admin/test-reports
PATCH /api/admin/test-reports/:id
```

第一版 `PATCH` 只允许修改：

```text
status
```

### 7.7 合作申请

```text
GET /api/admin/continuation-requests
PATCH /api/admin/continuation-requests/:id
```

第一版 `PATCH` 只允许修改：

```text
status
```

## 8. 后端权限设计

### 8.1 requireAdmin

基于当前已有 `requireAuth`，新增：

```js
async function requireAdmin(request, response, next) {
  await requireAuth(...);
  if (request.currentUser.role !== "admin") {
    response.status(403).json({ error: "Admin permission required" });
    return;
  }
  next();
}
```

实现时建议不要直接嵌套调用 `requireAuth`，可以抽出：

```text
attachCurrentUser
requireAuth
requireAdmin
```

但第一版为了控制范围，也可以保持简单。

### 8.2 后台页面权限

后台静态页面本身可以被访问。

但页面加载后必须调用：

```text
GET /api/admin/me
```

如果返回 401：

```text
跳转 /auth.html?mode=login&next=/admin/
```

如果返回 403：

```text
显示无权限提示
```

真正的数据接口必须由后端保护，不能只靠前端隐藏。

## 9. 前端后台结构

第一版文件：

```text
public/admin/index.html
public/admin/admin.css
public/admin/admin.js
```

页面结构建议：

```text
顶部栏：后台管理 / 当前管理员 / 返回用户端
侧边栏或标签栏：概览 / 剧本 / 用户 / 下载 / 测试反馈 / 合作申请
主内容区：表格 + 状态操作
```

因为后台是工作工具，不建议做营销式大页面。

设计原则：

- 信息密度高。
- 表格清楚。
- 状态颜色克制。
- 操作按钮少而明确。
- 每个 Tab 只做一个业务对象。

## 10. 数据展示优先级

第一版后台最优先：

1. 合作申请
2. 测试反馈
3. 下载记录
4. 剧本状态
5. 用户列表
6. 概览统计

原因：

- 合作申请最接近收入。
- 测试反馈决定剧本是否值得继续。
- 下载记录决定剧本热度。
- 剧本和用户管理先做基础操作即可。

## 11. 实施阶段

### Phase 1：后台权限和概览

目标：

```text
管理员能进入 /admin/，普通用户不能看后台数据。
```

任务：

- 新增 `requireAdmin`
- 新增 `GET /api/admin/me`
- 新增 `GET /api/admin/overview`
- 改造后台占位页为后台工作台框架

### Phase 2：合作申请管理

目标：

```text
管理员能查看并处理后续合作申请。
```

任务：

- `GET /api/admin/continuation-requests`
- `PATCH /api/admin/continuation-requests/:id`
- 后台表格展示申请
- 支持修改状态

### Phase 3：测试反馈管理

目标：

```text
管理员能查看测试数据并标记价值。
```

任务：

- `GET /api/admin/test-reports`
- `PATCH /api/admin/test-reports/:id`
- 后台展示播放、点赞、评论、涨粉
- 支持修改状态

### Phase 4：下载和用户管理

目标：

```text
管理员能查看下载热度和用户基础信息。
```

任务：

- `GET /api/admin/downloads`
- `GET /api/admin/users`
- 可选：禁用用户

### Phase 5：剧本状态管理

目标：

```text
管理员能上下架剧本和设置主推。
```

任务：

- `GET /api/admin/scripts`
- `PATCH /api/admin/scripts/:id`
- 支持修改 `status` 和 `featured`

## 12. 验收标准

后台 MVP 第一版完成后，应满足：

- 普通用户不能读取 `/api/admin/...` 数据。
- 管理员能进入 `/admin/`。
- 后台能显示概览统计。
- 后台能查看合作申请。
- 后台能修改合作申请状态。
- 后台能查看测试反馈。
- 后台能修改测试反馈状态。
- 后台能查看下载记录。
- 后台能查看用户列表。
- 后台能查看剧本列表。
- 用户端现有链路不受影响。
- `npm.cmd run test:api` 继续通过。

## 13. 风险点

### 13.1 只做前端隐藏是不安全的

后台数据接口必须由后端 `requireAdmin` 保护。

不要只靠前端判断用户角色。

### 13.2 管理员初始化

当前没有创建管理员入口。

第一版必须明确怎么设置第一个管理员：

- Prisma Studio 手动改。
- 或新增 `scripts/make-admin.js`。

推荐后续新增脚本。

### 13.3 状态值要收敛

合作申请状态不要随便写任意字符串。

第一版建议固定：

```text
submitted
contacted
approved
rejected
closed
```

测试反馈状态固定：

```text
submitted
reviewed
valuable
not_valuable
invalid
```

### 13.4 不要在后台第一版做剧本编辑器

剧本编辑涉及：

- 长文本编辑。
- 版本管理。
- 文件生成。
- 授权文件同步。
- 下载包重新生成。

这应放在后台第二阶段之后。

## 14. 当前建议

下一步进入后台代码 Phase 1：

```text
新增 requireAdmin
新增 /api/admin/me
新增 /api/admin/overview
新增 scripts/make-admin.js
把 public/admin 占位页改成后台工作台框架
跑完整回归
```

完成这一步后，再做合作申请管理，因为它最接近收入。

