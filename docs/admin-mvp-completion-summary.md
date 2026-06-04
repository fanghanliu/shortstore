# 后台管理系统 MVP 完成总结

## 1. 文档目标

这份文档用于总结当前后台管理系统 MVP 已经具备的能力、边界和下一阶段优先级。

当前后台不是最终版运营系统，但已经完成了从“只能看前台数据”到“可以管理核心业务链路”的第一阶段跨越。

## 2. 当前后台入口

后台静态页面：

```text
/admin/
```

后台文件：

```text
public/admin/index.html
public/admin/admin.css
public/admin/admin.js
```

后台接口统一使用：

```text
/api/admin/...
```

所有后台数据接口都必须经过管理员权限校验。

## 3. 当前权限规则

后台复用现有账号系统：

```text
邮箱 + 密码 + HTTP-only Cookie
```

管理员判断：

```text
User.role = admin
User.status = active
```

普通用户访问后台接口：

```text
403 Forbidden
```

未登录用户访问后台接口：

```text
401 Unauthorized
```

第一位管理员可以通过脚本设置：

```bash
npm.cmd run make:admin -- your-email@example.com
```

## 4. 已完成模块

### 4.1 概况

已完成：

- 已发布剧本数
- 草稿剧本数
- 注册用户数
- 下载总数
- 测试反馈数
- 待处理测试反馈数
- 合作申请数
- 待处理合作申请数
- 最近合作申请
- 最近测试反馈

接口：

```text
GET /api/admin/overview
```

### 4.2 合作申请管理

已完成：

- 合作申请列表
- 状态筛选
- 合作方式筛选
- 关键词搜索
- 分页
- 状态修改
- 删除合作申请
- 更新成功提示
- 默认查看待处理申请

状态：

```text
submitted
contacted
approved
rejected
closed
```

接口：

```text
GET /api/admin/continuation-requests
PATCH /api/admin/continuation-requests/:id
```

### 4.3 测试反馈管理

已完成：

- 测试反馈列表
- 状态筛选
- 平台筛选
- 关键词搜索
- 分页
- 状态修改
- 删除测试反馈
- 视频链接跳转
- 更新成功提示
- 默认查看待处理反馈

状态：

```text
submitted
reviewed
valuable
not_valuable
invalid
```

接口：

```text
GET /api/admin/test-reports
PATCH /api/admin/test-reports/:id
```

### 4.4 下载记录

已完成：

- 下载记录列表
- 关键词搜索
- 分页
- 查看剧本、资源、用户、游客标识、来源和后续行为
- 删除下载记录

接口：

```text
GET /api/admin/downloads
DELETE /api/admin/downloads/:id
```

下载记录仍不允许编辑，但允许管理员硬删除。

### 4.5 用户管理

已完成：

- 用户列表
- 状态筛选
- 角色筛选
- 关键词搜索
- 分页
- 用户启用/禁用
- 删除用户
- 禁止管理员禁用自己
- 禁止管理员删除自己
- 更新成功提示

状态：

```text
active
disabled
```

接口：

```text
GET /api/admin/users
PATCH /api/admin/users/:id
DELETE /api/admin/users/:id
```

当前后台允许硬删除用户，但不允许删除当前管理员自己，也不允许重置密码。

### 4.6 剧本管理

已完成：

- 剧本列表
- 状态筛选
- 主推筛选
- 关键词搜索
- 分页
- 上下架状态修改
- 主推开关
- 删除剧本
- 归档确认
- 更新成功提示

状态：

```text
draft
published
archived
```

接口：

```text
GET /api/admin/scripts
PATCH /api/admin/scripts/:id
DELETE /api/admin/scripts/:id
```

归档剧本需要显式确认：

```json
{
  "status": "archived",
  "confirmArchive": true
}
```

这样可以降低误下架风险。

### 4.7 订单管理

已完成：

- 订单列表
- 订单状态处理
- 删除订单

接口：

```text
GET /api/admin/orders
PATCH /api/admin/orders/:id
DELETE /api/admin/orders/:id
```

### 4.8 分成回传管理

已完成：

- 分成回传列表
- 分成回传审核
- 删除分成回传

接口：

```text
GET /api/admin/revenue-share-statements
PATCH /api/admin/revenue-share-statements/:id
DELETE /api/admin/revenue-share-statements/:id
```

### 4.9 分成项目管理接口

已完成：

- 分成项目列表
- 创建分成项目
- 删除分成项目

接口：

```text
GET /api/admin/revenue-share-projects
POST /api/admin/revenue-share-projects
DELETE /api/admin/revenue-share-projects/:id
```

## 5. 当前业务闭环

用户端已经形成：

```text
剧本库
→ 剧本详情
→ 下载前三集
→ 注册/登录
→ 用户中心
→ 提交测试反馈
→ 申请后续合作
```

后台现在可以承接：

```text
看下载记录
→ 看测试反馈
→ 判断剧本潜力
→ 处理合作申请
→ 管理剧本上下架
→ 管理用户状态
```

这意味着平台已经具备最小运营闭环。

## 6. 当前安全边界

已经完成：

- 后台接口统一要求管理员权限。
- 普通用户无法读取后台数据。
- 禁止管理员禁用自己。
- 禁止管理员删除自己。
- 剧本归档需要确认。
- 所有硬删除接口都要求 `confirmDelete: true`。
- 状态字段使用固定枚举。
- 后台只开放必要字段更新。

仍需后续加强：

- 操作审计日志。
- CSRF 防护。
- 更严格的管理员会话策略。
- 多管理员权限分层。
- 重要操作二次确认和备注。
- 删除操作的审计日志和回收站。
- 后台登录失败限制。

## 7. 当前没有做的事

第一版后台暂不包含：

- 在线支付和订单管理。
- 分成结算。
- 文件上传。
- 剧本文本在线编辑器。
- 富文本编辑。
- 管理员创建和权限分级。
- 删除用户。
- 删除剧本。
- 删除下载记录。
- 删除反馈和合作申请。
- 自动抓取视频平台数据。
- 数据图表大屏。

这些能力不是不重要，而是不应该挤进 MVP 第一阶段。

## 8. 验收方式

当前后台相关回归已经纳入：

```text
npm.cmd run test:api
```

覆盖范围包括：

- 前台剧本列表
- 剧本详情
- 下载前三集
- 注册/登录
- 游客下载绑定
- 用户中心下载记录
- 测试反馈提交
- 后台测试反馈读取和状态更新
- 后续合作申请提交
- 后台合作申请读取和状态更新
- 后台下载记录读取
- 后台用户列表读取和用户禁用
- 后台剧本列表读取、主推修改、归档和恢复

另有基础检查：

```text
npm.cmd run check:text
node --check server.js
node --check public/admin/admin.js
node --check scripts/smoke-api.js
```

## 9. 下一阶段建议

### 优先级 1：后台操作审计

原因：

- 后台已经可以修改用户状态、剧本状态、反馈状态和合作申请状态。
- 一旦多人协作，需要知道谁在什么时候做了什么。

建议新增：

```text
AdminActionLog
```

记录：

- 操作者
- 操作对象
- 操作类型
- 修改前
- 修改后
- 时间

### 优先级 2：合作申请跟进备注

原因：

- 合作申请最接近收入。
- 只改状态还不够，需要记录沟通进度。

建议给合作申请增加：

- 管理员备注
- 最近跟进时间
- 下一次跟进时间

### 优先级 3：剧本数据表现面板

原因：

- 平台真正的资产不是单条下载，而是剧本的转化表现。

建议以剧本为维度聚合：

- 下载数
- 测试反馈数
- 有价值反馈数
- 合作申请数
- 买断申请数
- 按集申请数
- 分成申请数

### 优先级 4：文件上传和资源管理

原因：

- 当前剧本资源仍主要依赖本地文件和导入脚本。
- 后续剧本数量增加后，需要后台管理资源包。

建议后续再做，不要立刻做。

## 10. 当前结论

后台 MVP 已经完成第一阶段目标：

```text
能看数据
能筛选数据
能处理状态
能追踪用户行为
能管理剧本上下架
能支撑当前商业闭环
```

下一步不建议继续盲目堆功能。

更合理的节奏是先做一次后台运营质量提升，优先补审计日志、跟进备注和剧本表现聚合。
