import fs from 'node:fs/promises';
import path from 'node:path';
const filename = import.meta.filename as string;
const dirname = path.dirname(filename);

import ky from 'ky';
import { execa } from 'execa';
import { expect, test } from 'bun:test';

fs.rm(path.join(dirname, '../database.db'), { force: true });

const server = execa('bun', [path.join(dirname, './index.ts')]);
await new Promise((resolve) => {
  server.stdout.on('data', (data) => {
    if (data.toString().includes('SharpDotNUT ServerLite is running')) {
      resolve(true);
    }
  });
});

const f = ky.extend({
  prefixUrl: 'http://localhost:52112',
  throwHttpErrors: false
});

test('create project', async () => {
  await f.post('api/project/test');
  await f.post('api/project/ciallo');
  await f.post('api/project/Ciallo～(∠·ω< )⌒★');
  await f
    .get('api/list')
    .then((res) => res.json())
    .then((res) => {
      expect(res).toEqual(['test', 'ciallo']);
    });
});
test('set value', async () => {
  await f.post('test/k1?value="v1"');
  await f.post('test/k2?value="v2"');
  await f
    .get('test/k1')
    .then((res) => res.json())
    .then((res) => {
      expect(res).toEqual('v1');
    });
  await f
    .get('test/k2')
    .then((res) => res.json())
    .then((res) => {
      expect(res).toEqual('v2');
    });
});
test('change value', async () => {
  await f.post('test/k2?value="elysia"');
  await f
    .get('test/k2')
    .then((res) => res.json())
    .then((res) => {
      expect(res).toEqual('elysia');
    });
});
test('delete value', async () => {
  await f.delete('test/k1');
  await f
    .get('test/k1')
    .then((res) => res.json())
    .then((res) => {
      expect(res).toEqual(null);
    });
});
test('remove project', async () => {
  await f.delete('api/project/ciallo');
  await f
    .get('api/list')
    .then((res) => res.json())
    .then((res) => {
      expect(res).toEqual(['test']);
    });
});

server.kill(0);
