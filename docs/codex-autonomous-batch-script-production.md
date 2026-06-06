# Codex 全自动批量剧本生产方案

## 目标

把复杂业务逻辑收回到项目内部，由 Codex 脚本负责判断、生成、质检、修复和入库。n8n 只负责定时触发与调用命令。

最终链路：

```text
n8n Schedule Trigger
-> Code 调用 Codex 内部生成脚本
-> Codex 自动生成 generated-*.json
-> Codex 自动调用生产脚本
-> DOCX 生成
-> 数据库导入
-> 前端剧本库展示
```

## 职责边界

### Codex 项目内部

Codex 内部脚本负责：

- 检索或整理热门题材候选。
- 自动选择适合 AI 漫剧 / AI 短剧的题材。
- 生成母版大纲。
- 按集生成正文。
- 生成高级分镜。
- 生成中英文提示词。
- 合并剧本包。
- 转换为 `run-daily-script-production.js` 需要的生产输入格式。
- 写入 `automation-briefs/generated-*.json`。
- 运行 AI 自动验收门。
- 可选：自动调用生产脚本生成 DOCX 并入库。

### n8n

n8n 只负责：

- 定时触发。
- 调用一个项目脚本命令。
- 记录命令输出。
- 失败时通知。

不再在 n8n 里堆叠母版、分集、分镜、提示词、JSON 修复等复杂节点。

## 第一版命令

生成 1 部 3 集 AI 漫剧输入文件：

```bash
node scripts/run-ai-script-generation-pipeline.js --count 1 --episode-count 3 --mode ai_manhua_drama
```

生成 10 部待生产输入文件：

```bash
node scripts/run-ai-script-generation-pipeline.js --count 10 --episode-count 3 --mode mixed
```

生成并自动执行生产脚本的 dry-run：

```bash
node scripts/run-ai-script-generation-pipeline.js --count 3 --episode-count 3 --mode mixed --auto-produce --production-dry-run
```

正式自动生成、DOCX、入库：

```bash
node scripts/run-ai-script-generation-pipeline.js --count 3 --episode-count 3 --mode mixed --auto-produce
```

脚本默认使用 OpenAI Responses API。运行前需要设置：

```bash
set OPENAI_API_KEY=你的OpenAIKey
```

可选模型参数：

```bash
node scripts/run-ai-script-generation-pipeline.js --count 1 --episode-count 3 --model gpt-5.1
```

## 批量策略

初始填充 50-100 部剧本库时，不建议一次性跑完一个超大批次。建议：

```text
每批 5-10 部
每部先生成 3 集免费验证内容
自动质检通过后自动入库
失败项写入 manifest，不阻塞其他剧本
```

推荐节奏：

```text
第 1 天：10 部，观察前端展示和 DOCX 质量
第 2-3 天：每天 20 部
稳定后：一次性 50 部批量补库
```

## AI 自动验收门

第一版验收项目：

- `master.slug` 与顶层 `slug` 一致。
- `master.title.zh`、`logline`、`synopsis` 存在。
- `recommendedPlatforms`、`audienceTags` 是数组。
- 集数达到目标数量。
- 每集有 `title`、`hook`、`summary`、`endingHook`。
- 每集有中文和英文提示词。
- 每集有分镜 / panels。

后续可升级为评分制：

```text
题材热度 20
短剧钩子 20
人物动机 15
分镜质感 15
提示词可生产性 15
商业售卖价值 15
```

分数低于阈值时，Codex 自动重写或放入失败清单。

## n8n 最简画布

```text
Schedule Trigger
-> Code: 调用 scripts/run-ai-script-generation-pipeline.js
```

n8n Code 节点命令示例：

```javascript
const { execFileSync } = require('child_process');

const cwd = 'D:\\售卖AI短剧剧本';
const command = 'node scripts/run-ai-script-generation-pipeline.js --count 5 --episode-count 3 --mode mixed --auto-produce';

const stdout = execFileSync('cmd.exe', ['/d', '/c', command], {
  cwd,
  encoding: 'utf8',
  windowsHide: true,
  maxBuffer: 1024 * 1024 * 50,
});

return [{ json: { ok: true, command, stdout } }];
```

## 当前第一版限制

- 默认 provider 是 `openai`，使用 Responses API 分阶段生成。
- 热门题材阶段默认启用 `web_search_preview`。
- `--provider template` 仅保留为本地无 API key 时的格式回归测试入口。
- 批量生产时仍建议先用 `--production-dry-run` 验证命令输出。
