/** Deterministic, allowlisted vendor transfer. Only clean committed canonical releases. */
import {readFileSync,writeFileSync,readdirSync,mkdirSync,existsSync,copyFileSync,realpathSync} from "node:fs";
import {resolve,dirname,relative} from "node:path";
import {fileURLToPath} from "node:url";
import {execFileSync} from "node:child_process";
import {hash} from "./eh-design-check.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const arg=process.argv.indexOf("--target");if(arg<0||!process.argv[arg+1])throw new Error("Usage: node scripts/eh-design-sync.mjs --target /absolute/consumer-repository [--check]");
const target=realpathSync(process.argv[arg+1]);if(target===root||target.startsWith(root+"/"))throw new Error("Target must be another repository");
const source=resolve(root,"packages/eh-design");const dest=resolve(target,"vendor/eh-design");const manifestPath=resolve(target,"design/eh-design-vendor.json");
const status=execFileSync("git",["status","--porcelain","--","packages/eh-design"],{cwd:root,encoding:"utf8"});if(status.trim())throw new Error("Canonical package must be committed before synchronization");
const commit=execFileSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8"}).trim();
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(resolve(dir,e.name)):[resolve(dir,e.name)]);}
const files=walk(source).map(p=>relative(source,p)).sort();
if(files.some(p=>!/^((src\/[a-z-]+(?:\.module)?\.(tsx?|mjs|css|json))|(assets\/(logo-full\.png|inter-variable\.woff2))|package\.json)$/.test(p)))throw new Error("Undeclared canonical package file");
const prior=existsSync(manifestPath)?JSON.parse(readFileSync(manifestPath,"utf8")):null;
if(existsSync(dest))for(const file of walk(dest)) {
 const p=relative(dest,file);const bytes=hash(readFileSync(file));const old=prior?.files[p];
 if(!files.includes(p))throw new Error("Unexpected vendor file; refusing overwrite: "+p);
 if(old && bytes!==old && bytes!==hash(readFileSync(resolve(source,p))))throw new Error("Local vendor edit: "+p);
 if(!old && bytes!==hash(readFileSync(resolve(source,p))))throw new Error("Untracked differing vendor file: "+p);
}
const hashes=Object.fromEntries(files.map(p=>[p,hash(readFileSync(resolve(source,p)))]));
if(process.argv.includes("--check")) {
 if(!prior||JSON.stringify(prior.files)!==JSON.stringify(hashes))throw new Error("Vendor manifest drift");
 for(const p of files)if(!existsSync(resolve(dest,p))||hash(readFileSync(resolve(dest,p)))!==hashes[p])throw new Error("Vendor drift: "+p);
}else{
 for(const p of files){mkdirSync(dirname(resolve(dest,p)),{recursive:true});copyFileSync(resolve(source,p),resolve(dest,p));}
 mkdirSync(dirname(manifestPath),{recursive:true});
 writeFileSync(manifestPath,JSON.stringify({version:"1.0.0",repository:"https://github.com/Delqhi/einfach-hausen",commit,files:hashes},null,2)+"\n");
}
console.log("EH_VENDOR_VALID");
