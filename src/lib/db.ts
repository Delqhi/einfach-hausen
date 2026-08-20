import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const dbPath = process.env.DATABASE_PATH ? path.resolve(process.env.DATABASE_PATH) : path.join(process.cwd(), 'data', 'einfach-hausen.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const globalForDb = globalThis as unknown as { hausmeisterDb?: Database.Database };
export const db = globalForDb.hausmeisterDb ?? new Database(dbPath);
if (process.env.NODE_ENV !== 'production') globalForDb.hausmeisterDb = db;
db.pragma('journal_mode = WAL'); db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT NOT NULL UNIQUE COLLATE NOCASE,password_hash TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('homeowner','provider')),first_name TEXT NOT NULL,last_name TEXT NOT NULL,phone TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at TEXT NOT NULL); CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS homeowner_profiles (user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,postcode TEXT NOT NULL DEFAULT '',address TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS provider_profiles (user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,business_name TEXT NOT NULL,trades TEXT NOT NULL DEFAULT '',postcode TEXT NOT NULL DEFAULT '',radius_km INTEGER NOT NULL DEFAULT 25,verified INTEGER NOT NULL DEFAULT 0,rating REAL NOT NULL DEFAULT 0,rating_count INTEGER NOT NULL DEFAULT 0,description TEXT NOT NULL DEFAULT '',stripe_account_id TEXT,stripe_onboarded INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY AUTOINCREMENT,homeowner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,title TEXT NOT NULL,description TEXT NOT NULL,category TEXT NOT NULL,postcode TEXT NOT NULL,preferred_date TEXT,preferred_time TEXT,budget_min INTEGER,budget_max INTEGER,status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','quoted','accepted','in_progress','completed','cancelled')),accepted_quote_id INTEGER,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP); CREATE INDEX IF NOT EXISTS idx_jobs_homeowner ON jobs(homeowner_id,created_at DESC); CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status,category,postcode);
CREATE TABLE IF NOT EXISTS job_photos (id INTEGER PRIMARY KEY AUTOINCREMENT,job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,path TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY AUTOINCREMENT,job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,provider_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,amount INTEGER NOT NULL,available_at TEXT,message TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','rejected','withdrawn')),created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE(job_id,provider_id)); CREATE INDEX IF NOT EXISTS idx_quotes_job ON quotes(job_id,amount ASC);
CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY AUTOINCREMENT,job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,provider_id INTEGER NOT NULL REFERENCES users(id),homeowner_id INTEGER NOT NULL REFERENCES users(id),start_at TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'confirmed' CHECK(status IN ('confirmed','completed','cancelled')),created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP); CREATE INDEX IF NOT EXISTS idx_appointments_user_time ON appointments(homeowner_id,start_at);
CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT,job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,sender_id INTEGER NOT NULL REFERENCES users(id),recipient_id INTEGER NOT NULL REFERENCES users(id),body TEXT NOT NULL,read_at TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP); CREATE INDEX IF NOT EXISTS idx_messages_job ON messages(job_id,created_at ASC);
CREATE TABLE IF NOT EXISTS payments (id INTEGER PRIMARY KEY AUTOINCREMENT,job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,homeowner_id INTEGER NOT NULL REFERENCES users(id),provider_id INTEGER NOT NULL REFERENCES users(id),amount INTEGER NOT NULL,currency TEXT NOT NULL DEFAULT 'eur',status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','paid','failed','refunded')),stripe_session_id TEXT UNIQUE,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,paid_at TEXT);
CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY AUTOINCREMENT,job_id INTEGER NOT NULL UNIQUE REFERENCES jobs(id) ON DELETE CASCADE,homeowner_id INTEGER NOT NULL REFERENCES users(id),provider_id INTEGER NOT NULL REFERENCES users(id),rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),comment TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY AUTOINCREMENT,job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,provider_id INTEGER REFERENCES users(id),kind TEXT NOT NULL CHECK(kind IN ('invoice','offer','report','warranty','other')),title TEXT NOT NULL,path TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP); CREATE INDEX IF NOT EXISTS idx_documents_job ON documents(job_id,created_at DESC);
CREATE TABLE IF NOT EXISTS verification_requests (id INTEGER PRIMARY KEY AUTOINCREMENT,provider_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,document_path TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),provider_note TEXT NOT NULL DEFAULT '',admin_note TEXT NOT NULL DEFAULT '',submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,reviewed_at TEXT);
CREATE TABLE IF NOT EXISTS claims (id INTEGER PRIMARY KEY AUTOINCREMENT,job_id INTEGER NOT NULL UNIQUE REFERENCES jobs(id) ON DELETE CASCADE,homeowner_id INTEGER NOT NULL REFERENCES users(id),provider_id INTEGER NOT NULL REFERENCES users(id),description TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','reviewing','resolved','rejected')),admin_note TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS admin_sessions (token TEXT PRIMARY KEY,expires_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,kind TEXT NOT NULL DEFAULT 'info',title TEXT NOT NULL,body TEXT NOT NULL DEFAULT '',href TEXT NOT NULL DEFAULT '',read_at TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP); CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id,read_at,created_at DESC);
CREATE TABLE IF NOT EXISTS postcode_geo (postcode TEXT PRIMARY KEY,lat REAL NOT NULL,lon REAL NOT NULL,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
`);

// Safe additive migrations for databases created by earlier versions. Next.js can
// evaluate this module in parallel build workers, so tolerate the tiny race where
// another worker adds a column after our PRAGMA check.
function addColumnIfMissing(table:string,column:string,definition:string){
  const columns=db.prepare(`PRAGMA table_info(${table})`).all() as Array<{name:string}>;
  if(columns.some(c=>c.name===column)) return;
  try{ db.exec(`ALTER TABLE ${table} ADD COLUMN ${definition}`); }
  catch(error){
    if(!(error instanceof Error) || !error.message.toLowerCase().includes('duplicate column name')) throw error;
  }
}
addColumnIfMissing('provider_profiles','stripe_account_id','stripe_account_id TEXT');
addColumnIfMissing('provider_profiles','stripe_onboarded','stripe_onboarded INTEGER NOT NULL DEFAULT 0');
addColumnIfMissing('homeowner_profiles','lat','lat REAL');
addColumnIfMissing('homeowner_profiles','lon','lon REAL');
addColumnIfMissing('provider_profiles','lat','lat REAL');
addColumnIfMissing('provider_profiles','lon','lon REAL');
addColumnIfMissing('jobs','lat','lat REAL');
addColumnIfMissing('jobs','lon','lon REAL');
