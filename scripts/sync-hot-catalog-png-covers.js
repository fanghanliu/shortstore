const { spawnSync } = require("node:child_process");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

run("node", ["scripts/check-hot-catalog-png-covers.js"]);
run("node", ["scripts/generate-hot-script-catalog.js"]);
