import fs from 'node:fs/promises';
import path from 'node:path';
const filename = import.meta.filename as string;
const dirname = path.dirname(filename);

import ky from 'ky';
import {} from 'vitest';

fs.rm(path.join(dirname, '../database.db'), { force: true });

const f = ky.extend({
  prefixUrl: 'http://localhost:52112'
});

await f
  .post('api/project/test')
  .then((res) => res.json())
  .then(console.log);
await f
  .post('test/k1?value=v1')
  .then((res) => res.json())
  .then(console.log);
