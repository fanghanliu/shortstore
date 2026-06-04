# 文件存储演进计划

## 1. 背景

项目接下来会把用户下载的剧本内容统一升级为 `.docx`。

这会带来一个新的问题：

如果未来平台有成千上万部剧本，每套剧本又有免费包、按集包、买断包、分成批次包，那么所有文件都放在本地 `downloads/` 目录里，长期一定不可持续。

因此需要提前明确文件存储策略。

本计划的核心判断是：

MVP 验证阶段可以本地存储，但系统设计不能被本地存储锁死。

## 2. 当前阶段结论

### 2.1 MVP 阶段先用本地存储

当前阶段仍建议先把 `.docx` 生成到本地：

```text
downloads/{slug}/free-preview-{slug}-v1.docx
downloads/{slug}/deliveries/episodes-4-8-package-v1.docx
downloads/{slug}/deliveries/buyout-full-package-v1.docx
downloads/{slug}/deliveries/revenue-share-episodes-4-10-package-v1.docx
```

原因：

- 当前只有少量剧本。
- 目标是验证用户是否愿意下载和使用。
- 本地文件最容易调试。
- 不需要提前引入云服务、权限、签名 URL、CDN 等复杂度。
- 现阶段最大的风险不是存储容量，而是商业模式能否被用户接受。

所以第一阶段不需要为了未来的百万文件规模，提前接对象存储。

### 2.2 但不能长期依赖本地目录

本地存储不适合长期商用，尤其不适合：

- 上千套剧本。
- 多版本交付。
- 大量用户同时下载。
- 付费内容权限控制。
- 防止用户转发真实下载地址。
- 多服务器部署。
- 自动备份和容灾。
- CDN 加速。

因此，当前生成 `.docx` 可以落本地，但下载流程、数据库字段和代码结构要为对象存储预留空间。

## 3. 分阶段存储策略

### 阶段一：本地存储

适用阶段：

- 当前 MVP。
- 小范围用户验证。
- 剧本数量少于 100 套。
- 下载量较低。
- 仍以人工运营和人工审核为主。

文件位置：

```text
downloads/
```

数据库记录：

```text
filePath = downloads/lie-scent/free-preview-lie-scent-v1.docx
fileFormat = docx
```

优点：

- 简单。
- 成本低。
- 方便本地生成。
- 方便人工检查。
- 不依赖云服务。

缺点：

- 不适合扩容。
- 不适合多服务器。
- 文件安全弱。
- 付费内容容易被直接访问。
- 迁移时需要重新同步文件。

### 阶段二：本地存储 + 后端下载接口

适用阶段：

- MVP 测试准备对外。
- 免费包和交付包都已变成 `.docx`。
- 需要控制用户看到的下载文件名。
- 需要为付费交付增加权限校验。

文件仍在本地：

```text
downloads/
```

但用户不直接访问：

```text
/downloads/lie-scent/free-preview-lie-scent-v1.docx
```

而是访问：

```text
/api/download-files/script-assets/{assetId}
/api/download-files/delivery-assets/{assetId}
```

后端接口负责：

- 查数据库。
- 校验权限。
- 找到本地文件。
- 设置中文下载文件名。
- 返回文件流。

这一阶段是从本地存储迁移到对象存储前最关键的一层抽象。

只要下载接口做好，未来从本地换成 OSS / COS / S3 / R2 时，前端不需要大改。

### 阶段三：对象存储

适用阶段：

- 商业模型已被验证。
- 剧本数量持续增长。
- 下载量明显增加。
- 付费交付和分成交付开始变多。
- 需要稳定备份和权限控制。
- 需要 CDN 加速。

候选方案：

- 阿里云 OSS。
- 腾讯云 COS。
- 七牛云 Kodo。
- AWS S3。
- Cloudflare R2。

推荐优先级：

如果主要用户在国内：

```text
腾讯云 COS / 阿里云 OSS
```

如果未来面向海外或希望降低出口成本：

```text
Cloudflare R2 / AWS S3
```

对象存储文件路径建议：

```text
scripts/{slug}/free-preview-v1.docx
scripts/{slug}/deliveries/buyout-full-package-v1.docx
scripts/{slug}/deliveries/episodes-4-8-package-v1.docx
scripts/{slug}/deliveries/revenue-share-episodes-4-10-package-v1.docx
```

用户仍然访问后端接口：

```text
/api/download-files/...
```

后端根据数据库里的存储信息去对象存储取文件，或生成短期签名 URL。

## 4. 数据库字段演进

### 4.1 当前字段

当前主要字段：

```text
ScriptAsset.filePath
ScriptAsset.fileFormat
DeliveryAsset.filePath
DeliveryAsset.fileFormat
```

这些字段可以支撑 MVP，但表达能力不足。

`filePath` 现在同时承担了多个含义：

- 本地路径。
- 下载路径。
- 未来可能的对象存储 key。
- 用户可能看到的路径。

这会在后续变复杂。

### 4.2 建议新增字段

后续建议给 `ScriptAsset` 和 `DeliveryAsset` 都增加：

```text
storageProvider String @default("local")
storageKey      String?
downloadName    String?
mimeType        String?
```

含义：

| 字段 | 示例 | 含义 |
| --- | --- | --- |
| `storageProvider` | `local` / `oss` / `cos` / `s3` / `r2` | 文件存储位置类型 |
| `storageKey` | `scripts/lie-scent/free-preview-v1.docx` | 存储系统中的文件 key |
| `filePath` | `downloads/lie-scent/free-preview-lie-scent-v1.docx` | MVP 阶段兼容字段 |
| `fileFormat` | `docx` | 文件格式 |
| `downloadName` | `她闻到谎言-前三集免费验证包.docx` | 用户下载时看到的文件名 |
| `mimeType` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | 响应类型 |

### 4.3 MVP 阶段最小字段选择

为了避免现在改太多数据库，MVP 可以先只新增：

```text
downloadName String?
```

理由：

- 当前最急的是让用户下载 `.docx`，并看到中文文件名。
- `filePath` 暂时仍能表达本地路径。
- `fileFormat = docx` 已经足够。
- `storageProvider / storageKey / mimeType` 可以在迁移对象存储前再加。

但代码层面要避免假设文件一定来自本地。

## 5. 下载接口设计

### 5.1 统一下载入口

无论文件来自本地还是对象存储，前端都应该使用：

```text
GET /api/download-files/script-assets/:id
GET /api/download-files/delivery-assets/:id
```

不要让前端直接拼：

```text
/{filePath}
```

### 5.2 ScriptAsset 下载权限

用于免费前三集验证包。

接口逻辑：

1. 查找 `ScriptAsset`。
2. 确认资源状态是 `published`。
3. 确认资源是公开资源，或用户有权限。
4. 记录下载行为，或与 `POST /api/downloads` 配合。
5. 返回文件。

免费包可以允许游客下载，但依然建议通过接口返回文件名。

### 5.3 DeliveryAsset 下载权限

用于买断、按集、分成后续交付。

接口逻辑：

1. 用户必须登录。
2. 查找 `DeliveryAsset`。
3. 关联 `Delivery`。
4. 校验 `Delivery.userId === currentUser.id`。
5. 校验 `Delivery.status` 是 `ready` 或 `delivered`。
6. 返回文件。

这样即使用户知道 asset id，也不能下载别人的交付文件。

### 5.4 下载文件名

后端必须设置：

```http
Content-Disposition: attachment; filename*=UTF-8''...
```

不能只依赖：

```html
<a download="xxx.docx">
```

原因：

- 浏览器行为不完全一致。
- 未来对象存储签名 URL 不一定保留前端 download 名称。
- 后端统一控制更稳定。

## 6. 本地文件服务封装

建议未来新增一个内部服务模块：

```text
server/file-storage.js
```

或在当前结构中先放：

```text
storage.js
```

职责：

```js
getFileStream(asset)
getFileMetadata(asset)
buildDownloadName(asset)
assertFileExists(asset)
```

MVP 阶段：

```text
storageProvider = local
filePath -> 本地文件路径
```

未来对象存储阶段：

```text
storageProvider = oss / cos / s3 / r2
storageKey -> 对象存储 key
```

这样主业务代码不用关心文件到底在哪里。

## 7. 迁移触发条件

不建议现在立刻接对象存储。

建议满足以下任意条件时开始迁移：

- 剧本数量超过 100 套。
- DOCX 文件总量超过 1GB。
- 每周真实下载超过 500 次。
- 付费交付开始真实发生。
- 分成合作用户超过 10 个。
- 需要部署到云服务器或多环境。
- 需要防止用户直接分享付费文件链接。
- 需要文件备份、CDN 加速或访问日志。

在这些条件出现前，本地存储足够支撑验证。

## 8. 本地存储期间的注意事项

### 8.1 不要把用户上传文件和系统生成文件混在一起

建议区分：

```text
downloads/       系统生成交付文件
uploads/         用户提交的证明材料
```

当前分成回传证明材料可以先填路径或链接，不做真实上传。

未来如果做上传，不要直接放进 `downloads/`。

### 8.2 不要把付费文件长期放公开目录

短期测试可以接受。

但当出现真实付费交付后：

- 免费包可以公开。
- 付费包和分成包必须走权限接口。
- 后续应移到非公开目录或对象存储私有桶。

### 8.3 文件生成和数据库记录要一致

生成 docx 后，要保证：

```text
数据库 filePath 存在
fileFormat = docx
downloadName 正确
文件真实存在
```

导入脚本应检查文件是否存在。

### 8.4 本地备份

即使是 MVP，也建议定期备份：

```text
prisma/dev.db
downloads/
scripts-data/
```

否则一旦本地目录丢失，数据库里仍有文件路径，但文件不存在。

## 9. 对象存储迁移路径

### Step 1：补字段

给资源表增加：

```text
storageProvider
storageKey
downloadName
mimeType
```

### Step 2：封装下载服务

所有下载入口都调用同一个文件服务。

### Step 3：上传历史文件

把本地：

```text
downloads/
```

同步到对象存储：

```text
scripts/
```

### Step 4：回填数据库

批量更新：

```text
storageProvider = cos / oss / s3 / r2
storageKey = scripts/{slug}/...
```

保留旧 `filePath` 一段时间用于回滚。

### Step 5：切换读取逻辑

下载接口根据 `storageProvider`：

- `local`：读取本地文件。
- `oss/cos/s3/r2`：生成签名 URL 或代理下载。

### Step 6：关闭公开静态下载

当所有前端都改为下载接口后，逐步取消：

```js
app.use("/downloads", express.static(downloadsDir));
```

或只保留免费公开资源。

## 10. 推荐执行顺序

当前建议不要先做对象存储。

推荐顺序：

1. 先生成本地 `.docx`。
2. 更新资源路径为 `.docx`。
3. 增加 `downloadName` 或动态下载名。
4. 新增后端下载接口。
5. 前端下载入口切换到接口。
6. 真实用户测试。
7. 根据下载量和付费情况决定是否迁移对象存储。

## 11. 和 DOCX 计划的关系

`docs/docx-delivery-format-plan.md` 解决的是：

用户下载什么格式、文件结构是什么、下载名称怎么设计。

本文档解决的是：

文件存在哪里、以后如何从本地迁移到对象存储、代码如何避免被本地路径锁死。

两份文档应配合执行：

```text
DOCX 格式计划 -> 解决交付体验
文件存储演进计划 -> 解决存储扩展和权限控制
```

## 12. 当前最终结论

现在可以先把 `.docx` 存在本地。

但从下一轮代码改造开始，要遵守三条底线：

1. 用户下载入口逐步改成后端接口。
2. 用户看到的文件名不能等于内部路径名。
3. 付费和分成交付不能长期依赖公开 `/downloads` 静态目录。

只要守住这三条，当前本地存储方案就不会阻碍未来扩展到对象存储。
