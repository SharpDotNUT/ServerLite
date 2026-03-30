import { Database } from 'bun:sqlite';
import { hashPassword } from './utils';

const db = new Database(Bun.env.DATABASE!);

interface Project {
  id: number;
  name: string;
  auth: string;
}

// 验证表名安全性
const validateTableName = (tableName: string): boolean => {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName);
};

// 创建表结构
db.run(`
CREATE TABLE IF NOT EXISTS __projects__ (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  auth TEXT NOT NULL
);
`);

// 初始化认证缓存
const AuthCache = new Map<string, string>();
db.query<Project, []>('SELECT * FROM __projects__')
  .all()
  .forEach((project) => {
    AuthCache.set(project.name, project.auth);
  });

const listProjects = () => {
  return AuthCache;
};

const createProject = (name: string, auth: string) => {
  if (!validateTableName(name)) {
    throw new Error('Invalid project name');
  }

  const hashedAuth = hashPassword(auth);
  const stmt = db.prepare(`
    INSERT INTO __projects__ (name, auth) VALUES (?, ?)
  `);

  stmt.run(name, hashedAuth);

  db.run(`
    CREATE TABLE IF NOT EXISTS ${name} (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  AuthCache.set(name, hashedAuth);
};

const deleteProject = (name: string, auth: string) => {
  if (!validateTableName(name) || !AuthCache.has(name)) return false;
  if (AuthCache.get(name) !== hashPassword(auth)) return false;

  db.run(`DROP TABLE IF EXISTS ${name};`);

  const stmt = db.prepare(`DELETE FROM __projects__ WHERE name = ?;`);
  const result = stmt.run(name);

  AuthCache.delete(name); // 同步删除缓存
  return result.changes > 0;
};

const getValue = (project: string, auth: string, key: string) => {
  if (!validateTableName(project) || !AuthCache.has(project)) return null;
  if (AuthCache.get(project) !== hashPassword(auth)) return null;

  // 使用预编译查询缓存
  const query = db.prepare(`SELECT value FROM ${project} WHERE key = ?`);
  const row = query.get(key) as any;
  return row && row.value ? row.value : null;
};

const setValue = (
  project: string,
  auth: string,
  key: string,
  value: string
) => {
  if (!validateTableName(project) || !AuthCache.has(project)) return false;
  if (AuthCache.get(project) !== hashPassword(auth)) return false;

  const stmt = db.prepare(
    `INSERT OR REPLACE INTO ${project} (key, value) VALUES (?, ?)`
  );
  stmt.run(key, value);
  return true;
};

const deleteValue = (project: string, auth: string, key: string) => {
  if (!validateTableName(project) || !AuthCache.has(project)) return false;
  if (AuthCache.get(project) !== hashPassword(auth)) return false;

  const stmt = db.prepare(`DELETE FROM ${project} WHERE key = ?`);
  const result = stmt.run(key);
  return result.changes > 0;
};

export {
  listProjects,
  createProject,
  deleteProject,
  setValue,
  getValue,
  deleteValue
};
