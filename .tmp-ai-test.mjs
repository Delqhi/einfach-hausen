import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
const root='/home/ubuntu/dev/einfach-hausen';
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'ai-'));
fs.symlinkSync(path.join(root,'node_modules'),path.join(scratch,'node_modules'),'dir');
for(const rel of ['src/lib/db.ts','src/lib/ai-engine.ts']){
  const src=fs.readFileSync(path.join(root,rel),'utf8');
  const stripped=stripTypeScriptTypes(src).replace(/(from\s*['"])(\.\.?\/[^'"]+)(['"])/g,(_m,a,s,b)=>`${a}${s}.mjs${b}`);
  const dest=path.join(scratch,rel.replace(/\.ts$/,'.mjs'));
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.writeFileSync(dest,stripped);
}
process.env.DATABASE_PATH='/tmp/ai-engine-test2.db';
const { db }=await import('file://'+path.join(scratch,'src/lib/db.mjs'));
const ai=await import('file://'+path.join(scratch,'src/lib/ai-engine.mjs'));
let pass=0, fail=0;
function check(name, cond, detail=''){ if(cond){pass++;console.log('  ok ',name);} else {fail++;console.log('FAIL',name,'::',detail);} }
const r1=ai.classifyLocally('Meine Hecke ist zu hoch, Dienstag ab 14 Uhr haette ich Zeit. 46325');
check('no cloud needed (clear trade)', !r1.needsCloud, r1.cloudReason);
const r2=ai.classifyLocally('Rohr im Keller geplatzt, Wasser laeuft sofort');
check('emergency local', r2.urgency==='emergency' && !r2.needsCloud, JSON.stringify(r2));
const r3=ai.classifyLocally('Was kostet ungefaehr eine PV-Anlage und lohnt sich das?');
check('open question -> cloud', r3.needsCloud && r3.cloudReason==='open_question', r3.cloudReason);
const r4=ai.classifyLocally('xyzquantumfoobar');
check('no match -> cloud', r4.needsCloud && r4.cloudReason==='no_trade_match');
db.prepare("INSERT INTO users(email,password_hash,role,first_name,last_name) VALUES('ai2@example.test','x','homeowner','A','I')").run();
const uid=Number(db.prepare("SELECT id FROM users WHERE email='ai2@example.test'").get().id);
for(let i=0;i<ai.FREEMIUM_MONTHLY;i++) ai.consumeCloudAction(uid);
check('freemium exhausted', ai.aiQuotaSnapshot(uid).freemiumRemaining===0);
check('blocked', ai.consumeCloudAction(uid).source==='blocked');
ai.grantAdCredits(uid);
check('ad credits work', ai.consumeCloudAction(uid).source==='credit');
db.prepare("INSERT INTO user_settings(user_id,ai_byok_enabled,ai_byok_provider) VALUES(?,1,'openai-compatible')").run(uid);
check('byok flag', ai.byokEnabled(uid));
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
