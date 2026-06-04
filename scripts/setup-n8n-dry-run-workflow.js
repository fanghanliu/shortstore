const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const sqlite3 = require("C:/Users/1/Documents/Codex/2026-06-03/new-chat/work/n8n-local/node_modules/sqlite3");

const projectRoot = path.join(__dirname, "..");
const n8nDbPath =
  "C:/Users/1/Documents/Codex/2026-06-03/new-chat/work/n8n-local/.n8n/.n8n/database.sqlite";
const workflowId = "hgsGHQc3l7v97SHN";
const backupPath = path.join(projectRoot, "automation-briefs", `n8n-workflow-${workflowId}-backup.json`);

const command =
  'powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Set-Location \'D:\\售卖AI短剧剧本\'; npm.cmd run run:daily-script-production -- --input automation-briefs/example-daily-script-production.json --dry-run"';

const nodes = [
  {
    parameters: {},
    type: "n8n-nodes-base.manualTrigger",
    typeVersion: 1,
    position: [0, 0],
    id: "8d669a6e-7b36-47ad-b03a-2ae2ca1c721c",
    name: "Manual Trigger"
  },
  {
    parameters: {
      executeOnce: true,
      command
    },
    type: "n8n-nodes-base.executeCommand",
    typeVersion: 1,
    position: [360, 0],
    id: "4df6aa20-96f7-49ff-98fd-7089f4a5fa98",
    name: "Run Codex dry-run"
  }
];

const connections = {
  "Manual Trigger": {
    main: [
      [
        {
          node: "Run Codex dry-run",
          type: "main",
          index: 0
        }
      ]
    ]
  }
};

const settings = {
  executionOrder: "v1",
  binaryMode: "separate"
};

function run() {
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  const db = new sqlite3.Database(n8nDbPath);

  db.serialize(() => {
    db.get("SELECT * FROM workflow_entity WHERE id = ?", [workflowId], (selectError, row) => {
      if (selectError) {
        db.close();
        throw selectError;
      }

      if (!row) {
        db.close();
        throw new Error(`Workflow not found: ${workflowId}`);
      }

      fs.writeFileSync(backupPath, `${JSON.stringify(row, null, 2)}\n`, "utf8");
      const nextVersionCounter = Number(row.versionCounter || 1) + 1;

      db.run(
        `UPDATE workflow_entity
         SET name = ?,
             nodes = ?,
             connections = ?,
             settings = ?,
             versionId = ?,
             versionCounter = ?,
             updatedAt = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')
         WHERE id = ?`,
        [
          "Codex dry-run test",
          JSON.stringify(nodes),
          JSON.stringify(connections),
          JSON.stringify(settings),
          crypto.randomUUID(),
          nextVersionCounter,
          workflowId
        ],
        (updateError) => {
          if (updateError) {
            db.close();
            throw updateError;
          }

          db.run("DELETE FROM workflow_dependency WHERE workflowId = ?", [workflowId], (deleteError) => {
            if (deleteError) {
              db.close();
              throw deleteError;
            }

            const dependencyRows = nodes.map((node) => [
              workflowId,
              nextVersionCounter,
              "nodeType",
              node.type,
              1,
              JSON.stringify({
                nodeId: node.id,
                nodeVersion: node.typeVersion
              })
            ]);

            const statement = db.prepare(
              `INSERT INTO workflow_dependency
               (workflowId, workflowVersionId, dependencyType, dependencyKey, indexVersionId, dependencyInfo)
               VALUES (?, ?, ?, ?, ?, ?)`
            );

            dependencyRows.forEach((dependencyRow) => statement.run(dependencyRow));
            statement.finalize((finalizeError) => {
              db.close();
              if (finalizeError) {
                throw finalizeError;
              }

              console.log(
                JSON.stringify(
                  {
                    ok: true,
                    workflowId,
                    backup: path.relative(projectRoot, backupPath).replace(/\\/g, "/"),
                    command,
                    nodes: nodes.map((node) => node.name),
                    dependencies: nodes.map((node) => node.type),
                    workflowVersionId: nextVersionCounter
                  },
                  null,
                  2
                )
              );
            });
          });
        }
      );
    });
  });
}

run();
