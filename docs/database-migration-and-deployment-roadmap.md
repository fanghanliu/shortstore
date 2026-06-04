# 数据库迁移与网站部署路线图

## 1. 当前阶段判断

第一版内容和业务流程已经基本完成，接下来进入两个并行阶段：

1. 最后 UI 调整。
2. 正式环境准备。

我的建议是：

> UI 调整继续推进；数据库迁移和网站部署现在开始做准备，但不要立刻切换生产数据库。

原因很简单：现在切库会打断 UI 收尾和功能验收；但如果完全等上线前再想，风险会堆在最后一周。所以当前最合适的动作是把部署路线、迁移边界、环境变量和验收流程先固定下来。

## 2. 当前技术状态

### 数据库

当前使用：

```env
DATABASE_URL="file:./dev.db"
```

Prisma datasource：

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

实际数据库文件：

```text
prisma/dev.db
```

当前没有 `prisma/migrations/` 目录，说明目前主要使用：

```powershell
npm.cmd run db:push
npm.cmd run db:init
```

其中：

- `db:push` 用 Prisma 同步 schema。
- `db:init` 执行 `scripts/init-sqlite.js`，只适用于 SQLite。

结论：

- 本地继续用 SQLite 可以。
- 正式环境不建议继续依赖 `scripts/init-sqlite.js`。
- 生产库应该改用 Prisma migration 或一次性初始化脚本。

### 接口

前端大部分请求都是：

```js
fetch("/api/...")
```

这很好。

正式部署时，只要前后端仍然同源，接口路径不需要变化。

### 文件下载

当前文件主要在：

```text
downloads/{slug}/...
```

后端静态挂载：

```js
app.use("/downloads", express.static(downloadsDir));
```

结论：

- 免费预览包可以暂时这样部署。
- 付费包、买断包、分成包不应长期公开暴露在 `/downloads/...`。
- 上线前至少要明确哪些资源公开，哪些资源必须走权限校验。

## 3. 推荐上线架构

### MVP 正式版架构

推荐先用简单稳定的同源架构：

```text
用户浏览器
  -> Node/Express 服务
      -> public/site 静态页面
      -> /api/* 业务接口
      -> PostgreSQL 生产数据库
      -> downloads 免费资源或受控交付资源
```

这套架构优点：

- 前端不用改 API 域名。
- 不需要 CORS。
- Cookie 登录态简单。
- 部署复杂度低。
- 适合当前 MVP。

### 暂不建议一开始前后端分离

不建议现在拆成：

```text
前端 CDN 域名 + 独立 API 域名
```

原因：

- 会引入 CORS。
- Cookie domain / sameSite / secure 配置会更复杂。
- 当前业务重点不是高并发前端静态分发，而是内容、转化和后台流程。

## 4. 数据库迁移策略

### 阶段一：继续本地 SQLite

适用时间：

- UI 最后调整。
- 本地功能验收。
- 内容和数据结构还可能小幅变化。

保留：

```text
prisma/dev.db
scripts/init-sqlite.js
npm.cmd run db:push
npm.cmd run db:init
```

注意：

- 不要把真实用户数据长期留在本地库。
- 剧本内容应以 `scripts-data/*.json`、`downloads/`、生成脚本为主资产。
- 本地库只当开发状态，不当正式数据源。

### 阶段二：准备 PostgreSQL 迁移分支

触发时机：

- UI 基本定稿。
- 免费下载、用户中心、后台、续作申请、订单、分成流程都通过本地测试。
- 准备部署测试环境。

要做的事：

1. 新建迁移分支或单独任务。
2. 备份当前 `prisma/schema.prisma`。
3. 将 datasource provider 从 `sqlite` 改为 `postgresql`。
4. 生成 Prisma migration。
5. 配置测试环境 `DATABASE_URL`。
6. 执行数据库迁移。
7. 用 `scripts-data/*.json` 重新导入剧本数据。
8. 创建管理员账号。
9. 跑接口冒烟测试。

关键点：

- 不要直接在主线 UI 收尾时切库。
- 先在测试环境验证 PostgreSQL。
- 验证通过后再决定是否合并。

### 阶段三：正式生产库

生产数据库建议使用 PostgreSQL。

生产库里应该保留：

- 剧本主数据。
- 剧集数据。
- 资源数据。
- 续作方式。
- 用户。
- 下载记录。
- 测试反馈。
- 续作申请。
- 订单。
- 交付记录。
- 分成项目和报表。

上线前如果还没有真实用户数据，可以不迁移本地行为记录。

推荐方式：

```text
生产库建表
  -> 导入 scripts-data/*.json
  -> 创建管理员
  -> 从零开始记录真实用户行为
```

## 5. 需要调整的 npm 脚本

当前脚本：

```json
{
  "db:push": "prisma db push",
  "db:init": "node scripts/init-sqlite.js",
  "db:seed": "prisma db seed"
}
```

上线前建议新增或规划：

```json
{
  "db:migrate:dev": "prisma migrate dev",
  "db:migrate:deploy": "prisma migrate deploy",
  "db:reset:local": "prisma migrate reset"
}
```

注意：

- `db:init` 可以继续作为本地 SQLite 专用脚本。
- 生产环境不要运行 `scripts/init-sqlite.js`。
- 生产环境应运行 `prisma migrate deploy`。

## 6. 环境变量计划

当前已经新增 `.env.example`。

本地开发：

```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV="development"
AUTH_COOKIE_NAME="script_marketplace_session"
AUTH_JWT_SECRET="replace-with-local-dev-secret"
```

测试环境：

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"
NODE_ENV="production"
AUTH_COOKIE_NAME="script_marketplace_session"
AUTH_JWT_SECRET="测试环境强随机字符串"
```

正式环境：

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"
NODE_ENV="production"
AUTH_COOKIE_NAME="script_marketplace_session"
AUTH_JWT_SECRET="正式环境强随机字符串"
```

上线规则：

- 生产环境不能使用默认 `AUTH_JWT_SECRET`。
- 生产环境不能使用 `file:./dev.db`。
- 生产环境必须 HTTPS。
- 如果部署平台自动注入 `PORT`，不要手动写死端口。

## 7. 部署执行路线

### Step 1：本地上线前验收

先继续本地跑：

```powershell
npm.cmd run check:text
npm.cmd run test:api
```

验收重点：

- 首页和剧本详情页没有明显 UI 问题。
- 免费包下载可记录。
- 用户注册登录正常。
- 用户中心能看到下载记录。
- 后台能查看用户、下载、反馈、续作、订单、分成。
- 生成 `.docx` 文件路径和数据库资源路径一致。

### Step 2：准备测试部署

测试部署目标：

- 用真实域名或临时域名访问。
- 使用生产模式 Cookie。
- 使用 PostgreSQL 测试库。
- 验证 HTTPS 下登录态正常。

测试环境不一定要承载真实用户，但必须模拟正式环境。

### Step 3：切换 PostgreSQL

执行顺序：

```text
修改 Prisma provider
  -> 生成 migration
  -> 配置测试 DATABASE_URL
  -> prisma migrate deploy
  -> npm.cmd run db:generate
  -> npm.cmd run import:script -- scripts-data/*.json
  -> 创建管理员
  -> npm.cmd run test:api
```

注意：

- `scripts/smoke-api.js` 默认打 `127.0.0.1:3000`，测试线上环境时需要另写线上 smoke 或手动测接口。
- 如果测试环境跑在部署平台上，不能假设本地文件路径存在。

### Step 4：部署 Node/Express 服务

部署平台需要支持：

- Node.js。
- `npm install`。
- `npm start`。
- 环境变量配置。
- HTTPS。
- PostgreSQL 连接。
- 持久化文件或可访问静态资源目录。

启动命令：

```powershell
npm.cmd start
```

实际平台通常会运行：

```text
npm install
npm start
```

### Step 5：处理下载文件

MVP 可先保留：

```text
downloads/
```

但必须区分：

| 类型 | 建议 |
| --- | --- |
| 免费前三集包 | 可以公开 `/downloads/...` |
| 按集付费包 | 不建议公开静态路径 |
| 买断完整包 | 不建议公开静态路径 |
| 分成交付包 | 不建议公开静态路径 |

上线前最低要求：

- 免费包可以公开。
- 付费交付包不要在页面上直接暴露。
- 用户中心显示交付时，至少由后端判断订单或合作状态。

更好的下一阶段：

- 增加受控下载接口。
- 付费资源通过接口校验权限后返回文件。
- 未来再切对象存储和签名 URL。

## 8. 上线前必须确认的问题

### 数据库问题

- 是否确定使用 PostgreSQL？
- 本地测试数据是否需要迁移？
- 生产库是否从 `scripts-data/*.json` 重新导入内容？
- 管理员账号如何创建？
- 数据库备份由谁负责？

### 文件问题

- 正式环境是否保留 `downloads/`？
- 部署平台是否保留上传或生成后的文件？
- `.docx` 交付包是否随代码一起发布？
- 付费包是否需要受控下载？

### 域名和安全问题

- 是否有正式域名？
- 是否启用 HTTPS？
- Cookie 在 HTTPS 下是否正常？
- 后台路径是否只允许管理员访问？
- 是否需要限制管理员注册或创建方式？

### 运营问题

- 第一批上线剧本是哪几套？
- 是否只开放免费包下载，不立即开放付款？
- 买断、按集、分成是否都先走人工审核？
- 订单付款是否先人工线下处理？

## 9. 推荐优先级

### 现在马上做

- 完成 UI 最后调整。
- 保持本地 SQLite 开发。
- 使用 `.env.example` 规范环境变量。
- 继续保证前端 API 使用 `/api/...`。
- 跑通本地 `test:api`。

### UI 定稿后做

- 开测试部署任务。
- 准备 PostgreSQL 测试库。
- 尝试 Prisma migration。
- 验证 scripts-data 导入。
- 验证登录 Cookie 和后台权限。

### 正式上线前做

- 切生产数据库。
- 配置正式环境变量。
- 创建正式管理员。
- 配置 HTTPS。
- 确认免费包和付费包下载策略。
- 做完整上线检查。

### 上线后做

- 监控下载记录和转化。
- 备份数据库。
- 梳理真实用户反馈。
- 再决定是否接对象存储、支付系统、自动签名下载。

## 10. 当前结论

现在最理性的选择不是立刻迁移，而是：

1. 继续完成 UI 收尾。
2. 保持本地 SQLite 作为开发库。
3. 用 `.env.example` 和本文档固定部署约定。
4. UI 稳定后单独开 PostgreSQL 测试部署。
5. 测试部署通过后再进入正式上线。

这样项目不会因为基础设施提前复杂化而停下来，也不会在上线前临时补课。
