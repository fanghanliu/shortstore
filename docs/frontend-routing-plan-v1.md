# 前端路由拆分计划 V1

## 1. 文档目标

本文档用于规划前端从当前静态单页，拆分为正式网站的第一版多页面结构。

本阶段目标不是立即接入后端、数据库、登录和支付，而是先用本地 JSON 和本地 Markdown 文件跑通正式用户体验：

1. 首页 `/` 只做平台入口和主推内容。
2. 剧本库 `/scripts` 展示全部剧本。
3. 剧本详情 `/scripts/lie-scent` 展示单套剧本详情。
4. 用户可以在详情页直接下载前三集免费验证包。
5. 下载前展示授权确认，而不是要求用户先留下联系方式。

这一步的重点是把“诈骗感强的留资领取”改成“专业内容平台的直接下载体验”。

## 2. 当前状态

当前项目主要文件：

| 文件 | 作用 |
| --- | --- |
| `index.html` | 当前首页，承载 Hero、剧本卡片、续作方式、授权说明和领取表单 |
| `app.js` | 处理预览弹窗、领取抽屉、商品卡片 JSON 注水 |
| `styles.css` | 全站样式 |
| `actors.html` | AI演员页面，暂时不纳入本轮改造 |
| `*.product-template.json` | 剧本商品数据 |
| `*_storyboard.json` / `*.storyboard.json` | 分镜数据 |
| `docs/free-preview-lie-scent-v1.md` | 《她闻到谎言》前三集免费包 |

当前问题：

- 所有剧本展示挤在首页。
- 首页承担了剧本库、详情页、下载页、转化页的职责。
- CTA 仍然偏“打开抽屉提交申请”，不是直接下载。
- 没有独立剧本库页。
- 没有独立详情页。
- 免费包文件还在 `docs/`，不适合作为浏览器直接下载路径。

## 3. 第一版路由目标

在不引入前端框架的情况下，先用静态 HTML 实现以下页面：

| 页面 | 文件建议 | 模拟路由 | 作用 |
| --- | --- | --- | --- |
| 首页 | `index.html` | `/` | 平台入口，说明模式，引导进入剧本库 |
| 剧本库页 | `scripts.html` | `/scripts` | 展示全部剧本卡片，支持基础筛选或静态分类 |
| 剧本详情页 | `script-lie-scent.html` | `/scripts/lie-scent` | 展示《她闻到谎言》详情并直接下载免费包 |

说明：

- 在纯静态阶段，真实 URL 可以先是 `scripts.html` 和 `script-lie-scent.html`。
- 文案和内部架构按 `/scripts`、`/scripts/lie-scent` 设计，方便以后迁移到 Next.js 或后端路由。

## 4. 第一版不做什么

第一版路由拆分暂不做：

- 不接入数据库。
- 不做登录注册。
- 不做用户中心。
- 不做真实下载记录。
- 不做支付。
- 不做订单。
- 不做分成申请后台。
- 不做完整管理后台。
- 不把所有剧本详情页一次性做全。

第一版只做一个重点：

```text
用户从首页进入剧本库，再进入《她闻到谎言》详情页，直接下载前三集免费包。
```

## 5. 首页 `/` 改造方向

首页应从“单套剧本转化页”变为“平台入口页”。

### 首页保留模块

建议保留：

- 顶部导航。
- Hero。
- 主推剧本展示。
- 免费验证流程。
- 续作方式说明。
- 授权边界说明。
- 进入剧本库 CTA。

### 首页删除或弱化模块

建议删除或弱化：

- 右侧领取抽屉。
- 表单式领取。
- 过长的单套剧本分镜展示。
- 过多具体剧本细节。

### 首页主 CTA

从：

```text
免费领取前三集
```

改为：

```text
进入剧本库
```

辅助 CTA：

```text
查看主推剧本
```

### 首页导航建议

```text
首页 / 剧本库 / 续作方式 / 授权说明 / AI演员
```

静态链接：

```html
<a href="index.html">首页</a>
<a href="scripts.html">剧本库</a>
<a href="index.html#pricing">续作方式</a>
<a href="index.html#license">授权说明</a>
<a href="actors.html">AI演员</a>
```

## 6. 剧本库页 `/scripts`

### 页面目标

剧本库页让用户像挑项目一样挑剧本。

这里不再强调“联系我们领取”，而是强调：

- 剧本可浏览。
- 题材可比较。
- 免费包状态清楚。
- 点击进入详情页。

### 页面模块

建议结构：

1. 顶部导航。
2. 页面标题区。
3. 筛选栏。
4. 剧本卡片网格。
5. 续作方式提示。
6. 页脚或授权提示。

### 页面标题区文案

```text
剧本库
挑一套适合你账号的短剧，先下载前三集验证包。
```

说明：

```text
每套剧本都标注题材、推荐平台、适合账号和免费包状态。你可以先进入详情页查看前三集验证目标，再决定是否下载制作。
```

### 筛选栏第一版

静态第一版可以先做“视觉筛选按钮”，不一定实现复杂过滤。

建议按钮：

```text
全部
都市悬疑
直播复仇
AI恋爱
科幻悬疑
女性向
海外短剧
前三集已开放
```

如果要实现简单过滤，可用 `data-filter` 和少量 JS。

第一版也可以先不实现筛选，只做可点击样式，避免范围过大。

### 剧本卡片字段

每张卡片建议展示：

- 封面图或首帧图。
- 免费包状态。
- 类型标签。
- 剧本名称。
- 一句话爆点。
- 推荐平台。
- 完整集数建议。
- 按钮：查看详情。

### 卡片示例：《她闻到谎言》

```text
前三集已开放
现代悬疑 / 都市商战 / 女性向反转
她闻到谎言
危机公关女王能闻到谎言，却在豪门继承人身上闻到母亲失踪那晚的气味。
推荐：抖音 / 小红书 / TikTok / YouTube Shorts
24集核心版 / 36-48集商业版
查看详情
```

### 卡片链接

```html
<a href="script-lie-scent.html">查看详情</a>
```

后续迁移到框架后变为：

```text
/scripts/lie-scent
```

## 7. 剧本详情页 `/scripts/lie-scent`

### 页面目标

详情页要完成三件事：

1. 让用户确认这套剧本是否适合自己的账号。
2. 让用户清楚知道免费包包含什么、能怎么用、不能怎么用。
3. 让用户可以直接下载前三集验证包。

### 页面模块

建议结构：

1. 顶部导航。
2. 返回剧本库。
3. 剧本头部信息。
4. 剧情简介和核心卖点。
5. 前三集验证目标。
6. 角色视觉锚点。
7. 分镜样片预览。
8. 免费包文件清单。
9. 授权边界确认。
10. 下载按钮。
11. 续作方式。
12. FAQ。

### 详情页头部信息

字段：

- 剧本名称：她闻到谎言。
- 英文名：She Smells Lies。
- 类型标签：现代悬疑 / 都市商战 / 情感拉扯 / 豪门旧案 / 女性向反转。
- 推荐平台：抖音 / 快手 / 小红书 / TikTok / YouTube Shorts / ReelShort。
- 推荐画幅：9:16。
- 单集建议：45-75秒。
- 完整集数：24集核心版 / 36-48集商业版。
- 免费包状态：前三集已开放。

### 详情页主 CTA

```text
下载前三集验证包
```

辅助 CTA：

```text
查看分镜样片
```

## 8. 免费包下载模块

### 文件清单展示

详情页下载区应展示：

```text
你将下载：
- 前三集完整剧情正文
- 每集核心分镜
- 角色视觉锚点
- AI画面提示词
- 标题和封面建议
- 发布测试指南
- 授权边界说明
```

### 下载文件路径

当前免费包在：

```text
docs/free-preview-lie-scent-v1.md
```

为了浏览器直接下载，建议复制到：

```text
downloads/free-preview-lie-scent-v1.md
```

静态 HTML 下载链接：

```html
<a href="downloads/free-preview-lie-scent-v1.md" download>下载前三集验证包</a>
```

### 下载前确认

为了专业和风控，建议不是直接裸下载，而是：

1. 用户点击“下载前三集验证包”。
2. 打开授权确认弹窗。
3. 用户勾选确认。
4. “确认下载”按钮变为可点击。
5. 点击后下载文件。

第一版如果不想做弹窗，也可以在下载模块中直接显示授权边界，并在按钮旁写：

```text
点击下载即表示你已了解免费包仅限前三集测试使用。
```

但更推荐弹窗确认。

## 9. 下载确认弹窗

### 弹窗标题

```text
下载前请确认授权边界
```

### 弹窗正文

```text
本免费包仅授权前三集测试使用，不包含第4集及以后内容，不构成完整剧本版权转让。你不得将本免费包转售、打包上传、拆分售卖或作为素材库二次分发。
```

### 勾选项

```text
我已了解并同意以上免费试用边界
```

### 按钮

```text
确认下载前三集
```

### JS逻辑

- 未勾选时，确认下载按钮 disabled。
- 勾选后，按钮可点击。
- 点击后触发文件下载。
- 下载后关闭弹窗。

## 10. 本地数据过渡方案

第一版先不接数据库，但要把本地 JSON 当作未来 API 的模拟数据。

### 建议新增目录

```text
data/
  scripts-index.json
```

### scripts-index.json 作用

聚合剧本库页需要的轻量字段，避免剧本库页加载完整 product-template。

示例结构：

```json
[
  {
    "slug": "lie-scent",
    "title": "她闻到谎言",
    "titleEn": "She Smells Lies",
    "category": "现代悬疑",
    "tags": ["都市商战", "情感拉扯", "豪门旧案", "女性向反转"],
    "logline": "危机公关女王能闻到谎言，却在豪门继承人身上闻到母亲失踪那晚的气味。",
    "coverImage": "assets/storyboards/frame-01.png",
    "recommendedPlatforms": ["抖音", "小红书", "TikTok", "YouTube Shorts"],
    "freePreviewStatus": "published",
    "detailUrl": "script-lie-scent.html",
    "downloadUrl": "downloads/free-preview-lie-scent-v1.md"
  }
]
```

### 为什么需要 scripts-index.json

- 剧本库页不需要加载所有完整 JSON。
- 未来迁移到数据库时，这个结构可以对应 `/api/scripts`。
- 便于卡片排序、筛选和搜索。

### 详情页数据来源

详情页第一版可以：

- 静态写入《她闻到谎言》内容。
- 或用 JS 加载 `她闻到谎言.product-template.json`。

建议第一版采用静态详情页，原因：

- 更可控。
- SEO 更好。
- 不需要处理中文文件名 fetch 的兼容问题。
- 后续迁移 Next.js 时也更容易变成静态生成页面。

## 11. 文件迁移建议

为了让用户直接下载，需要新增：

```text
downloads/
  free-preview-lie-scent-v1.md
```

来源：

```text
docs/free-preview-lie-scent-v1.md
```

注意：

- `docs/` 是内部规划和生产文档目录。
- `downloads/` 是面向用户下载的公开文件目录。

后续可再新增：

```text
downloads/free-preview-lie-scent-v1.pdf
downloads/free-preview-lie-scent-v1.zip
```

## 12. app.js 拆分建议

当前 `app.js` 主要为首页服务。多页面后建议拆分：

```text
app.js
scripts.js
script-detail.js
```

### app.js

用于首页：

- 首页简单交互。
- 主推卡片动效。
- 不再负责领取抽屉。

### scripts.js

用于剧本库页：

- 加载 `data/scripts-index.json`。
- 渲染剧本卡片。
- 简单筛选。
- 搜索。

### script-detail.js

用于详情页：

- 下载确认弹窗。
- 勾选授权边界。
- 触发下载。
- 可选：记录本地下载事件到 `localStorage`。

## 13. 旧领取抽屉处理

当前 `index.html` 里有 `leadDrawer`。正式体验中应逐步废弃。

### 第一版建议

在首页重构时：

- 不再将主 CTA 指向抽屉。
- 主 CTA 改为进入剧本库。
- 暂时可以保留抽屉代码，但不主动触发。

在详情页：

- 不使用抽屉。
- 使用下载确认弹窗。

### 后续删除

当剧本库页和详情页稳定后：

- 删除 `leadDrawer`。
- 删除相关 CSS。
- 删除 `data-open-lead` 交互。
- 删除 `submitLead` 逻辑。

## 14. 静态文件结构建议

第一版静态多页结构：

```text
/
  index.html
  scripts.html
  script-lie-scent.html
  styles.css
  app.js
  scripts.js
  script-detail.js
  data/
    scripts-index.json
  downloads/
    free-preview-lie-scent-v1.md
  assets/
    ...
  docs/
    ...
```

这个结构以后可以迁移为：

```text
app/
  page.tsx
  scripts/
    page.tsx
    [slug]/
      page.tsx
```

## 15. 首页第一版内容规划

首页保留平台解释，不再承载完整剧本详情。

### 页面模块

1. Header。
2. Hero。
3. 主推剧本。
4. 免费验证流程。
5. 续作方式。
6. 授权边界。
7. CTA：进入剧本库。

### Hero 文案

标题：

```text
先挑剧本，再用前三集验证爆款潜力。
```

副标题：

```text
短剧本铺提供可直接制作的 AI 短剧剧本验证包。你可以进入剧本库，选择适合账号的题材，在详情页下载前三集剧情、分镜和提示词，用真实播放数据决定是否继续。
```

主按钮：

```text
进入剧本库
```

次按钮：

```text
查看主推剧本
```

## 16. 剧本库页第一版内容规划

### Header

同首页。

### 页面标题

```text
剧本库
```

副标题：

```text
选择题材、查看详情、下载前三集验证包。先用真实数据判断，再决定是否买断、按集或分成合作。
```

### 筛选栏

视觉按钮：

```text
全部 / 都市悬疑 / 直播复仇 / AI恋爱 / 科幻悬疑 / 女性向 / 海外短剧 / 前三集已开放
```

### 卡片网格

第一版展示 4 套：

- 她闻到谎言。
- 最后一座云端城。
- 第99次直播复仇。
- 恋爱算法失控中。

只有《她闻到谎言》详情页完整可用，其他卡片可以显示：

```text
详情页制作中
```

或仍可进入未来占位详情页。

## 17. 《她闻到谎言》详情页第一版内容规划

### Header

同首页。

### 返回链接

```text
← 返回剧本库
```

### 首屏

标题：

```text
她闻到谎言
```

副标题：

```text
危机公关女王能闻到谎言，却在豪门继承人身上闻到母亲失踪那晚的气味。
```

标签：

```text
现代悬疑 / 都市商战 / 情感拉扯 / 豪门旧案 / 女性向反转
```

CTA：

```text
下载前三集验证包
```

### 免费包模块

标题：

```text
前三集免费验证包已开放
```

内容：

```text
包含前三集剧情正文、6条以上核心分镜、角色视觉锚点、AI画面提示词、标题封面建议、发布测试指南和授权边界说明。
```

### 授权边界

必须出现在下载按钮附近。

```text
本免费包仅授权前三集测试使用，不包含第4集及以后内容，不构成完整版权转让。
```

## 18. 下载流程第一版实现

### HTML

```html
<button type="button" id="openDownload">下载前三集验证包</button>

<dialog id="downloadDialog">
  <h2>下载前请确认授权边界</h2>
  <p>本免费包仅授权前三集测试使用，不包含第4集及以后内容，不构成完整剧本版权转让。</p>
  <label>
    <input type="checkbox" id="licenseConfirm" />
    我已了解并同意以上免费试用边界
  </label>
  <a id="confirmDownload" href="downloads/free-preview-lie-scent-v1.md" download aria-disabled="true">确认下载前三集</a>
</dialog>
```

### JS

```js
const dialog = document.querySelector("#downloadDialog");
const openDownload = document.querySelector("#openDownload");
const licenseConfirm = document.querySelector("#licenseConfirm");
const confirmDownload = document.querySelector("#confirmDownload");

openDownload.addEventListener("click", () => dialog.showModal());
licenseConfirm.addEventListener("change", () => {
  confirmDownload.toggleAttribute("aria-disabled", !licenseConfirm.checked);
});
```

第一版可使用自定义 modal 代替 `<dialog>`，以兼容现有样式。

## 19. 迁移到后端时的对应关系

静态第一版和未来后端对应如下：

| 静态第一版 | 后端版本 |
| --- | --- |
| `scripts.html` | `GET /scripts` |
| `script-lie-scent.html` | `GET /scripts/lie-scent` |
| `data/scripts-index.json` | `GET /api/scripts` |
| `downloads/free-preview-lie-scent-v1.md` | `GET /api/downloads/:id/file` |
| 本地下载弹窗 | 下载记录 + 签名文件 URL |
| 静态卡片 | 数据库 scripts 表 |
| 静态免费包路径 | preview_packages 表 |

## 20. 第一版实施顺序

建议按以下顺序改代码：

### Step 1：准备公开下载文件

- 新建 `downloads/`。
- 复制 `docs/free-preview-lie-scent-v1.md` 到 `downloads/free-preview-lie-scent-v1.md`。

验收：

- 浏览器能打开或下载该文件。

### Step 2：新增剧本库页

- 新建 `scripts.html`。
- 复用 header 和整体风格。
- 展示 4 套剧本卡片。
- 《她闻到谎言》卡片链接到 `script-lie-scent.html`。

验收：

- 用户能从首页进入剧本库。
- 用户能点击《她闻到谎言》进入详情页。

### Step 3：新增详情页

- 新建 `script-lie-scent.html`。
- 展示剧本详情。
- 展示免费包清单。
- 展示授权边界。
- 提供下载按钮。

验收：

- 用户能看到详情页。
- 用户理解免费包包含什么。

### Step 4：新增下载确认交互

- 新建或扩展 `script-detail.js`。
- 点击下载按钮打开授权确认。
- 勾选后才能下载。

验收：

- 未确认不能下载。
- 确认后可以下载 Markdown。

### Step 5：首页收缩为入口

- 首页 CTA 改为 `scripts.html`。
- 首页减少“领取表单”的主路径。
- 保留主推剧本和续作说明。

验收：

- 首页不再像留资营销页。
- 主路径变成进入剧本库。

## 21. 验收标准

第一版完成后，应满足：

- 用户从首页可以进入剧本库。
- 用户在剧本库可以看到多套剧本。
- 用户点击《她闻到谎言》可以进入详情页。
- 用户在详情页可以看到前三集免费包说明。
- 用户在详情页可以直接下载 Markdown。
- 下载前能看到授权边界。
- 不需要填写联系方式才能获得免费包。
- 旧的抽屉领取不再是主路径。
- 页面仍然保持当前视觉风格。
- 不引入后端也能跑通完整体验。

## 22. 暂不处理事项

本次前端路由拆分暂不处理：

- 登录注册。
- 数据库。
- 下载记录。
- 支付。
- 订单。
- 分成申请表。
- PDF/ZIP 自动生成。
- 管理后台。
- 全部剧本详情页。

这些放到后端和数据库阶段再做。

## 23. 下一步

如果确认本计划，就可以进入代码阶段，按 `Step 1 -> Step 5` 实施。

建议第一轮代码只做：

1. `downloads/free-preview-lie-scent-v1.md`
2. `scripts.html`
3. `script-lie-scent.html`
4. `script-detail.js`
5. 首页 CTA 指向 `scripts.html`

这样可以最快把网站从“留联系方式领取”转成“剧本库详情页直接下载”的正式体验。
