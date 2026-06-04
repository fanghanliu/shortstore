# 项目目录重构规划

## 1. 文档目标

这份文档用于规划当前项目的目录整理，为后续新增后台管理系统做准备。

当前项目已经完成用户端核心业务链路：

```text
剧本库 → 剧本详情 → 下载前三集 → 注册/登录 → 用户中心 → 测试反馈 → 后续合作申请
```

但项目根目录里同时放着：

- 用户端 HTML / CSS / JS
- 后端 `server.js`
- Prisma 数据库
- 导入脚本
- 剧本 JSON 数据源
- 下载文件
- 部署测试包
- 旧的产品模板 JSON

如果直接新增后台管理系统，根目录会继续膨胀，后续维护会越来越吃力。

所以，在写后台管理系统规划前，建议先做一次低风险目录重构。

## 2. 当前目录问题

当前根目录主要问题：

1. 用户端页面和后端入口混在一起。
2. 未来后台页面没有明确位置。
3. `assets`、`downloads`、HTML 页面都由根目录静态托管。
4. `server.js` 直接 `express.static(__dirname)`，导致根目录所有静态文件都暴露出去。
5. 旧部署包、旧产品模板、当前业务代码混在一起。
6. 后续如果新增后台、管理接口、后台 CSS/JS，会更难区分职责。

当前最明显的一批用户端文件：

```text
index.html
scripts.html
script-preview.html
script-lie-scent.html
auth.html
account.html
actors.html
styles.css
site-session.js
script-detail.js
script-preview.js
script-library.js
auth.js
account.js
actors.js
app.js
assets/
```

当前后端和数据相关文件：

```text
server.js
prisma/
scripts/
scripts-data/
downloads/
package.json
package-lock.json
.env
```

当前历史/生成类文件：

```text
deploy-test-site/
deploy-test-site.zip
*.product-template.json
*_storyboard.json
store.js
build-product-template.js
```

## 3. 重构原则

### 3.1 不破坏现有 URL

第一阶段必须保持用户端现有访问路径可用：

```text
/index.html
/scripts.html
/script-preview.html?slug=lie-scent
/auth.html
/account.html
/actors.html
/assets/...
/downloads/...
```

也就是说，哪怕文件移动到 `public/site`，用户仍然应该能用旧 URL 访问。

原因：

- 当前前端链接已经互相引用这些路径。
- smoke test 和手动测试路径已经基于这些 URL。
- 过早更改 URL 会制造无意义风险。

### 3.2 先整理静态文件，不急着拆后端

第一阶段只移动用户端静态资源。

暂不拆：

```text
server.js
```

原因：

- 当前 `server.js` 已经承载认证、剧本、下载、测试反馈、后续合作等接口。
- 后台管理系统规划还没完成。
- 现在拆后端路由会同时引入目录迁移和接口重构两个变量，风险偏高。

### 3.3 后台目录先预留

第一阶段创建：

```text
public/admin/
```

但不一定马上实现后台页面。

这样后续后台页面可以明确放在：

```text
public/admin/index.html
public/admin/admin.css
public/admin/admin.js
```

后台访问路径建议：

```text
/admin/
```

### 3.4 下载文件暂时不移动

`downloads/` 暂时保留在根目录。

原因：

- 数据库 `ScriptAsset.filePath` 当前已经保存类似：

```text
downloads/free-preview-lie-scent-v1.md
downloads/last-cloud-city/free-preview-last-cloud-city-v1.md
```

- 如果现在移动下载文件，需要同步更新数据库、导入 JSON、下载接口和旧链接。
- 下载文件未来可能会迁移到对象存储或 CDN，现在不适合和前端目录整理混在一起。

### 3.5 剧本数据源暂时不移动

`scripts-data/` 暂时保留在根目录。

原因：

- 它是导入数据库的源数据，不属于前端静态页面。
- 后台以后可能会读取或生成这些数据，但不是直接前端资源。

## 4. 目标目录结构

第一阶段目标：

```text
售卖AI短剧剧本/
  public/
    site/
      index.html
      scripts.html
      script-preview.html
      script-lie-scent.html
      auth.html
      account.html
      actors.html
      styles.css
      site-session.js
      script-detail.js
      script-preview.js
      script-library.js
      auth.js
      account.js
      actors.js
      app.js
      assets/
    admin/
      .gitkeep

  downloads/
  prisma/
  scripts/
  scripts-data/
  docs/

  server.js
  package.json
  package-lock.json
  .env
  .gitignore
  .editorconfig
```

第二阶段目标，后续再做：

```text
售卖AI短剧剧本/
  server/
    index.js
    routes/
      auth.js
      scripts.js
      downloads.js
      account.js
      admin.js
    middleware/
      auth.js
    lib/
      prisma.js
```

第二阶段不在本次执行范围。

## 5. 文件迁移清单

### 5.1 移动到 public/site

建议移动：

```text
index.html
scripts.html
script-preview.html
script-lie-scent.html
auth.html
account.html
actors.html
styles.css
site-session.js
script-detail.js
script-preview.js
script-library.js
auth.js
account.js
actors.js
app.js
assets/
```

### 5.2 暂时留在根目录

保持不动：

```text
server.js
package.json
package-lock.json
.env
.gitignore
.editorconfig
downloads/
prisma/
scripts/
scripts-data/
docs/
```

### 5.3 建议后续归档

后续可以考虑移动到：

```text
archive/
```

候选文件：

```text
deploy-test-site/
deploy-test-site.zip
*.product-template.json
*_storyboard.json
store.js
build-product-template.js
```

但第一阶段不建议处理这些文件。

原因：

- 有些可能还会用于生成剧本素材。
- 是否归档需要再确认用途。

## 6. Express 静态服务改造

当前：

```js
app.use(express.static(__dirname));
```

第一阶段建议改为：

```js
const siteDir = path.join(__dirname, "public", "site");
const adminDir = path.join(__dirname, "public", "admin");

app.use(express.static(siteDir));
app.use("/admin", express.static(adminDir));
app.use("/downloads", express.static(path.join(__dirname, "downloads")));
```

同时保留 SPA fallback：

```js
app.use((request, response, next) => {
  if (request.path.startsWith("/api/")) {
    next();
    return;
  }

  response.sendFile(path.join(siteDir, "index.html"));
});
```

这样可以实现：

- 用户端旧 URL 继续可用。
- 后台静态文件从 `/admin/` 访问。
- 下载文件仍从 `/downloads/...` 访问。
- 根目录不再整体暴露为静态目录。

## 7. URL 保持策略

移动文件后，这些 URL 必须继续可用：

| URL | 目标文件 |
| --- | --- |
| `/` | `public/site/index.html` |
| `/index.html` | `public/site/index.html` |
| `/scripts.html` | `public/site/scripts.html` |
| `/script-preview.html?slug=...` | `public/site/script-preview.html` |
| `/auth.html` | `public/site/auth.html` |
| `/account.html` | `public/site/account.html` |
| `/actors.html` | `public/site/actors.html` |
| `/assets/...` | `public/site/assets/...` |
| `/downloads/...` | `downloads/...` |
| `/admin/` | `public/admin/index.html`，后续新增 |

## 8. 需要注意的路径引用

### 8.1 CSS 引用

HTML 当前引用：

```html
<link rel="stylesheet" href="styles.css">
```

移动到 `public/site` 后仍然成立，因为 HTML 和 CSS 仍在同一目录。

### 8.2 JS 引用

例如：

```html
<script src="site-session.js"></script>
<script src="account.js"></script>
```

移动后仍然成立，因为 JS 和 HTML 仍在同一目录。

### 8.3 assets 引用

当前 CSS 和 HTML 多处引用：

```text
assets/...
```

移动 `assets/` 到 `public/site/assets/` 后仍然成立。

### 8.4 downloads 引用

当前下载接口返回：

```js
downloadUrl: `/${asset.filePath}`
```

只要 Express 继续挂载：

```js
app.use("/downloads", express.static(path.join(__dirname, "downloads")));
```

就不需要改数据库里的 `filePath`。

## 9. 不建议做的事

第一阶段不建议：

- 把 `downloads/` 移进 `public/site`。
- 把 `server.js` 同时拆成多个路由文件。
- 修改所有前端 URL 为 `/site/...`。
- 删除旧 JSON、旧生成脚本或部署包。
- 把后台和用户端共用同一个 HTML/CSS 文件。
- 在目录迁移同时新增大量后台功能。

## 10. 推荐实施步骤

### Step 1：创建目录

```text
public/site/
public/admin/
```

### Step 2：移动用户端静态文件

移动：

```text
*.html
styles.css
site-session.js
script-detail.js
script-preview.js
script-library.js
auth.js
account.js
actors.js
app.js
assets/
```

但不要移动：

```text
server.js
scripts/
prisma/
downloads/
scripts-data/
docs/
```

### Step 3：新增后台占位文件

新增：

```text
public/admin/index.html
public/admin/admin.css
public/admin/admin.js
```

第一版只显示：

```text
后台管理系统建设中
```

用于验证 `/admin/` 路由。

### Step 4：修改 server.js 静态服务

替换：

```js
app.use(express.static(__dirname));
```

为：

```js
const siteDir = path.join(__dirname, "public", "site");
const adminDir = path.join(__dirname, "public", "admin");

app.use(express.static(siteDir));
app.use("/admin", express.static(adminDir));
app.use("/downloads", express.static(path.join(__dirname, "downloads")));
```

并把 fallback 改为：

```js
response.sendFile(path.join(siteDir, "index.html"));
```

### Step 5：更新检查脚本

`scripts/check-text-encoding.js` 已经递归扫描项目文件。

移动后应确认它仍然能扫描：

```text
public/site/
public/admin/
```

通常无需修改。

### Step 6：更新 smoke test 页面检查

当前 API smoke test 主要检查接口。

如果后续要增强，可以检查：

```text
/account.html
/auth.html
/scripts.html
/script-preview.html?slug=lie-scent
/admin/
```

## 11. 验收标准

目录重构完成后，必须通过：

```text
npm.cmd run check:text
npm.cmd run test:api
node --check server.js
node --check public/site/account.js
node --check public/site/auth.js
node --check public/site/script-detail.js
```

并手动或脚本确认以下页面返回 200：

```text
/
/scripts.html
/script-preview.html?slug=lie-scent
/auth.html
/account.html
/admin/
/downloads/free-preview-lie-scent-v1.md
```

## 12. 风险点

### 12.1 assets 路径断裂

如果 `assets/` 没有跟随移动到 `public/site/assets/`，页面图片会丢失。

### 12.2 下载路径断裂

如果忘记挂载 `/downloads`，下载按钮会成功写记录但文件无法下载。

### 12.3 fallback 指向错误

如果 fallback 仍然指向根目录 `index.html`，移动后访问未知前端路径会失败。

### 12.4 admin 静态目录优先级

`/admin` 静态挂载应放在 API fallback 前。

否则 `/admin/` 可能会被 fallback 到用户端首页。

## 13. 当前建议

下一步可以正式执行 Phase 1 目录整理：

```text
创建 public/site 和 public/admin
移动用户端静态文件
新增 admin 占位页
修改 server.js 静态挂载
跑 check:text 和 test:api
确认核心 URL 仍然 200
```

等目录稳定后，再写：

```text
docs/admin-mvp-plan.md
```

这样后台管理系统会有清晰落点，不会继续把根目录撑大。

