#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dbPath = path.join(os.tmpdir(), `eh-demo-binding-${process.pid}.db`);
process.env.DATABASE_PATH = dbPath;
process.env.NODE_ENV = 'test';

const authPath = path.join(root, 'src/lib/auth.ts');
const probePath = path.join(root, 'src/lib/.demo-binding-auth-probe.ts');
const source = fs.readFileSync(authPath, 'utf8')
  .replace("from './db';", "from './db.ts';")
  .replace("from './demo-accounts';", "from './demo-accounts.ts';");
fs.writeFileSync(probePath, source);

let db;
try {
  ({ db } = await import('../src/lib/db.ts'));
  const { ensureDemoAppRow } = await import(`${pathToFileURL(probePath).href}?v=${Date.now()}`);
  const insert = db.prepare('INSERT INTO users(email,password_hash,role,first_name,last_name,phone,auth_subject) VALUES(?,?,?,?,?,?,?)');
  insert.run('kunde@demo.einfachhausen.de','x','homeowner','Demo','Kunde',null,'old-owner-subject');
  ensureDemoAppRow('kunde@demo.einfachhausen.de','new-owner-subject');
  const owner = db.prepare('SELECT role,auth_subject FROM users WHERE email=?').get('kunde@demo.einfachhausen.de');
  assert.equal(owner.role, 'homeowner');
  assert.equal(owner.auth_subject, 'new-owner-subject', 'correctly-typed demo row must rebind to verified current subject');

  insert.run('handwerker@demo.einfachhausen.de','x','homeowner','Wrong','Role',null,'old-wrong-subject');
  ensureDemoAppRow('handwerker@demo.einfachhausen.de','new-provider-subject');
  const wrongRole = db.prepare('SELECT role,auth_subject FROM users WHERE email=?').get('handwerker@demo.einfachhausen.de');
  assert.equal(wrongRole.role, 'homeowner');
  assert.equal(wrongRole.auth_subject, 'old-wrong-subject', 'demo email with wrong application role must remain fail-closed');

  ensureDemoAppRow('normal@example.com','normal-subject');
  const normalCount = db.prepare('SELECT COUNT(*) AS c FROM users WHERE email=?').get('normal@example.com').c;
  assert.equal(normalCount, 0, 'non-demo identities must never be provisioned by the demo binder');

  console.log('DEMO BINDING REGRESSION: GREEN');
} finally {
  try { db?.close(); } catch {}
  try { fs.rmSync(probePath, { force: true }); } catch {}
  for (const suffix of ['', '-wal', '-shm']) {
    try { fs.rmSync(dbPath + suffix, { force: true }); } catch {}
  }
}
