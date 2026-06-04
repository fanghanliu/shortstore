# 用户交付文件 DOCX 格式升级计划

## 1. 背景

当前用户下载的免费前三集验证包主要是 `.md` 文件。

Markdown 对开发和内部维护很友好，但对真实用户不友好：

- 用户可能不知道怎么打开。
- 打开后排版依赖不同软件，观感不稳定。
- 内容容易显得像临时文本，而不是正式交付物。
- 剧情、分镜、提示词、授权说明混在一起时，层次感不够。
- 对短视频创作者、团队负责人或商务合作用户来说，`.md` 专业感不足。

因此，后续需要把用户可下载内容统一升级为 `.docx`。

这里的范围不只是免费前三集，而是：

所有用户下载到本地的剧本内容，都应是 `.docx`。

包括：

- 免费前三集验证包。
- 买断完整剧本交付包。
- 按集购买交付包。
- 版权分成第一批交付包。
- 版权分成后续批次交付包。
- 可能出现的授权说明、使用说明、制作指南，只要是面向用户下载的内容，也应优先提供 `.docx`。

## 2. 核心原则

### 原则一：内部格式和用户格式分离

内部仍然可以继续使用：

- `.json`：用于结构化入库、页面展示、脚本导入。
- `.md`：用于内容草稿、人工编辑、版本管理。
- 数据库字段：用于接口、后台和前端读取。

用户下载统一使用：

- `.docx`

也就是：

```text
内部生产和维护：JSON / Markdown
用户正式交付：DOCX
```

这样既保留开发效率，也提高用户体验和商业可信度。

### 原则二：所有用户交付文件统一 DOCX

不允许出现以下情况：

- 免费包是 `.docx`，后续买断还是 `.md`。
- 按集购买是 `.md`，版权分成是 `.docx`。
- 用户中心有的文件是 `.md`，有的文件是 `.docx`。

用户视角必须统一：

我下载到的剧本文件，都是 Word 文档。

### 原则三：下载文件名必须面向用户

用户下载时看到的文件名不能是内部文件名，例如：

```text
free-preview-lie-scent-v1.docx
revenue-share-episodes-4-10-package-v1.docx
episodes-4-8-package-v1.docx
```

这些适合内部路径，不适合作为用户下载名称。

用户下载名称应使用剧本名称和交付范围，例如：

```text
她闻到谎言-前三集免费验证包.docx
她闻到谎言-第4-8集按集购买交付包.docx
她闻到谎言-完整买断交付包.docx
她闻到谎言-第4-10集分成合作交付包.docx
```

如果剧本名称含有特殊符号，需要清理为安全文件名。

### 原则四：不要直接暴露内部文件路径

长期来看，用户下载不应直接访问：

```text
/downloads/xxx/xxx.docx
```

更合理的是通过下载接口：

```text
GET /api/download-files/script-assets/:assetId
GET /api/download-files/delivery-assets/:assetId
```

接口负责：

- 校验用户权限。
- 找到真实文件路径。
- 设置 `Content-Disposition` 下载文件名。
- 返回 `.docx` 文件。

MVP 可以暂时保留 `/downloads/...` 静态访问，但正式用户测试前，建议至少对用户中心和详情页下载入口改成接口下载。

## 3. 文件类型范围

### 3.1 免费前三集验证包

对应表：

```text
ScriptAsset
```

典型资源：

```text
assetType = free_preview
fileFormat = docx
```

用户下载名：

```text
{剧本名}-前三集免费验证包.docx
```

示例：

```text
她闻到谎言-前三集免费验证包.docx
```

### 3.2 买断完整剧本交付包

对应表：

```text
Delivery
DeliveryAsset
```

典型资源：

```text
deliveryType = buyout
fileFormat = docx
```

用户下载名：

```text
{剧本名}-完整买断交付包.docx
```

示例：

```text
她闻到谎言-完整买断交付包.docx
```

### 3.3 按集购买交付包

对应表：

```text
Delivery
DeliveryAsset
```

典型资源：

```text
deliveryType = pay_per_episode
fileFormat = docx
```

用户下载名：

```text
{剧本名}-第{start}-{end}集按集购买交付包.docx
```

如果不是连续集数：

```text
{剧本名}-第4,6,8集按集购买交付包.docx
```

示例：

```text
她闻到谎言-第4-8集按集购买交付包.docx
```

### 3.4 版权分成批次交付包

对应表：

```text
RevenueShareBatch
Delivery
DeliveryAsset
```

典型资源：

```text
deliveryType = revenue_share
fileFormat = docx
```

用户下载名：

```text
{剧本名}-第{start}-{end}集分成合作交付包.docx
```

示例：

```text
她闻到谎言-第4-10集分成合作交付包.docx
```

### 3.5 使用说明和授权说明

如果作为单独文件交付，也应使用 `.docx`：

```text
{剧本名}-使用说明.docx
{剧本名}-授权说明.docx
```

但更建议在 MVP 阶段把说明合并进主交付文档，避免用户下载多个文件后混乱。

## 4. DOCX 内容结构

### 4.1 免费前三集验证包结构

建议结构：

```text
封面
1. 剧本基本信息
2. 免费验证包使用说明
3. 授权边界
4. 制作测试建议
5. 第1集
   5.1 剧情正文
   5.2 分镜拆解
   5.3 角色与场景提示
   5.4 AI 中文提示词
   5.5 AI 英文提示词
   5.6 结尾钩子
6. 第2集
7. 第3集
8. 发布测试记录表
9. 后续合作方式
```

### 4.2 买断完整交付包结构

建议结构：

```text
封面
1. 买断交付说明
2. 授权范围
3. 使用限制
4. 完整剧集目录
5. 分集正文
6. 分镜拆解
7. AI 中文提示词
8. AI 英文提示词
9. 角色设定
10. 场景设定
11. 发布和运营建议
12. 交付确认说明
```

### 4.3 按集购买交付包结构

建议结构：

```text
封面
1. 本次购买范围
2. 授权范围
3. 不包含内容说明
4. 本批次剧集目录
5. 分集正文
6. 分镜拆解
7. AI 中文提示词
8. AI 英文提示词
9. 本批次发布建议
10. 后续购买说明
```

### 4.4 版权分成批次交付包结构

建议结构：

```text
封面
1. 分成合作交付说明
2. 本批次开放范围
3. 授权平台和账号
4. 数据回传要求
5. 收益结算提醒
6. 本批次剧集目录
7. 分集正文
8. 分镜拆解
9. AI 中文提示词
10. AI 英文提示词
11. 月度回传清单
12. 下一批交付条件
```

## 5. 数据库字段建议

当前已有：

```text
ScriptAsset.filePath
ScriptAsset.fileFormat
DeliveryAsset.filePath
DeliveryAsset.fileFormat
```

为了支持用户下载名，建议新增字段：

```text
ScriptAsset.downloadName String?
DeliveryAsset.downloadName String?
```

字段含义：

| 字段 | 用途 |
| --- | --- |
| `filePath` | 服务器内部真实路径 |
| `fileFormat` | 文件格式，用户交付统一为 `docx` |
| `downloadName` | 用户下载时看到的文件名 |

如果短期不新增字段，也可以在接口中动态生成下载名称。

但长期建议落库，原因是：

- 后台可以直接查看和修改下载名。
- 不同交付包可能需要人工命名。
- 买断、按集、分成的命名规则不完全一样。
- 方便后续对象存储或私有文件服务迁移。

## 6. 文件路径规范

内部文件路径仍然可以用英文 slug，避免系统路径问题。

建议：

```text
downloads/
  lie-scent/
    free-preview-lie-scent-v1.docx
    deliveries/
      buyout-full-package-v1.docx
      episodes-4-8-package-v1.docx
      revenue-share-episodes-4-10-package-v1.docx
```

用户下载名则使用中文：

```text
她闻到谎言-前三集免费验证包.docx
她闻到谎言-完整买断交付包.docx
她闻到谎言-第4-8集按集购买交付包.docx
她闻到谎言-第4-10集分成合作交付包.docx
```

也就是：

```text
服务器路径：稳定、英文、可维护
用户文件名：中文、清楚、专业
```

## 7. 生成脚本设计

建议新增：

```text
scripts/generate-docx-deliveries.js
```

职责：

1. 读取 `scripts-data/*.json`。
2. 根据剧本数据生成免费前三集 docx。
3. 根据交付类型生成不同结构的 docx。
4. 输出到 `downloads/{slug}/...`。
5. 可选更新资源 JSON 中的 `filePath / fileFormat / downloadName`。

### 7.1 免费包生成命令

```bash
node scripts/generate-docx-deliveries.js --type free_preview --slug lie-scent
```

输出：

```text
downloads/lie-scent/free-preview-lie-scent-v1.docx
```

建议下载名：

```text
她闻到谎言-前三集免费验证包.docx
```

### 7.2 按集包生成命令

```bash
node scripts/generate-docx-deliveries.js --type pay_per_episode --slug lie-scent --episodes 4-8
```

输出：

```text
downloads/lie-scent/deliveries/episodes-4-8-package-v1.docx
```

建议下载名：

```text
她闻到谎言-第4-8集按集购买交付包.docx
```

### 7.3 买断包生成命令

```bash
node scripts/generate-docx-deliveries.js --type buyout --slug lie-scent
```

输出：

```text
downloads/lie-scent/deliveries/buyout-full-package-v1.docx
```

建议下载名：

```text
她闻到谎言-完整买断交付包.docx
```

### 7.4 分成批次包生成命令

```bash
node scripts/generate-docx-deliveries.js --type revenue_share --slug lie-scent --episodes 4-10
```

输出：

```text
downloads/lie-scent/deliveries/revenue-share-episodes-4-10-package-v1.docx
```

建议下载名：

```text
她闻到谎言-第4-10集分成合作交付包.docx
```

## 8. 推荐技术方案

建议使用 npm 包：

```bash
npm install docx
```

原因：

- 可以直接用 Node 生成 `.docx`。
- 不依赖本机 Word 或 WPS。
- 适合当前项目栈。
- 可以从 JSON 数据生成结构化 Word 文档。
- 后续可以自动批量生成多套剧本交付包。

暂不建议第一阶段使用：

- 手动复制到 Word。
- Pandoc。
- LibreOffice 命令行转换。

这些方式要么不可控，要么依赖外部软件，要么不利于后续批量生成。

## 9. 接口改造建议

### 9.1 免费包下载接口

当前可能是：

```text
POST /api/downloads
返回 downloadUrl: /downloads/xxx.md
```

建议改成：

```text
POST /api/downloads
返回 downloadUrl: /api/download-files/script-assets/{assetId}
```

前端仍然点击下载，但实际走接口。

接口返回时设置：

```http
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename*=UTF-8''%E5%A5%B9%E9%97%BB%E5%88%B0%E8%B0%8E%E8%A8%80-%E5%89%8D%E4%B8%89%E9%9B%86%E5%85%8D%E8%B4%B9%E9%AA%8C%E8%AF%81%E5%8C%85.docx
```

### 9.2 交付文件下载接口

用户中心“我的交付”不应直接使用：

```text
/{asset.filePath}
```

应改成：

```text
/api/download-files/delivery-assets/{assetId}
```

接口需要校验：

- 当前用户已登录。
- 当前 `DeliveryAsset` 关联的 `Delivery.userId` 是当前用户。
- `Delivery.status` 是 `ready` 或 `delivered`。
- 文件格式是 `docx`。
- 文件存在。

## 10. 前端改造点

### 10.1 剧本详情页

位置：

```text
public/site/script-preview.js
```

需要调整：

- 文件格式展示从 `MD` 改为 `DOCX`。
- 下载按钮不再直接指向 `asset.filePath`。
- 下载按钮使用后端返回的下载接口 URL。
- 文案从“Markdown 文件”改为“Word 文档”。

### 10.2 用户中心下载记录

位置：

```text
public/site/account.js
```

需要调整：

- “重新下载”按钮使用接口。
- 文件格式展示为 `DOCX`。
- 下载按钮文案可改为“下载 Word 文档”。

### 10.3 用户中心交付内容

位置：

```text
public/site/account.js
```

需要调整：

- `DeliveryAsset` 下载链接使用接口。
- 后续剧集交付文件显示为 Word 文档。
- 按交付类型展示更清楚的文件名。

### 10.4 后台审批交付表单

位置：

```text
public/admin/admin.js
public/admin/index.html
```

需要调整：

- 自动交付文件路径默认生成 `.docx`。
- 文件格式不再从扩展名默认为 `md`。
- 后台可填写或预览用户下载名称。

## 11. 迁移步骤

### Phase 1：规范和字段

目标：

- 明确所有用户下载统一 `.docx`。
- 增加或动态生成 `downloadName`。
- 修改文档和导入规范。

任务：

1. 更新 `script-data-import-standard.md`。
2. 更新 `script-generation-flow-current.md`。
3. 更新 `production-readiness-plan.md` 中关于下载文件的说明。
4. 决定是否新增 `downloadName` 字段。

### Phase 2：生成免费包 docx

目标：

- 先把 4 套已有剧本的免费前三集验证包生成 `.docx`。

任务：

1. 安装 `docx`。
2. 新建 `scripts/generate-docx-deliveries.js`。
3. 从 `scripts-data/*.json` 读取前三集。
4. 生成 `downloads/{slug}/free-preview-{slug}-v1.docx`。
5. 更新 `scripts-data/*.json` 中免费包资源路径。
6. 重新导入数据库。

### Phase 3：下载接口

目标：

- 让用户下载时看到中文文件名。

任务：

1. 新增 `GET /api/download-files/script-assets/:id`。
2. 新增 `GET /api/download-files/delivery-assets/:id`。
3. 设置正确 `Content-Type`。
4. 设置 `Content-Disposition` 中文下载名。
5. 校验用户权限。

### Phase 4：前端切换下载入口

目标：

- 页面不再直接暴露 `/downloads/...`。

任务：

1. 修改剧本详情页下载逻辑。
2. 修改用户中心“重新下载”。
3. 修改用户中心“我的交付”。
4. 修改下载文件格式展示。

### Phase 5：后续交付默认 docx

目标：

- 买断、按集、分成所有后台生成路径默认 `.docx`。

任务：

1. 修改后台交付默认路径。
2. 修改 `server.js` 中 `buildRevenueShareDeliveryDefaults`。
3. 修改订单审批默认交付路径。
4. 修改测试脚本。

### Phase 6：回归测试

目标：

- 确认所有下载流程仍然可用。

测试项：

- 游客下载免费前三集，拿到 `.docx`。
- 登录用户重新下载免费包，拿到中文文件名。
- 买断订单付款后，用户下载完整 `.docx`。
- 按集订单付款后，用户下载对应集数 `.docx`。
- 分成项目创建后，用户下载第一批 `.docx`。
- 非所属用户不能下载他人交付文件。
- 后台默认生成路径不再出现 `.md`。

## 12. 文件命名规则

### 12.1 内部路径命名

使用英文 slug：

```text
free-preview-{slug}-v1.docx
buyout-full-package-v1.docx
episodes-{episodeScope}-package-v1.docx
revenue-share-episodes-{episodeScope}-package-v1.docx
```

### 12.2 用户下载命名

使用中文剧本名：

```text
{title}-前三集免费验证包.docx
{title}-完整买断交付包.docx
{title}-第{episodeScope}集按集购买交付包.docx
{title}-第{episodeScope}集分成合作交付包.docx
```

### 12.3 安全文件名处理

需要移除或替换：

```text
\/:*?"<>|
```

空格可保留，也可以替换为短横线。

建议：

```text
她闻到谎言-前三集免费验证包.docx
```

而不是：

```text
《她闻到谎言》前三集免费验证包.docx
```

原因是不同系统对书名号支持通常没问题，但去掉书名号更稳。

## 13. MVP 阶段取舍

第一阶段不需要追求完美排版。

DOCX 至少要做到：

- 有封面。
- 有清晰标题层级。
- 每集单独分节。
- 剧情正文、分镜、中文提示词、英文提示词分开。
- 授权边界清楚。
- 后续合作说明清楚。

暂时可以不做：

- 复杂页眉页脚。
- 自动目录。
- 精美封面设计。
- 公司水印。
- 复杂表格样式。
- Word 批注。

等用户验证确认这个商业模型成立后，再升级交付文档视觉规范。

## 14. 风险点

### 风险一：DOCX 生成后内容过长

完整买断包可能很长。

解决方式：

- 保持标题层级清楚。
- 分集结构固定。
- 必要时买断包拆成多个 docx，但仍要打包下载。

MVP 阶段建议先一个交付包一个 docx。

### 风险二：中文文件名下载乱码

需要使用 `filename*` 而不是只用 `filename`。

后端下载接口必须测试：

- Chrome。
- Edge。
- Windows 文件名显示。
- 手机浏览器下载。

### 风险三：用户分享下载链接

如果继续使用静态 `/downloads/...`，用户可以直接转发链接。

解决方式：

- 免费包可以短期接受公开下载。
- 付费和分成交付必须走权限接口。
- 后续逐步把下载文件移到非公开目录或对象存储。

### 风险四：内部 Markdown 和 DOCX 不一致

如果人工改 `.md` 后忘记重新生成 `.docx`，用户下载会不是最新版。

解决方式：

- 生成脚本输出版本号。
- 后台显示更新时间。
- 导入前检查 docx 是否存在。
- 后续可增加 `npm run generate:docx`。

## 15. 最终目标

用户侧体验应该变成：

```text
我在网站上看到剧本
-> 点击下载前三集
-> 得到一个命名清楚、排版清晰的 Word 文档
-> 文档里能直接看到剧情、分镜、提示词、授权和测试建议
-> 如果后续购买或分成，我拿到的仍然是同样专业格式的 Word 文档
```

这会显著提升：

- 用户信任感。
- 产品专业度。
- 交付清晰度。
- 后续商务合作可信度。
- 测试用户愿意认真阅读和制作的概率。

## 16. 下一步建议

建议下一步正式进入 Phase 1 + Phase 2：

1. 安装 `docx` 依赖。
2. 新建 `scripts/generate-docx-deliveries.js`。
3. 先为 4 套已有剧本生成免费前三集 `.docx`。
4. 更新 `scripts-data/*.json` 的 `filePath / fileFormat`。
5. 重新导入数据库。

先不要一次性改所有下载接口。

理由：

- 先确认 docx 生成质量。
- 先让用户拿到更友好的文件。
- 再做下载接口和权限控制，风险更低。
