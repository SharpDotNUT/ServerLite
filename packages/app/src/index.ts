import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';

import {
  createProject,
  deleteProject,
  deleteValue,
  getValue,
  listProjects,
  setValue
} from './sql';

import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
const filename = import.meta.filename as string;
const dirname = path.dirname(filename);

const argv = parseArgs({
  args: Bun.argv,
  options: {
    port: {
      type: 'string'
    }
  },
  allowPositionals: true
});
const port = argv.values.port ?? Bun.env?.['port'] ?? 52112;

export const app = new Elysia()
  .use(openapi())
  .get('/', () => 'Hello Elysia')
  .listen(port);

app.get('/api/list', () => {
  return [...listProjects().keys()];
});

app.post('/api/project/:project', ({ params, query: { auth } }) => {
  return createProject(params.project, auth);
});

app.delete('/api/project/:project', ({ params, query: { auth } }) => {
  return deleteProject(params.project, auth);
});

app.get('/:project/:key', ({ params, query: { auth } }) => {
  return JSON.stringify(getValue(params.project, auth, params.key));
});

app.post('/:project/:key', ({ params, query: { auth, value } }) => {
  return setValue(params.project, auth, params.key, JSON.parse(value));
});

app.delete('/:project/:key', ({ params, query: { auth } }) => {
  return deleteValue(params.project, auth, params.key);
});

console.log(
  `SharpDotNUT ServerLite is running on ${app.server?.hostname}:${app.server?.port}`
);
