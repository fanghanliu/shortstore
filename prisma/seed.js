const path = require("node:path");
const { importFiles } = require("../scripts/import-script-data");

async function main() {
  await importFiles([path.join("scripts-data")]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
