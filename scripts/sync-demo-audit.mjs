import { readFile, writeFile } from 'node:fs/promises';
import { normalizeDemoAudit } from './lib/demo-audit.mjs';
const audit = JSON.parse(await readFile('validation/m4/source-audit.json', 'utf8'));
await writeFile(
  'content-data/demo-audit.json',
  JSON.stringify(normalizeDemoAudit(audit), null, 2) + '\n',
);
console.log(
  `Updated settings for ${audit.events.length} demo events from the recorded Unity audit.`,
);
