# 腾讯云轻量服务器测试环境部署指南

## 1. 推荐路线

当前测试环境建议采用：

```text
腾讯云轻量应用服务器
  + Ubuntu
  + Node.js
  + PostgreSQL
  + PM2
  + Nginx
```

这条路线适合现在的原因：

- 腾讯云后台中文，操作体验更顺。
- 轻量服务器成本低，适合 staging。
- 服务器里可以同时跑 Node/Express 和 PostgreSQL。
- 后续正式生产可以升级为 CVM + 云数据库 PostgreSQL。
- 当前项目的 Express 同源接口 `/api/...` 可以保持不变。

## 2. 购买服务器建议

### 地域选择

如果只是测试环境，建议优先：

```text
中国香港
```

原因：

- 中文云平台后台。
- 测试阶段通常不需要 ICP 备案。
- 访问速度对国内用户相对可接受。

如果选择中国大陆地域：

- 直接用 IP + 端口测试通常可以。
- 如果绑定域名并对公网提供网站访问，通常需要 ICP 备案。

### 配置建议

测试环境建议：

```text
2核 CPU
2GB 或 4GB 内存
40GB SSD
Ubuntu 22.04 LTS
```

如果预算允许，选 4GB 内存更舒服。PostgreSQL、Node、PM2、Nginx 同机跑，2GB 也能用，但余量小。

### 端口放行

腾讯云防火墙/安全组至少放行：

| 端口 | 用途 |
| --- | --- |
| 22 | SSH 登录 |
| 80 | HTTP |
| 443 | HTTPS |
| 3000 | 临时直接访问 Node 服务，可测试后关闭 |

后续正式一点可以只开放 80/443，把 3000 留给本机 Nginx 反代。

## 3. 本地项目准备

在推送 GitHub 前确认：

```powershell
npm.cmd run check:text
node --check scripts\write-postgres-prisma-schema.js
node --check scripts\staging-smoke-check.js
```

需要提交到 GitHub 的 staging 支持文件：

```text
.env.example
.env.staging.example
scripts/write-postgres-prisma-schema.js
scripts/staging-smoke-check.js
docs/staging-environment-setup.md
docs/tencent-cloud-staging-deployment-guide.md
package.json
.gitignore
```

不要提交：

```text
.env
.env.*
prisma/dev.db
node_modules/
```

## 4. 服务器初始化

以下命令都在服务器 SSH 里执行。

### 4.1 更新系统

```bash
sudo apt update
sudo apt upgrade -y
```

### 4.2 安装基础工具

```bash
sudo apt install -y git curl build-essential nginx postgresql postgresql-contrib
```

### 4.3 安装 Node.js

建议安装 Node.js 22 LTS：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### 4.4 安装 PM2

```bash
sudo npm install -g pm2
pm2 -v
```

PM2 用来让 Node 服务后台常驻。

## 5. 配置 PostgreSQL 测试库

### 5.1 进入 PostgreSQL

```bash
sudo -u postgres psql
```

### 5.2 创建数据库和用户

在 psql 里执行：

```sql
CREATE DATABASE script_marketplace_staging;
CREATE USER script_staging_user WITH ENCRYPTED PASSWORD '替换成强密码';
GRANT ALL PRIVILEGES ON DATABASE script_marketplace_staging TO script_staging_user;
\q
```

PostgreSQL 15+ 可能还需要给 schema 权限：

```bash
sudo -u postgres psql -d script_marketplace_staging
```

进入后执行：

```sql
GRANT ALL ON SCHEMA public TO script_staging_user;
\q
```

### 5.3 数据库连接串

本机 PostgreSQL 连接串格式：

```text
postgresql://script_staging_user:你的密码@127.0.0.1:5432/script_marketplace_staging
```

这个会填到服务器项目的 `.env.staging`。

## 6. 拉取项目代码

进入你希望放项目的目录：

```bash
mkdir -p ~/apps
cd ~/apps
```

克隆 GitHub 仓库：

```bash
git clone 你的GitHub仓库地址 script-marketplace-staging
cd script-marketplace-staging
```

安装依赖：

```bash
npm install
```

## 7. 配置服务器环境变量

在项目根目录创建 `.env.staging`：

```bash
nano .env.staging
```

内容示例：

```env
DATABASE_URL="postgresql://script_staging_user:你的密码@127.0.0.1:5432/script_marketplace_staging"
NODE_ENV="production"
AUTH_COOKIE_NAME="script_marketplace_session"
AUTH_JWT_SECRET="替换成测试环境强随机字符串"
```

保存后不要提交这个文件。

当前 `.gitignore` 已忽略 `.env.*`。

## 8. 初始化测试数据库

服务器上执行：

```bash
set -a
source .env.staging
set +a
npm run db:generate:staging
npm run db:push:staging
npm run import:script -- scripts-data/*.json
```

说明：

- `db:generate:staging` 生成 PostgreSQL 版 Prisma Client。
- `db:push:staging` 把表结构同步到 PostgreSQL 测试库。
- `import:script` 导入剧本内容。

如果后续正式生产部署，应改用 migration，不长期依赖 `db push`。

## 9. 启动 Node 服务

先用命令直接测试：

```bash
set -a
source .env.staging
set +a
npm start
```

看到类似：

```text
API server is running at http://localhost:3000
```

说明服务启动成功。

此时可以在浏览器访问：

```text
http://服务器公网IP:3000
```

测试通过后，停止前台进程，然后用 PM2 启动。

### PM2 启动

```bash
set -a
source .env.staging
set +a
pm2 start server.js --name script-marketplace-staging
pm2 save
```

设置开机自启：

```bash
pm2 startup
```

它会输出一行 `sudo env PATH=... pm2 startup ...` 命令，复制执行即可。

## 10. 配置 Nginx 反向代理

创建配置：

```bash
sudo nano /etc/nginx/sites-available/script-marketplace-staging
```

如果还没有域名，先用服务器 IP：

```nginx
server {
    listen 80;
    server_name _;

    client_max_body_size 50m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/script-marketplace-staging /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

然后访问：

```text
http://服务器公网IP
```

## 11. HTTPS 和域名

测试阶段可以先用 IP + HTTP 验证功能。

但如果你把 `NODE_ENV=production`，Cookie 设置里会启用：

```js
secure: process.env.NODE_ENV === "production"
```

这意味着：

- HTTP 下 Cookie 可能无法正常写入。
- 登录流程最好在 HTTPS 下最终验收。

如果你有测试域名，可以配置域名解析到服务器 IP，然后安装 Certbot：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d 你的测试域名
```

没有域名时，可以先临时把 `.env.staging` 里的 `NODE_ENV` 改成：

```env
NODE_ENV="development"
```

用于 HTTP 测试登录。等有 HTTPS 后再改回：

```env
NODE_ENV="production"
```

注意：这只是测试过渡方案，正式环境必须 HTTPS + `NODE_ENV=production`。

## 12. 本地远程冒烟检查

如果你用 IP：

```powershell
npm.cmd run test:staging -- http://服务器公网IP
```

如果你配置了域名：

```powershell
npm.cmd run test:staging -- https://你的测试域名
```

这个脚本只读检查：

- `/api/health`
- 首页
- 剧本列表
- 剧本详情
- 免费包元数据

它不会创建用户、订单或后台数据。

## 13. 人工测试清单

### 页面

- 首页能打开。
- 剧本库能打开。
- 剧本详情页能打开。
- 手机端布局正常。
- 图片资源正常。

### 下载

- 免费包弹窗能打开。
- 授权确认能勾选。
- 能下载 `.docx`。
- 下载记录能写入数据库。

### 用户

- 注册。
- 登录。
- 退出。
- 用户中心。
- 下载记录绑定。
- 测试反馈提交。
- 续作申请提交。

### 后台

- 创建测试管理员。
- 管理员能登录后台。
- 非管理员不能访问后台。
- 下载、用户、反馈、续作、订单、分成页面能加载。

## 14. 常见问题

### 端口 3000 访问不了

检查：

```bash
pm2 list
sudo ufw status
sudo systemctl status nginx
```

同时确认腾讯云防火墙放行 3000，或者改走 Nginx 的 80 端口。

### 数据库连接失败

检查：

```bash
echo $DATABASE_URL
sudo systemctl status postgresql
```

确认密码、数据库名、用户名正确。

### 剧本列表为空

重新导入：

```bash
set -a
source .env.staging
set +a
npm run import:script -- scripts-data/*.json
```

### 登录后没有保持状态

如果使用 HTTP 且 `NODE_ENV=production`，Cookie 可能因为 `secure=true` 不写入。

解决：

- 配置 HTTPS。
- 或测试阶段临时使用 `NODE_ENV=development`。

### Nginx 502

通常是 Node 服务没启动。

检查：

```bash
pm2 logs script-marketplace-staging
pm2 restart script-marketplace-staging
```

## 15. 当前推荐执行顺序

1. 买腾讯云轻量服务器，推荐香港 Ubuntu 22.04。
2. 放行 22、80、443、3000。
3. SSH 登录服务器。
4. 安装 git、Node.js、PostgreSQL、Nginx、PM2。
5. 创建测试 PostgreSQL 数据库。
6. 克隆 GitHub 项目。
7. 创建 `.env.staging`。
8. 执行 staging 数据库初始化和导入。
9. 用 PM2 启动 Node。
10. 配置 Nginx。
11. 本地跑 `test:staging`。
12. 人工测试完整流程。

跑通这套之后，再决定是否把正式生产也部署在腾讯云，或者升级为云数据库 PostgreSQL。
