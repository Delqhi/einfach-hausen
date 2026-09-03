import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
// gleiche DB wie der dev-server (default DATABASE_PATH)
const db = new Database('data/einfach-hausen.db');
const email = 'design.pro@test.local';
const hash = bcrypt.hashSync('Test1234!', 12);
let user = db.prepare('SELECT id FROM users WHERE email=?').get(email);
if (!user) {
  const r = db.prepare('INSERT INTO users(email,password_hash,role,first_name,last_name) VALUES(?,?,?,?,?)')
    .run(email, hash, 'provider', 'Max', 'Mustermann');
  user = { id: Number(r.lastInsertRowid) };
  db.prepare('INSERT INTO homeowner_profiles(user_id,postcode,address,onboarding_step) VALUES(?,?,?,?)')
    .run(user.id, '10115', 'Torstraße 1', 'done');
}
// Session issue (mirrors issueSessionToken)
const token = randomBytes(32).toString('hex');
const expires = new Date(Date.now() + 1000*60*60*24).toISOString();
db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);
db.prepare('INSERT INTO sessions(token,user_id,expires_at,issued_at) VALUES(?,?,?,?)').run(token, user.id, expires, new Date().toISOString());
console.log('token=' + token, 'userId=' + user.id);
db.close();
