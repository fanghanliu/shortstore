# 登录注册 MVP 实施计划

## 1. 文档目标

这份文档用于把账号体系从业务规划推进到代码实施层。

它承接：

```text
docs/account-and-post-download-flow-plan.md
docs/download-access-and-user-identity-rules.md
```

当前目标不是一次性做完整会员系统，而是先跑通最关键的闭环：

```text
游客下载免费前三集
  ↓
下载后引导注册
  ↓
注册/登录
  ↓
绑定游客下载记录
  ↓
用户中心查看我的下载
```

只要这条链路跑通，平台就可以从“有下载记录的网站”升级成“可沉淀用户关系的网站”。

## 2. 当前代码现状

### 2.1 已有能力

当前项目已经具备：

- Express 后端服务：`server.js`
- Prisma + SQLite：`prisma/schema.prisma`
- 剧本列表接口：`GET /api/scripts`
- 剧本详情接口：`GET /api/scripts/:slug`
- 免费包接口：`GET /api/scripts/:slug/free-preview`
- 下载记录接口：`POST /api/downloads`
- 下载记录表：`Download`
- 游客标识：`visitorId`
- 前端下载确认弹窗：`script-detail.js`

### 2.2 当前缺口

当前还没有：

- `User` 表。
- 密码哈希。
- 注册接口。
- 登录接口。
- 退出接口。
- 当前用户接口。
- 登录态 Cookie。
- 登录用户下载记录关联。
- 游客下载记录绑定。
- 登录/注册页面。
- 用户中心页面。

### 2.3 当前 Download 表的问题

`Download` 里已经有：

```text
userId String?
visitorId String?
```

但目前 `userId` 只是普通字符串，没有和 `User` 建立 Prisma relation。

所以实施账号 MVP 时需要把它升级成：

```text
Download.userId -> User.id
```

这样后续才能稳定查询：

```text
某个用户下载过哪些剧本
```

## 3. 技术方案选择

### 3.1 推荐方案

第一版建议使用：

```text
邮箱 + 密码
HTTP-only Cookie
JWT 登录态
bcryptjs 密码哈希
```

推荐原因：

- 改动小，适合当前 Express 项目。
- 不需要立刻引入复杂 session 存储。
- Cookie 对前端透明，前端不需要手动管理 token。
- HTTP-only Cookie 比 localStorage 存 token 更稳。
- 后续迁移到正式框架时也容易替换。

### 3.2 暂不采用的方案

暂不做：

- 手机验证码。
- 微信登录。
- OAuth 第三方登录。
- 邮箱验证。
- 找回密码。
- 管理员权限后台。
- 多设备登录管理。

这些可以后续做，但不应该阻塞第一条业务闭环。

## 4. 依赖规划

### 4.1 需要新增依赖

建议新增：

```json
{
  "bcryptjs": "^2.x",
  "cookie-parser": "^1.x",
  "jsonwebtoken": "^9.x"
}
```

用途：

| 依赖 | 用途 |
| --- | --- |
| `bcryptjs` | 注册时哈希密码，登录时验证密码 |
| `cookie-parser` | 读取浏览器 Cookie |
| `jsonwebtoken` | 生成和验证登录态 JWT |

### 4.2 环境变量

建议新增：

```text
AUTH_JWT_SECRET="replace-with-local-dev-secret"
AUTH_COOKIE_NAME="script_marketplace_session"
```

本地开发可以先放在 `.env`。

上线时必须把 `AUTH_JWT_SECRET` 换成强随机值。

## 5. Prisma 改造计划

### 5.1 新增 User 模型

在 `prisma/schema.prisma` 中新增：

```prisma
model User {
  id            String     @id @default(cuid())
  email         String     @unique
  passwordHash  String
  displayName   String?
  contactWechat String?
  contactPhone  String?
  role          String     @default("user")
  status        String     @default("active")
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  downloads     Download[]
}
```

字段说明：

| 字段 | 说明 |
| --- | --- |
| `email` | 登录账号，唯一 |
| `passwordHash` | 密码哈希，不能返回前端 |
| `displayName` | 昵称，可选 |
| `contactWechat` | 后续沟通用，可选 |
| `contactPhone` | 后续沟通用，可选 |
| `role` | `user` / `admin` |
| `status` | `active` / `disabled` |

### 5.2 修改 Download 模型

当前：

```prisma
userId String?
```

建议改为：

```prisma
userId String?
user   User?   @relation(fields: [userId], references: [id], onDelete: SetNull)
```

并补充：

```prisma
@@index([userId])
```

### 5.3 完整 Download 目标形态

目标：

```prisma
model Download {
  id               String      @id @default(cuid())
  scriptId         String
  assetId          String
  visitorId        String?
  userId           String?
  ipAddress        String?
  userAgent        String?
  referrer         String?
  licenseConfirmed Boolean     @default(false)
  createdAt        DateTime    @default(now())
  script           Script      @relation(fields: [scriptId], references: [id], onDelete: Cascade)
  asset            ScriptAsset @relation(fields: [assetId], references: [id], onDelete: Cascade)
  user             User?       @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([scriptId])
  @@index([assetId])
  @@index([visitorId])
  @@index([userId])
}
```

## 6. SQLite 初始化脚本改造

当前项目有：

```text
scripts/init-sqlite.js
```

它用于兼容本地 SQLite 表结构初始化和字段补齐。

账号 MVP 需要补充：

- 创建 `User` 表。
- 为 `Download.userId` 建索引。
- 确保 `Download.userId` 字段存在。

第一版可以继续使用：

```text
npm.cmd run db:push
npm.cmd run db:init
```

但要注意：SQLite 对已有表追加外键关系不一定像全新建表一样完整，因此本地开发可以接受 Prisma 管理后的结构；后续正式迁移 PostgreSQL 时再做标准 migration。

## 7. 后端认证结构

### 7.1 server.js 新增工具函数

建议在 `server.js` 中新增：

```text
normalizeEmail(email)
validatePassword(password)
sanitizeUser(user)
createSessionToken(user)
verifySessionToken(token)
getCurrentUser(request)
requireAuth(request, response, next)
```

### 7.2 sanitizeUser

返回给前端的用户对象必须过滤密码哈希：

```js
function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    contactWechat: user.contactWechat,
    contactPhone: user.contactPhone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt
  };
}
```

### 7.3 Cookie 设置

登录成功后设置：

```text
Set-Cookie: script_marketplace_session=...
```

建议配置：

```js
{
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24 * 30
}
```

本地开发 `secure` 必须是 `false`，否则 HTTP 下 Cookie 不会写入。

## 8. 后端 API 实施计划

### 8.1 注册接口

```text
POST /api/auth/register
```

请求：

```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "短剧制作人",
  "contactWechat": "optional"
}
```

校验：

- email 必填。
- email 格式必须合理。
- password 必填。
- password 至少 8 位。
- email 不可重复。

成功后：

- 创建 User。
- 写入登录 Cookie。
- 返回用户信息。

返回：

```json
{
  "user": {
    "id": "user_xxx",
    "email": "user@example.com",
    "displayName": "短剧制作人"
  }
}
```

### 8.2 登录接口

```text
POST /api/auth/login
```

请求：

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

校验：

- 用户存在。
- 用户状态是 `active`。
- 密码验证通过。

失败时统一返回：

```json
{
  "error": "Email or password is incorrect"
}
```

不要分别提示“邮箱不存在”或“密码错误”，避免泄露账号枚举信息。

### 8.3 退出接口

```text
POST /api/auth/logout
```

行为：

- 清除 Cookie。
- 返回 `{ ok: true }`。

### 8.4 当前用户接口

```text
GET /api/me
```

未登录：

```json
{
  "user": null
}
```

已登录：

```json
{
  "user": {
    "id": "user_xxx",
    "email": "user@example.com",
    "displayName": "短剧制作人"
  }
}
```

这个接口用于前端导航栏、用户中心和下载后弹窗判断登录状态。

### 8.5 绑定游客下载记录接口

```text
POST /api/me/bind-visitor-downloads
```

需要登录。

请求：

```json
{
  "visitorId": "visitor_1716880000000_abcd"
}
```

后端逻辑：

```text
读取当前登录用户
  ↓
校验 visitorId 不为空
  ↓
查找 userId 为空、visitorId 相同、30 天内的 Download
  ↓
批量更新 userId = 当前用户 id
  ↓
返回绑定数量
```

返回：

```json
{
  "boundCount": 3
}
```

### 8.6 我的下载接口

```text
GET /api/me/downloads
```

需要登录。

查询：

```text
Download where userId = 当前用户 id
include Script and ScriptAsset
orderBy createdAt desc
```

返回：

```json
{
  "items": [
    {
      "id": "download_xxx",
      "createdAt": "2026-05-28T00:00:00.000Z",
      "script": {
        "slug": "lie-scent",
        "title": "她闻到谎言",
        "category": "悬疑甜虐"
      },
      "asset": {
        "title": "免费前三集验证包",
        "filePath": "downloads/free-preview-lie-scent-v1.md"
      }
    }
  ]
}
```

## 9. 下载接口改造

### 9.1 当前行为

当前：

```text
POST /api/downloads
```

只记录：

- scriptId
- assetId
- visitorId
- IP
- userAgent
- referrer
- licenseConfirmed

### 9.2 目标行为

改造后：

```text
如果用户已登录，则 Download.userId = 当前用户 id
如果用户未登录，则 Download.userId = null
visitorId 仍然照常记录
```

这意味着下载接口应该使用“可选登录态”：

```text
有 Cookie 就识别用户
没有 Cookie 仍然允许游客下载
```

不要把下载接口改成必须登录。

## 10. 前端文件实施计划

### 10.1 新增 site-session.js

建议把游客 ID 和当前用户状态拆成公共前端脚本：

```text
site-session.js
```

职责：

- 生成和读取 `visitorId`。
- 请求 `GET /api/me`。
- 提供 `bindVisitorDownloads()`。
- 提供简单的登录状态工具。

这样 `script-detail.js`、`auth.js`、`account.js` 都可以复用。

### 10.2 改造 script-detail.js

当前 `getVisitorId()` 写在 `script-detail.js` 内部。

建议改造为：

- 优先使用 `window.ScriptMarketplaceSession.getVisitorId()`。
- 下载成功后调用下载后弹窗。
- 弹窗里判断当前是否登录。
- 未登录显示“注册并保存记录”。
- 已登录显示“前往用户中心”。

### 10.3 新增 auth.html

页面：

```text
auth.html
```

支持参数：

```text
auth.html?mode=login
auth.html?mode=register
```

模块：

- 登录表单。
- 注册表单。
- 模式切换。
- 错误提示。
- 提交 loading 状态。

注册成功或登录成功后：

```text
调用 /api/me/bind-visitor-downloads
跳转 account.html
```

### 10.4 新增 auth.js

职责：

- 读取 URL mode。
- 控制登录/注册表单显示。
- 调用注册接口。
- 调用登录接口。
- 成功后绑定游客下载记录。
- 跳转用户中心。

### 10.5 新增 account.html

第一版用户中心页面：

- 顶部显示账号信息。
- 显示“我的下载”。
- 下载记录卡片。
- 每条记录提供：
  - 查看剧本详情。
  - 重新下载免费包。
  - 后续合作按钮。

测试反馈和后续申请可以先放入口，不急着完整实现。

### 10.6 新增 account.js

职责：

- 调用 `GET /api/me`。
- 未登录跳转 `auth.html?mode=login`。
- 调用 `GET /api/me/downloads`。
- 渲染下载记录。
- 调用退出接口。

### 10.7 导航栏登录状态

可以新增：

```text
site-auth-nav.js
```

职责：

- 页面加载时请求 `/api/me`。
- 未登录显示“登录 / 注册”。
- 已登录显示“用户中心”或用户名。

第一版如果不想全站改导航，也可以只在 `script-preview.html`、`scripts.html`、`index.html` 三个关键页面接入。

## 11. 下载后弹窗改造

### 11.1 当前状态

当前下载成功后：

```text
关闭下载确认弹窗
触发文件下载
```

### 11.2 目标状态

下载成功后：

```text
关闭下载确认弹窗
触发文件下载
打开下载后引导弹窗
```

### 11.3 未登录弹窗

按钮：

- 注册并保存记录。
- 登录账号。
- 稍后再说。

主文案：

```text
前三集验证包已开始下载。注册后可以保存下载记录、提交测试数据，并申请第4集及后续内容。
```

### 11.4 已登录弹窗

按钮：

- 前往用户中心。
- 查看后续合作方式。
- 继续浏览剧本。

主文案：

```text
前三集验证包已开始下载，记录已保存到你的账号。
```

## 12. 安全边界

### 12.1 密码

必须做到：

- 不明文存储密码。
- 不返回 `passwordHash`。
- 登录失败返回统一错误。
- 密码至少 8 位。

### 12.2 Cookie

必须做到：

- `httpOnly: true`
- `sameSite: "lax"`
- 生产环境 `secure: true`
- 退出时清除 Cookie

### 12.3 接口权限

必须登录：

- `POST /api/me/bind-visitor-downloads`
- `GET /api/me/downloads`

不强制登录：

- `GET /api/scripts`
- `GET /api/scripts/:slug`
- `GET /api/scripts/:slug/free-preview`
- `POST /api/downloads`

### 12.4 用户状态

如果用户 `status !== "active"`：

- 不允许登录。
- 已有 Cookie 应视为无效。
- 需要返回未登录或禁用提示。

## 13. 测试计划

### 13.1 后端 smoke test 增强

当前已有：

```text
scripts/smoke-api.js
```

建议增加测试：

1. 注册新用户。
2. 获取 `/api/me` 能返回用户。
3. 游客下载免费包。
4. 登录后绑定游客下载记录。
5. `/api/me/downloads` 能看到该下载。
6. 登出后 `/api/me` 返回 `user: null`。

### 13.2 手动测试路径

手动测试：

1. 打开剧本详情页。
2. 未登录下载免费包。
3. 下载成功后看到注册引导弹窗。
4. 点击注册。
5. 注册成功进入用户中心。
6. 用户中心显示刚才下载过的剧本。
7. 退出登录。
8. 再次访问用户中心时跳转登录页。

### 13.3 回归测试

必须确认：

- 未登录仍可下载免费包。
- 已登录下载会记录 `userId`。
- 剧本库仍能正常加载 4 套剧本。
- 剧本详情仍展示双语提示词。
- 下载接口仍要求 `licenseConfirmed: true`。

## 14. 实施顺序

### Step 1：安装依赖

```text
npm.cmd install bcryptjs cookie-parser jsonwebtoken
```

### Step 2：改 Prisma schema

改动：

- 新增 `User`。
- `Download` 增加 `user` relation。
- `Download` 增加 `@@index([userId])`。

执行：

```text
npm.cmd run db:generate
npm.cmd run db:push
```

### Step 3：改初始化脚本

改动：

- `scripts/init-sqlite.js` 补 User 表初始化。
- 确保 userId 索引存在。

### Step 4：改 server.js

新增：

- Cookie parser。
- JWT helpers。
- password helpers。
- auth middleware。
- auth API。
- me API。
- bind visitor downloads API。
- me downloads API。

改造：

- `/api/downloads` 支持可选登录态。

### Step 5：新增前端公共 session 脚本

新增：

```text
site-session.js
```

把 `visitorId` 生成逻辑从 `script-detail.js` 抽出来。

### Step 6：新增登录注册页面

新增：

```text
auth.html
auth.js
```

### Step 7：新增用户中心

新增：

```text
account.html
account.js
```

### Step 8：改下载后弹窗

改造：

- `script-detail.js`
- `script-preview.html`
- 必要的 CSS 样式

### Step 9：更新 smoke test

改造：

```text
scripts/smoke-api.js
```

验证注册、登录、绑定、我的下载。

## 15. 第一版验收标准

完成后应满足：

- 用户可以通过邮箱密码注册。
- 用户可以登录和退出。
- `/api/me` 能正确返回登录状态。
- 未登录用户仍可下载免费前三集。
- 未登录下载会记录 `visitorId`。
- 已登录下载会同时记录 `userId`。
- 注册/登录后可以绑定同浏览器游客下载记录。
- 用户中心可以看到自己的下载记录。
- 密码不会明文存储。
- 下载前不强制注册。

## 16. 不纳入本次代码范围

本次不做：

- 在线支付。
- 后台管理。
- 邮箱验证码。
- 手机短信。
- 找回密码。
- 微信登录。
- 测试反馈表完整实现。
- 后续合作申请完整实现。
- 分成结算。

这些要等账号 MVP 跑通后再按阶段补。

## 17. 下一步建议

下一步可以正式进入账号 MVP 的代码改造，建议从最底层开始：

```text
1. 安装 bcryptjs、cookie-parser、jsonwebtoken
2. 修改 prisma/schema.prisma
3. 执行 db:generate 和 db:push
4. 修改 server.js，先跑通注册 / 登录 / 当前用户接口
```

第一轮代码不急着做漂亮页面，先让后端账号能力跑通。

