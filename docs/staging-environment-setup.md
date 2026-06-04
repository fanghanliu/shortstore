# 测试环境搭建方案

## 1. 为什么先搭测试环境

正式生产环境不应该成为第一次发现问题的地方。

测试环境的作用是：

- 在真实部署平台上验证 Node/Express 服务是否能启动。
- 验证生产模式 Cookie、HTTPS、静态资源、下载资源是否正常。
- 验证数据库从本地 SQLite 过渡到测试 PostgreSQL 后，接口是否仍然稳定。
- 验证用户流程、后台流程、续作流程在非本地环境下能跑通。
- 在不影响正式用户的情况下暴露部署、权限、路径、数据库和文件问题。

测试环境的定位是 staging，不是 production。

如果你希望使用国内平台，优先参考：

```text
docs/tencent-cloud-staging-deployment-guide.md
```

这份文档以腾讯云轻量应用服务器为主线，适合中文后台和国内访问场景。

## 2. 测试环境目标架构

推荐测试环境尽量模拟正式环境：

```text
浏览器
  -> staging 域名
      -> Node/Express
          -> public/site
          -> /api/*
          -> PostgreSQL 测试库
          -> downloads 测试资源
```

保留同源部署：

- 前端页面和 API 在同一个域名下。
- 前端继续使用 `/api/...`。
- 暂时不引入 CORS。
- Cookie 登录态更接近未来正式环境。

## 3. 测试环境和生产环境的区别

| 项目 | 测试环境 | 生产环境 |
| --- | --- | --- |
| 域名 | staging 域名或临时域名 | 正式域名 |
| 数据库 | 独立测试 PostgreSQL | 正式 PostgreSQL |
| 用户数据 | 测试账号和测试行为 | 真实用户 |
| 支付 | 不接真实支付或只走人工测试 | 正式收款流程 |
| 下载文件 | 测试资源，可重建 | 正式交付资源 |
| 管理员 | 测试管理员 | 正式管理员 |
| 目标 | 找问题 | 稳定运营 |

关键原则：

- 测试环境绝不连接正式数据库。
- 测试环境可以删除重建。
- 测试环境可以使用测试管理员和测试用户。
- 测试环境的 `AUTH_JWT_SECRET` 要独立于生产环境。

## 4. 已新增的文件

### `.env.staging.example`

测试环境变量模板：

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"
PORT=3000
NODE_ENV="production"
AUTH_COOKIE_NAME="script_marketplace_session"
AUTH_JWT_SECRET="replace-with-staging-random-secret"
STAGING_BASE_URL="https://staging.example.com"
```

注意：

- 不要把真实 `.env.staging` 提交到仓库。
- `.gitignore` 已忽略 `.env.*`，并保留 `.env.example` 和 `.env.staging.example`。

### `scripts/staging-smoke-check.js`

轻量远程冒烟检查脚本。

它只做只读检查，不注册用户，不创建订单，不改后台数据。

检查内容：

- `/api/health`
- `/`
- `/api/scripts?status=published`
- 前 3 个剧本详情接口
- 前 3 个剧本免费包元数据接口

运行方式：

```powershell
npm.cmd run test:staging -- https://staging.example.com
```

或设置环境变量：

```powershell
$env:STAGING_BASE_URL="https://staging.example.com"
npm.cmd run test:staging
```

## 5. 搭建步骤

### Step 1：选择测试部署平台

测试平台需要支持：

- Node.js。
- `npm install`。
- `npm start`。
- 环境变量。
- HTTPS。
- PostgreSQL 连接。
- 静态文件和下载文件访问。

当前代码启动命令：

```powershell
npm.cmd start
```

平台侧通常配置：

```text
Build command: npm install && npm run db:generate:staging
Start command: npm run start:staging
```

说明：

- `db:generate:staging` 会生成 PostgreSQL 版 Prisma Client。
- `start:staging` 会在服务启动前执行测试库建表同步，并导入 `scripts-data/*.json`。
- 这套命令只用于 staging，正式生产环境后续应改成 migration deploy。

### Step 2：准备测试数据库

推荐使用独立 PostgreSQL 测试库。

不要复用：

- 本地 SQLite。
- 未来正式生产库。

测试库命名建议：

```text
script_marketplace_staging
```

### Step 3：处理 Prisma 迁移

当前项目仍是 SQLite provider，测试 PostgreSQL 前需要单独开迁移任务。

建议顺序：

1. 备份当前 `prisma/schema.prisma`。
2. 使用 `scripts/write-postgres-prisma-schema.js` 自动生成 `prisma/schema.postgresql.prisma`。
3. staging 环境使用 `prisma/schema.postgresql.prisma`。
4. 在测试库执行 `prisma db push --schema prisma/schema.postgresql.prisma`。
5. 重新生成 Prisma Client。

建议未来脚本：

```json
{
  "db:generate:staging": "npm run db:write-postgres-schema && prisma generate --schema prisma/schema.postgresql.prisma",
  "db:push:staging": "npm run db:write-postgres-schema && prisma db push --schema prisma/schema.postgresql.prisma",
  "db:migrate:dev": "prisma migrate dev",
  "db:migrate:deploy": "prisma migrate deploy"
}
```

当前不要在 UI 收尾分支上直接把 `prisma/schema.prisma` 切库，避免影响本地开发。

### Step 4：配置测试环境变量

测试环境至少需要：

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"
NODE_ENV="production"
AUTH_COOKIE_NAME="script_marketplace_session"
AUTH_JWT_SECRET="测试环境强随机字符串"
```

如果平台自动提供 `PORT`，不要手动覆盖。

### Step 5：导入测试内容

测试数据库建表后，导入剧本内容：

```powershell
npm.cmd run import:script -- scripts-data/*.json
```

如果平台不支持直接运行这个命令，可以在部署平台的 shell、console 或一次性 job 中运行。

### Step 6：创建测试管理员

先注册一个测试账号，然后执行：

```powershell
npm.cmd run make:admin -- admin@example.com
```

如果平台无法运行本地命令，需要准备一次性管理员创建方式。

测试管理员只用于 staging。

### Step 7：部署下载资源

测试环境至少要保证免费包文件存在。

当前资源路径主要是：

```text
downloads/{slug}/free-preview-{slug}-v1.docx
downloads/{slug}/deliveries/*.docx
```

测试环境可以先把 `downloads/` 随项目一起部署。

注意：

- 免费包可以公开访问。
- 付费交付包上线前最好改成受控下载。
- staging 阶段可以先验证路径和下载行为。

### Step 8：运行冒烟检查

部署完成后执行：

```powershell
npm.cmd run test:staging -- https://staging.example.com
```

通过后再进入人工验收。

## 6. 人工验收清单

### 公开页面

- 首页能打开。
- 剧本库能加载。
- 剧本详情页能打开。
- 移动端布局没有明显错位。
- 图片、封面、样片资源正常显示。

### 免费包流程

- 免费包弹窗能打开。
- 授权确认能勾选。
- 下载记录能创建。
- 文件能下载。
- 用户登录后能绑定游客下载记录。

### 用户流程

- 注册成功。
- 登录成功。
- 退出成功。
- 用户中心能看到下载记录。
- 用户能提交测试反馈。
- 用户能提交买断、按集、分成续作申请。

### 后台流程

- 非管理员不能进入后台。
- 管理员可以进入后台。
- 剧本、用户、下载、反馈、续作申请能加载。
- 后台审批续作申请正常。
- 订单和交付信息能展示。
- 分成项目相关页面能加载。

### 安全和环境

- 使用 HTTPS。
- Cookie 能正常写入。
- Cookie 能正常清除。
- 页面没有调用 `localhost`。
- 测试环境没有连接正式数据库。
- `.env` 没有暴露。

## 7. 测试环境通过标准

测试环境通过需要满足：

1. 远程冒烟检查通过。
2. 公开页面和移动端 UI 通过。
3. 注册、登录、下载、用户中心通过。
4. 后台管理员流程通过。
5. 免费包文件能下载。
6. 续作申请能提交和审核。
7. 测试数据库中能看到对应记录。
8. HTTPS 下 Cookie 正常。
9. 没有发现写死本地地址的问题。
10. 测试环境可以被重建。

## 8. 不建议在测试环境做的事

- 不要接入真实生产数据库。
- 不要使用正式生产 `AUTH_JWT_SECRET`。
- 不要导入真实用户隐私数据。
- 不要开放真实付款入口。
- 不要把测试站当成正式站宣传。
- 不要在测试站产生不可删除的真实订单。

## 9. 下一步建议

当前建议顺序：

1. 先确定测试部署平台。
2. 准备测试 PostgreSQL。
3. 单独开数据库迁移任务，不和 UI 收尾混在一起。
4. 部署 staging。
5. 导入剧本数据。
6. 创建测试管理员。
7. 跑 `test:staging`。
8. 做人工验收。
9. 记录问题，修复后再考虑生产环境。

这一步完成后，正式上线会从“直接冒险”变成“复制一套已经验证过的流程”。
