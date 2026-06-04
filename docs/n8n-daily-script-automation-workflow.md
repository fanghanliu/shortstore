# n8n 每日爆款选题与剧本生产自动化工作流

## 1. 目标

本文档用于定义一条可落地的 n8n 自动化链路：

```text
每日热榜/竞品数据
-> 爆款选题候选
-> 选题评分与人工审核
-> 生成剧本母版和全集单集 JSON
-> 写入 content-source
-> 增厚生产稿
-> 构建 scripts-data
-> 生成 DOCX 交付包
-> 导入数据库
```

原则：n8n 负责调度、采集、LLM 生成、审核流转；本项目脚本负责确定性的文件生成、DOCX 生成和数据库导入。

不要把数据库写入、DOCX 排版、字段清洗逻辑散落在 n8n 节点里。

## 2. 当前项目生产链路

当前已经跑通的本地链路是：

```text
content-source/{slug}/master.json
content-source/{slug}/episodes/episode-001.json
...
-> scripts/enrich-production-script-content.js {slug}
-> scripts/build-script-data-from-source.js --slug {slug} --status published
-> scripts/generate-docx-deliveries.js --type free_preview --slug {slug} --update-assets
-> scripts/generate-docx-deliveries.js --type buyout --slug {slug}
-> scripts/generate-docx-deliveries.js --type pay_per_episode --slug {slug} --episodes 4,5,6
-> scripts/generate-docx-deliveries.js --type revenue_share --slug {slug} --episode-start 4 --episode-end 10
-> scripts/import-script-data.js scripts-data/{slug}.json
```

已经新增统一入口：

```bash
npm run run:daily-script-production -- --input automation-briefs/2026-06-03-example.json
```

入口脚本：

```text
scripts/run-daily-script-production.js
```

它接收 n8n 生成的标准 JSON 包，自动写入 `content-source`，再执行增厚、构建、DOCX、入库。

## 3. n8n 工作流总览

建议拆成两个工作流。

### 3.1 主工作流：每日选题与生成

```text
Schedule Trigger
-> HTTP Request: 拉取热榜/竞品数据
-> Code: 清洗趋势数据
-> LLM: 生成候选选题
-> Code: 评分排序
-> IF: 是否达到生产阈值
-> 人工审核节点
-> LLM: 生成剧本生产 JSON
-> Execute Command / SSH: 调用本项目入口脚本
-> 通知结果
```

### 3.2 子工作流：失败通知与人工复核

```text
Error Trigger
-> 汇总失败节点、slug、错误日志
-> 发送到微信/飞书/邮件/Notion
-> 标记该选题为 pending_review
```

## 4. n8n 节点设计

### 4.1 Schedule Trigger

用途：每天固定时间启动。

建议：

- 每天早上 8:30 采集热榜。
- 每天只生产 1-3 个剧本，避免质量失控。
- 如果要区分 AI 漫剧和 AI 短剧，可以每天各生产 1 个。

n8n 官方节点参考：

- Schedule Trigger: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger/

### 4.2 HTTP Request: 热榜与竞品数据

用途：抓取选题来源。

推荐来源：

- 抖音热榜、快手热榜、小红书热词、微博热搜。
- YouTube Shorts / TikTok 相关趋势。
- 自己维护的爆款短剧案例库。
- 竞品账号标题、播放量、评论关键词。

输出建议：

```json
{
  "source": "douyin_hot",
  "keyword": "末世囤货",
  "rank": 3,
  "heat": 982341,
  "sampleTitles": ["..."],
  "observedAt": "2026-06-03T08:30:00+08:00"
}
```

n8n 官方节点参考：

- HTTP Request: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/

### 4.3 Code: 趋势清洗

用途：去重、合并关键词、过滤风险词。

输出字段：

```json
{
  "keyword": "末世囤货",
  "platforms": ["douyin", "kuaishou"],
  "heatScore": 88,
  "evidence": [
    "近 24 小时多平台重复出现",
    "评论区高频词包含囤货、重生、复仇"
  ]
}
```

### 4.4 LLM: 候选选题生成

用途：把趋势数据变成可生产的短剧选题。

输入：

- 热榜关键词。
- 竞品标题。
- 目标平台。
- 禁止方向。
- AI 短剧 / AI 漫剧的模式要求。

输出：

```json
{
  "candidates": [
    {
      "workingTitle": "冰封末世便利店",
      "primaryMode": "ai_manhua_drama",
      "category": "AI末世囤货移动堡垒漫剧",
      "logline": "寒潮灭世前三天，重生女主买下倒闭便利店，把它升级成移动堡垒。",
      "whyNow": "末世囤货和重生复仇同时具备高热度。",
      "audienceTags": ["末世生存", "囤货爽文", "移动堡垒"],
      "riskLevel": "medium"
    }
  ]
}
```

### 4.5 Code: 评分排序

建议评分：

| 维度 | 权重 |
| --- | --- |
| 热度 | 25 |
| 短剧钩子 | 20 |
| 二创潜力 | 15 |
| AI 画面稳定性 | 15 |
| 商业售卖价值 | 15 |
| 风险可控 | 10 |

通过阈值建议：

```text
score >= 80: 可以进入人工审核
70 <= score < 80: 仅保留为备选
score < 70: 丢弃
```

### 4.6 人工审核

这一关建议保留。

审核内容：

- 是否撞题严重。
- 是否有违规风险。
- 是否适合 AI 生成。
- 是否适合售卖给用户生产。
- 是否选择 AI 漫剧还是 AI 短剧。
- 是否需要人工修改 logline、题材、主角关系。

审核通过后，再进入剧本 JSON 生成。

### 4.7 LLM: 生成生产 JSON

这一节点的输出必须符合本项目入口脚本契约。

最小结构：

```json
{
  "slug": "frozen-store-fortress",
  "status": "published",
  "master": {
    "slug": "frozen-store-fortress",
    "title": {
      "zh": "冰封末世：我把便利店开成移动堡垒",
      "en": "Frozen Store Fortress"
    },
    "primaryMode": "ai_manhua_drama",
    "supportedModes": ["ai_manhua_drama"],
    "logline": "寒潮灭世前三天，重生女主买下倒闭便利店，把它升级成移动堡垒。",
    "synopsis": "完整故事概览...",
    "category": "AI末世囤货移动堡垒漫剧",
    "recommendedPlatforms": ["抖音", "快手", "小红书", "TikTok"],
    "audienceTags": ["末世生存", "重生逆袭", "囤货爽文"],
    "productionDifficulty": "medium",
    "episodeCount": 24,
    "freeEpisodeCount": 3,
    "commercialPolicy": {
      "buyout": "一次性买断后续完整剧集和对应授权。",
      "payPerEpisode": "按集购买后续内容，适合边做边验证。",
      "revenueShare": "不预付剧集费用，按视频收益分成。"
    }
  },
  "episodes": [
    {
      "episodeNumber": 1,
      "title": "冷库重生",
      "hook": "女主在寒潮降临前 72 小时重生。",
      "summary": "本集概要...",
      "endingHook": "便利店地板下出现移动堡垒蓝图。"
    }
  ]
}
```

要求：

- `slug` 必须是小写英文、数字和连字符。
- `episodes` 至少 3 集，正式生产建议 24 集。
- 每集必须有 `title / hook / summary / endingHook`。
- `primaryMode` 使用：
  - `ai_manhua_drama`
  - `ai_short_drama`

### 4.8 Execute Command / SSH: 调用项目入口

如果 n8n 和项目在同一台机器，可以用 Execute Command。

如果 n8n 在服务器，项目在另一台机器，建议用 SSH。

命令：

```bash
npm run run:daily-script-production -- --input automation-briefs/2026-06-03-frozen-store.json
```

常用参数：

```bash
# 只验证，不实际执行
npm run run:daily-script-production -- --input automation-briefs/example.json --dry-run

# 只写入 content-source、增厚、构建 scripts-data，不生成 DOCX，不入库
npm run run:daily-script-production -- --input automation-briefs/example.json --skip-docx --skip-import

# 指定按集交付包范围
npm run run:daily-script-production -- --input automation-briefs/example.json --pay-episodes 4,5,6

# 指定分成包范围
npm run run:daily-script-production -- --input automation-briefs/example.json --revenue-start 4 --revenue-end 10
```

n8n 官方节点参考：

- SSH: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.ssh/
- Execute Workflow: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executeworkflow/

## 5. 本地入口脚本职责

`scripts/run-daily-script-production.js` 会执行：

1. 读取 n8n 输入 JSON。
2. 校验 `slug / master / episodes`。
3. 写入：

```text
content-source/{slug}/master.json
content-source/{slug}/episodes/episode-001.json
content-source/{slug}/automation-brief.json
```

4. 调用：

```bash
node scripts/enrich-production-script-content.js {slug}
```

5. 构建：

```bash
node scripts/build-script-data-from-source.js --slug {slug} --status published
```

6. 生成 DOCX：

```bash
node scripts/generate-docx-deliveries.js --type free_preview --slug {slug} --update-assets
node scripts/generate-docx-deliveries.js --type buyout --slug {slug}
node scripts/generate-docx-deliveries.js --type pay_per_episode --slug {slug} --episodes 4,5,6
node scripts/generate-docx-deliveries.js --type revenue_share --slug {slug} --episode-start 4 --episode-end 10
```

7. 导入数据库：

```bash
node scripts/import-script-data.js scripts-data/{slug}.json
```

8. 返回 JSON 给 n8n。

成功返回示例：

```json
{
  "ok": true,
  "slug": "frozen-store-fortress",
  "status": "published",
  "outputs": {
    "scriptData": "scripts-data/frozen-store-fortress.json",
    "freePreview": "downloads/frozen-store-fortress/free-preview-frozen-store-fortress-v1.docx",
    "buyout": "downloads/frozen-store-fortress/deliveries/buyout-full-package-v1.docx"
  }
}
```

失败返回示例：

```json
{
  "ok": false,
  "error": "episodes[0].hook is required",
  "command": null
}
```

## 6. 人工审核点

建议保留三个审核点。

### 6.1 选题审核

在生成完整剧本前审核：

- 题材是否值得做。
- 是否当下有热度。
- 是否有违规风险。
- 是否适合 AI 漫剧或 AI 短剧。

### 6.2 剧本 JSON 审核

在调用入口脚本前审核：

- 24 集结构是否完整。
- 前三集是否足够强。
- 第 4 集后是否有持续付费价值。
- 结尾钩子是否连续。
- 主线是否没有断裂。

### 6.3 上架审核

入口脚本跑完后审核：

- 剧本库是否出现。
- 详情页是否能打开。
- 免费包是否能下载。
- 买断、按集、分成是否都能生成交付包。
- DOCX 是否在 WPS 中显示正常。

如果要全自动发布，可以把 6.3 变成抽检；但早期建议人工确认。

## 7. 失败处理

### 7.1 数据采集失败

处理：

- 保留昨日候选。
- 标记本日为 `trend_fetch_failed`。
- 不进入生产。

### 7.2 LLM 输出 JSON 不合法

处理：

- n8n Code 节点先 JSON.parse。
- 校验必填字段。
- 不合法则回到 LLM 修复节点。
- 修复最多 2 次，仍失败则人工审核。

### 7.3 本地脚本失败

处理：

- 保存入口脚本返回的 `ok:false` JSON。
- 记录 `command / stdout / stderr`。
- 不重复导入数据库。
- 通知人工处理。

### 7.4 DOCX 生成失败

处理：

- 保留 `scripts-data/{slug}.json`。
- 不导入或导入为 draft。
- 修复生成脚本后重跑：

```bash
npm run run:daily-script-production -- --slug {slug} --skip-write-source
```

## 8. 状态建议

早期建议：

```text
n8n 选题通过 -> 生成 JSON -> 入口脚本 status=published -> 入库可见
```

如果希望更安全：

```text
n8n 选题通过 -> 生成 JSON -> 入口脚本 --skip-import -> 人工确认 DOCX -> 再导入数据库
```

后续可以增加 `review_status` 字段，但当前数据库已有 `script.status`，先用 `draft / published / archived` 即可。

## 9. 推荐落地阶段

### 阶段一：半自动

- n8n 只做趋势采集和候选选题。
- 人工选一个题。
- n8n 生成 JSON。
- 人工运行入口脚本。

### 阶段二：自动生产，人工上架

- n8n 自动生成 JSON。
- 自动运行入口脚本，但加 `--skip-import`。
- 人工检查 DOCX 和详情页数据。
- 通过后再导入数据库。

### 阶段三：全自动上架

- n8n 自动采集、生成、运行、导入。
- 每日发送生产报告。
- 每周人工复盘爆款命中率。

## 10. 下一步任务

1. 在 n8n 中创建每日选题工作流。
2. 创建 LLM 输出 JSON 的 Prompt 模板。
3. 先用 `--dry-run` 测试入口脚本。
4. 用一个人工准备的 JSON 包跑通完整链路。
5. 再接入真实热榜数据源。
