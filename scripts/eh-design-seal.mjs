/** Brand-authority release tool. Ordinary agents MUST NOT run this to bypass a failed guard. */
import {readFileSync,writeFileSync,readdirSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {hash,scan} from "./eh-design-check.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const policy=JSON.parse(readFileSync(resolve(root,"design/design-policy.json"),"utf8"));
function tree(path){if(!existsSync(resolve(root,path)))return [];return readdirSync(resolve(root,path),{withFileTypes:true}).flatMap(e=>e.isDirectory()?tree(path+e.name+"/"):[path+e.name]);}
if(process.argv.includes("--initial-debt"))writeFileSync(resolve(root,"design/design-debt.json"),JSON.stringify(scan(root),null,2)+"\n");
const paths=policy.protected.flatMap(p=>p.endsWith("/")?tree(p):existsSync(resolve(root,p))?[p]:[]).filter(p=>p!=="design/design-lock.json");
writeFileSync(resolve(root,"design/design-lock.json"),JSON.stringify({version:"1.0.0",authority:"Jerry explicitly accepted Atelier 02 and commissioned this release on 2026-09-06.",files:Object.fromEntries(paths.sort().map(p=>[p,hash(readFileSync(resolve(root,p)))]))},null,2)+"\n");
console.log("EH_DESIGN_SEALED");
