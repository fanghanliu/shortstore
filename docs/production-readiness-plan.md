# 正式环境准备计划

## 1. 文档目标

当前项目仍处于本地开发阶段，使用本地 SQLite 数据库和本地 Express 服务。这对快速开发是合理的，但正式上线前需要提前规划数据库、接口、文件存储、安全配置和部署方式。

本计划的目标不是现在立刻迁移生产环境，而是明确：

- 现在应该顺手调整什么。
- 上线前必须完成什么。
- 哪些改动会影响代码结构，需要提前预留。
- 哪些事情可以继续等产品功能稳定后再处理。

建议策略：

> 继续把重心放在功能开发上，同时做最小必要的生产化准备，避免上线前重铺地基。

## 2. 当前状态判断

### 数据库

当前 `.env`：

```env
DATABASE_URL="file:./dev.db"
```

当前 Prisma 配置：

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

结论：

- 当前使用本地 SQLite。
- 实际数据库文件是 `prisma/dev.db`。
- 适合本地开发、演示和早期 MVP。
- 不适合作为长期正式生产数据库。

### 接口

当前服务：

```js
const port = Number(process.env.PORT || 3000);
```

启动后：

```text
http://localhost:3000
```

前端接口调用多数是相对路径：

```js
fetch("/api/scripts?status=published")
fetch(`/api/scripts/${scriptSlug}`)
fetch("/api/downloads")
fetch("/api/me/downloads")
```

结论：

- 当前接口是本地 Express 提供的同源接口。
- 这点对上线是有利的，因为正式部署时仍可保持 `/api/...` 不变。
- 只要前后端同域部署，前端接口不需要大改。

### 文件下载

当前后端：

```js
const downloadsDir = path.join(__dirname, "downloads");
app.use("/downloads", express.static(downloadsDir));
```

结论：

- 当前下载文件来自本地 `downloads/` 目录。
- 本地开发没问题。
- 正式环境要决定是否继续使用服务器磁盘，还是迁到对象存储。

### 登录态和 Cookie

当前有：

```js
const authCookieName = process.env.AUTH_COOKIE_NAME || "script_marketplace_session";
const authJwtSecret =
  process.env.AUTH_JWT_SECRET || "local-dev-auth-secret-change-before-production";
```

Cookie 配置里生产环境会启用：

```js
secure: process.env.NODE_ENV === "production"
```

结论：

- 代码已经有生产环境安全开关。
- 但正式上线必须设置强随机 `AUTH_JWT_SECRET`。
- 必须使用 HTTPS，否则生产环境 `secure` Cookie 不会在 HTTP 下正常工作。

## 3. 推荐总体策略

### 当前阶段：保持 SQLite，做好可迁移准备

现在不要急着切 PostgreSQL 或云数据库。

原因：

- 业务模型还在变。
- 剧本生成、免费包、续作、订单、分成等功能还需要继续快速迭代。
- SQLite 本地调试效率高。
- 过早迁移会增加部署、迁移、备份和环境维护成本。

但现在要避免：

- 把路径、域名、端口写死。
- 把业务逻辑绑定到 SQLite 特性。
- 把下载资源只设计成“永远在本机磁盘”。
- 把生产密钥写进代码。

### 上线前阶段：切换生产数据库和部署环境

上线前再集中完成：

- 生产数据库选型。
- Prisma datasource 切换。
- 数据迁移。
- 生产环境变量配置。
- 文件存储方案。
- HTTPS、Cookie、安全策略。
- 备份和日志。

## 4. 现在应该做的事

这些工作不会打断开发节奏，但会降低未来迁移风险。

### 4.1 建立环境变量清单

建议新增或维护一份 `.env.example`，列出所有必须配置项。

建议字段：

```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV="development"
AUTH_COOKIE_NAME="script_marketplace_session"
AUTH_JWT_SECRET="replace-with-local-dev-secret"
```

上线前再换成：

```env
DATABASE_URL="postgresql://..."
PORT=3000
NODE_ENV="production"
AUTH_COOKIE_NAME="script_marketplace_session"
AUTH_JWT_SECRET="strong-random-secret"
```

当前建议：

- 现在可以先写 `.env.example`。
- `.env` 继续只保留本地配置。
- 不要提交真实生产密钥。

### 4.2 保持接口使用相对路径

继续坚持：

```js
fetch("/api/...")
```

不要在前端业务代码里写：

```js
fetch("http://localhost:3000/api/...")
```

原因：

- 本地、测试、正式环境都能复用。
- 部署到同域名后不需要改前端。
- 避免 CORS 复杂度。

例外：

- `scripts/smoke-api.js` 这种测试脚本可以使用 `http://127.0.0.1:3000`。

### 4.3 把下载文件路径继续抽象成数据字段

现在数据库里通过 `ScriptAsset.filePath` 保存资源路径，这是对的。

继续保持：

```json
{
  "filePath": "downloads/free-preview-lie-scent-v1.md"
}
```

未来如果切对象存储，可以变成：

```json
{
  "filePath": "https://cdn.example.com/downloads/free-preview-lie-scent-v1.md"
}
```

当前导入脚本已经允许远程 `http/https` 路径跳过本地文件存在性检查，这对未来迁移有帮助。

### 4.4 避免业务逻辑依赖本地文件系统

现在可以继续从 `downloads/` 提供静态下载，但新功能要尽量避免写死：

```text
必须读取本地 downloads 目录
必须写入服务器磁盘
必须假设文件永远在项目目录下
```

更好的思路：

- 数据库只保存资源路径和元信息。
- 文件可以来自本地目录、CDN、对象存储或后台上传。
- 下载记录和授权确认由接口负责。

### 4.5 保持 Prisma 作为数据库访问层

当前代码通过 Prisma 访问数据库，这是对上线迁移有利的。

现在开发时继续遵守：

- 不直接写 SQLite 专用 SQL 参与业务流程。
- 新表先更新 `prisma/schema.prisma`。
- 初始化和字段补丁可以放在脚本里，但业务读写优先走 Prisma。

### 4.6 记录上线前需要替换的本地假设

建议在开发过程中看到这些点就记录：

- `localhost`
- `127.0.0.1`
- `file:./dev.db`
- `downloads/`
- `local-dev-auth-secret-change-before-production`
- 本地管理员账号
- 测试用 `example.com`

不要一定马上改，但要知道它们是上线前检查项。

## 5. 上线前必须完成的事

### 5.1 选择生产数据库

建议优先级：

1. PostgreSQL
2. MySQL
3. 云托管 SQLite 或文件型数据库，仅适合非常轻量部署

推荐 PostgreSQL。

原因：

- Prisma 支持成熟。
- 适合用户、订单、下载记录、分成报表等持续增长的数据。
- 部署平台普遍支持。
- 后续扩展统计、筛选、后台运营更稳。

### 5.2 切换 Prisma datasource

当前：

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

上线前可能改为：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

影响：

- 需要重新生成 Prisma Client。
- 需要执行迁移或 db push。
- 需要确认字段类型、默认值、索引和唯一约束在 PostgreSQL 下正常。

### 5.3 数据迁移

如果本地已有真实数据，上线前需要迁移：

- 剧本主数据。
- 前三集数据。
- 资源数据。
- 续作方式。
- 用户账号。
- 下载记录。
- 测试反馈。
- 续作申请。
- 订单。
- 分成项目和报表。

如果正式上线前本地数据只是测试数据，可以选择：

- 不迁移用户行为数据。
- 只重新导入 `scripts-data/*.json`。
- 后台重新创建正式管理员。

当前更推荐：

- 剧本内容用 `scripts-data/*.json` 重新导入。
- 用户、订单、分成等正式数据从线上开始产生。

### 5.4 配置生产环境变量

必须配置：

```env
DATABASE_URL="postgresql://..."
NODE_ENV="production"
AUTH_JWT_SECRET="强随机字符串"
AUTH_COOKIE_NAME="script_marketplace_session"
PORT="由平台决定或默认3000"
```

注意：

- `AUTH_JWT_SECRET` 不能使用本地默认值。
- 生产环境必须使用 HTTPS。
- 如果部署平台注入 `PORT`，不要写死端口。

### 5.5 文件存储方案

需要在上线前二选一。

#### 方案 A：继续服务器本地目录

优点：

- 简单。
- 代码改动小。
- 适合低访问量早期上线。

缺点：

- 多实例部署不方便。
- 容器重启或重新部署可能丢文件，取决于平台。
- 备份需要额外处理。

适合：

- 早期小流量。
- 文件都随代码一起发布。
- 后台暂时不需要用户上传大文件。

#### 方案 B：对象存储 / CDN

优点：

- 更适合生产。
- 文件下载稳定。
- 方便未来上传、版本管理和权限控制。

缺点：

- 要接入云服务。
- 要处理私有文件授权下载。
- 初期配置成本更高。

适合：

- 正式商业化。
- 下载文件多。
- 未来有完整包、付费包、分成交付包。

建议：

- 免费前三集包早期可以继续走本地静态目录。
- 付费完整包和分成交付包上线前最好规划对象存储或受控下载接口。

### 5.6 下载权限控制

当前 `/downloads` 是静态托管目录。

这意味着：

- 只要知道文件路径，就可以直接访问文件。
- 对免费包问题不大。
- 对付费完整包、买断包、分成包不适合。

上线前建议：

- 免费包可以继续公开静态访问。
- 付费包不要直接放公开 `/downloads`。
- 付费包通过接口校验订单或交付权限后再返回下载链接。
- 如果使用对象存储，付费资源使用短期签名 URL。

### 5.7 安全配置

上线前必须检查：

- HTTPS。
- `NODE_ENV=production`。
- 强随机 `AUTH_JWT_SECRET`。
- Cookie `secure=true` 正常生效。
- 管理后台只允许管理员访问。
- 不暴露 `.env`、数据库文件、源码目录。
- 不把 Prisma Studio 暴露到公网。
- 错误信息不要把堆栈直接返回给用户。

### 5.8 备份和恢复

上线前需要明确：

- 数据库每日自动备份。
- 重要资源文件备份。
- 如何从备份恢复。
- 谁有数据库访问权限。
- 删除和归档策略。

特别是：

- 用户下载记录。
- 订单记录。
- 分成收益报表。
- 授权和交付记录。

这些都属于商业证据链，不能随便丢。

## 6. 会影响代码结构的事项

这些不是马上要改，但要提前知道它们会牵动代码。

### 6.1 从 SQLite 切 PostgreSQL

影响范围：

- `prisma/schema.prisma`
- `.env`
- Prisma Client 生成
- 初始化脚本
- 测试数据库
- 部署流程

风险：

- 本地 `scripts/init-sqlite.js` 只适用于 SQLite。
- PostgreSQL 下可能不再需要该脚本，或要改成 Prisma migration。

建议：

- 当前继续保留 SQLite。
- 上线前开一个单独任务处理数据库迁移。

### 6.2 付费资源下载权限

影响范围：

- `DeliveryAsset`
- `Order`
- 下载接口
- 管理后台交付文件路径
- 用户中心交付列表
- 文件存储

风险：

- 如果继续把付费文件放在公开 `/downloads`，授权边界会很弱。

建议：

- 免费资源和付费资源在数据上明确区分。
- 后续新增受控下载接口，不要只靠静态目录。

### 6.3 对象存储接入

影响范围：

- 文件路径格式。
- 上传流程。
- 管理后台。
- 下载接口。
- 资源导入脚本。
- 备份策略。

建议：

- 现在保持 `filePath` 字段通用。
- 不要把路径解析逻辑散落在多个地方。

### 6.4 前后端分离部署

当前前端和后端同一个 Express 服务托管。

如果未来变成前后端分离：

- 前端可能部署到 CDN。
- 后端部署到 API 域名。
- 需要 CORS。
- Cookie 的 `sameSite`、`domain`、`secure` 需要重新配置。

建议：

- 近期继续同源部署，简单稳定。
- 除非明确要前后端分离，否则不要提前增加 CORS 复杂度。

## 7. 可以暂时不做的事

这些可以等功能稳定后再处理：

- 立刻迁 PostgreSQL。
- 立刻接对象存储。
- 立刻做复杂 CI/CD。
- 立刻做多环境数据库迁移流水线。
- 立刻做文件上传后台。
- 立刻做 CDN 和私有签名下载。

原因：

- 当前核心工作仍是产品模型、剧本生成、免费包、续作转化和后台运营。
- 过早做基础设施会拖慢业务验证。

## 8. 推荐时间线

### 当前开发期

目标：不打断功能开发。

建议完成：

- 新增 `.env.example`。
- 继续保持 `/api/...` 相对路径。
- 文档记录生产环境检查项。
- 保持 `scripts-data/*.json` 可重复导入。
- 区分免费资源和未来付费资源。

### 内测期

目标：模拟真实用户流程。

建议完成：

- 使用一台测试服务器部署。
- 仍可使用 SQLite，但要测试持久化路径。
- 用真实域名或测试域名访问。
- 检查注册、登录、下载、反馈、续作申请、后台审批。
- 检查 Cookie 在 HTTPS 下是否正常。

### 上线准备期

目标：切生产基础设施。

建议完成：

- PostgreSQL 或其他生产数据库。
- 正式 `DATABASE_URL`。
- 正式 `AUTH_JWT_SECRET`。
- 管理员账号初始化流程。
- 免费包文件存储方案。
- 付费包权限方案。
- 数据库备份策略。
- 日志和错误追踪。

### 正式上线后

目标：稳定运营。

建议持续做：

- 定期备份。
- 监控接口错误。
- 监控下载和续作转化。
- 归档旧剧本版本。
- 记录订单和分成证据链。

## 9. 上线前检查清单

### 环境变量

- `DATABASE_URL` 已使用正式数据库。
- `NODE_ENV=production`。
- `AUTH_JWT_SECRET` 已换成强随机值。
- `PORT` 由部署平台正确注入。

### 数据库

- Prisma Client 已重新生成。
- 数据表已创建。
- 剧本数据已导入。
- 管理员账号已创建。
- 备份策略已开启。

### 接口

- `/api/health` 正常。
- `/api/scripts` 正常。
- `/api/scripts/:slug` 正常。
- `/api/scripts/:slug/free-preview` 正常。
- `/api/downloads` 能记录下载。
- `/api/auth/register` 和 `/api/auth/login` 正常。
- `/api/me/*` 登录后正常。
- `/api/admin/*` 仅管理员可访问。

### 前端

- 首页能打开。
- 剧本库能显示。
- 剧本详情页能显示。
- 免费包能下载。
- 登录注册正常。
- 用户中心正常。
- 后台管理正常。

### 文件

- 免费包路径可访问。
- 付费包不公开暴露。
- 文件路径和数据库记录一致。
- 文件有备份。

### 安全

- 全站 HTTPS。
- Cookie 正常写入和清除。
- 未暴露 `.env`。
- 未暴露 SQLite 数据库文件。
- 未暴露后台给非管理员。
- 错误页面不泄露敏感堆栈。

## 10. 当前建议结论

现在不需要马上迁数据库，也不需要马上重构接口。

当前最优选择是：

1. 继续本地 SQLite 开发。
2. 保持所有业务接口用 `/api/...` 相对路径。
3. 把生产环境变量、数据库迁移、文件存储、安全配置记录清楚。
4. 等功能和商业流程基本稳定后，再集中做正式部署迁移。

这样既不会拖慢当前开发，也不会把未来上线风险埋得太深。
