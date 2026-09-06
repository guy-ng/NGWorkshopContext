const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.form'))
  .sort();

let failed = false;

for (const file of files) {
  const result = spawnSync(process.execPath, [path.join(__dirname, 'validate-form.cjs'), path.join(__dirname, file)], {
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
