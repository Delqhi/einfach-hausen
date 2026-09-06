import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {execFileSync} from "node:child_process";
import {check,scan,hash} from "./eh-design-check.mjs";
function fixture(fn) {
 const root=mkdtempSync(join(tmpdir(),"eh-design-guard-"));const put=(p,s)=>{mkdirSync(join(root,p,".."),{recursive:true});writeFileSync(join(root,p),s);};
 const git=(...args)=>execFileSync("git",args,{cwd:root,encoding:"utf8",stdio:["ignore","pipe","pipe"]}).trim();
 put("src/existing.tsx",'export const x=<p style={{color:"#123456"}}>Existing debt</p>;\n');
 put("packages/eh-design/core.ts","export const approved=true;\n");
 put("design/design-policy.json",JSON.stringify({protected:["packages/eh-design/","design/","scripts/eh-design-check.mjs",".github/workflows/eh-design.yml"],ownedStyleFiles:[]}));
 put("scripts/eh-design-check.mjs","trusted guard");put(".github/workflows/eh-design.yml","trusted workflow");
 put("design/design-debt.json",JSON.stringify(scan(root)));
 put("design/design-lock.json",JSON.stringify({files:{"packages/eh-design/core.ts":hash("export const approved=true;\n")}}));
 git("init","-q");git("add",".");git("-c","user.name=Guard Test","-c","user.email=guard@example.invalid","commit","-qm","fixture");const base=git("rev-parse","HEAD");
 try{fn({root,put,base,git});}finally{rmSync(root,{recursive:true,force:true});}
}
test("unchanged debt and semantic canonical composition pass",()=>fixture(({root,put,base,git})=>{
 put("src/page.tsx",'import {EHHeading} from "@/design-system"; export default function Page(){return <EHHeading>Content</EHHeading>;}');
 git("add","src/page.tsx");assert.deepEqual(check(root,{base}),[]);
}));
test("new literal, too-small type and foreign font fail",()=>fixture(({root,put})=>{
 put("src/new.css",'.x { color:#ff0011;font-size:11px;font-family:Manrope; }');
 const errors=check(root);assert(errors.some(e=>e.includes("literal-color")));assert(errors.some(e=>e.includes("small-type")));assert(errors.some(e=>e.includes("foreign-font")));
}));
test("moving lines cannot increase a debt allowance",()=>fixture(({root,put})=>{
 put("src/existing.tsx",'\n\nexport const x=<p style={{color:"#123456",background:"#123456"}}>More debt</p>;');
 assert(check(root).some(e=>e.includes("literal-color")));
}));
test("debt removal passes without rebaselining",()=>fixture(({root,put})=>{
 put("src/existing.tsx",'export const x=<p>Less debt</p>;');assert.deepEqual(check(root),[]);
}));
test("editing core and resealing still fails trusted-base comparison",()=>fixture(({root,put,base})=>{
 const s="export const approved=false;\n";put("packages/eh-design/core.ts",s);put("design/design-lock.json",JSON.stringify({files:{"packages/eh-design/core.ts":hash(s)}}));
 assert(check(root,{base}).some(e=>e.includes("Brand authority required")));
}));
test("weakening guard, workflow or baseline fails",()=>fixture(({root,put,base})=>{
 put("scripts/eh-design-check.mjs","bypass");put(".github/workflows/eh-design.yml","skip all");put("design/design-debt.json","{}");
 const errors=check(root,{base});for(const path of ["scripts/eh-design-check.mjs",".github/workflows/eh-design.yml","design/design-debt.json"])assert(errors.some(e=>e.includes(path)));
}));
test("new CSS and disconnected UI fail even without suspicious literals",()=>fixture(({root,put,base,git})=>{
 put("src/rogue.css",".rogue { display:grid; }");put("src/rogue.tsx","export const Rogue=()=> <button>Invented component</button>;");
 git("add","src");const errors=check(root,{base});assert(errors.some(e=>e.includes("New page styling forbidden")));assert(errors.some(e=>e.includes("New UI must consume")));
}));
