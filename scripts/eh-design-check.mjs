import {readFileSync,existsSync,readdirSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";
export const hash=data=>createHash("sha256").update(data).digest("hex");
export function violations(path,source) {
  const results=[];
  const rules=[
    ["literal-color", /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\([^)]*\)/g],
    ["foreign-font", /\b(?:Manrope|Poppins|Geist|Roboto|Montserrat|Playfair|DM Sans)\b/g],
    ["small-type", /font-size\s*:\s*(?:[0-9]|1[0-2])(?:\.\d+)?px\b|fontSize\s*:\s*(?:[0-9]|1[0-2])\b|text-(?:xs|\[(?:[0-9]|1[0-2])px\])/g],
    ["unowned-style", /\bstyle\s*=\s*\{/g],
    ["decorative-effect", /(?:linear|radial|conic)-gradient\s*\(|backdrop-filter\s*:\s*blur|\b(?:shadow-(?:xl|2xl)|rounded-full|backdrop-blur|bg-gradient-)\b/g],
    ["visual-utility", /\b(?:bg|text|border|ring)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g],
  ];
  for(const [rule,pattern] of rules) for(const match of source.matchAll(pattern)) results.push({rule,token:match[0],key:rule+"\u0000"+match[0]});
  return results;
}
function walk(root,path="src") {
  const dir=resolve(root,path);if(!existsSync(dir))return [];
  return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(root,path+"/"+e.name):/\.(?:css|tsx?|jsx?)$/.test(e.name)?[path+"/"+e.name]:[]);
}
export function scan(root) {
  const baseline={};
  for(const path of walk(root)) {
    const counts={};for(const v of violations(path,readFileSync(resolve(root,path),"utf8")))counts[v.key]=(counts[v.key]??0)+1;
    if(Object.keys(counts).length)baseline[path]=counts;
  }
  return baseline;
}
export function check(root,{base,checkSeal=true}={}) {
  const errors=[];const policy=JSON.parse(readFileSync(resolve(root,"design/design-policy.json"),"utf8"));
  const baseline=JSON.parse(readFileSync(resolve(root,"design/design-debt.json"),"utf8"));
  const current=scan(root);
  for(const [path,counts] of Object.entries(current))for(const [key,count] of Object.entries(counts))if(count>(baseline[path]?.[key]??0))errors.push(path+": new "+key.split("\u0000")[0]+" ("+count+" > "+(baseline[path]?.[key]??0)+")");
  if(checkSeal) {
    const lock=JSON.parse(readFileSync(resolve(root,"design/design-lock.json"),"utf8"));
    for(const [path,expected] of Object.entries(lock.files)) {
      const file=resolve(root,path);if(!existsSync(file)||hash(readFileSync(file))!==expected)errors.push("Protected design file changed: "+path);
    }
  }
  if(base) {
    // Base is an exact commit from the PR event. Never run PR-controlled shell text.
    if(!/^[0-9a-f]{40}$/.test(base))throw new Error("Expected full base commit SHA");
    const show=path=>{try{return execFileSync("git",["show",base+":"+path],{cwd:root,encoding:"utf8",stdio:["ignore","pipe","pipe"]});}catch{return null;}};
    const previous=show("design/design-policy.json");
    if(previous) {
      const trusted=JSON.parse(previous);
      const changed=execFileSync("git",["diff","--name-only",base,"--"],{cwd:root,encoding:"utf8"}).trim().split("\n").filter(Boolean);
      for(const path of changed) if(trusted.protected.some(p=>p.endsWith("/")?path.startsWith(p):path===p))errors.push("Brand authority required; protected path differs from trusted base: "+path);
      const oldDebt=show("design/design-debt.json");if(oldDebt && readFileSync(resolve(root,"design/design-debt.json"),"utf8")!==oldDebt)errors.push("Debt baseline is immutable in ordinary PRs");
    }
    const added=execFileSync("git",["diff","--name-only","--diff-filter=A",base,"--","src"],{cwd:root,encoding:"utf8"}).trim().split("\n").filter(Boolean);
    for(const path of added) {
      if(path.endsWith(".css") && !policy.ownedStyleFiles.includes(path))errors.push("New page styling forbidden; compose canonical components: "+path);
      if(path.endsWith(".tsx") && !path.startsWith("src/app/api/") && !path.startsWith("src/design-system/")) {
        const source=readFileSync(resolve(root,path),"utf8");
        if(/<[A-Za-z]/.test(source) && !/from\s+["'][^"']*(?:design-system|eh-design|components\/marketing\/ui)(?:\/[^"']*)?["']/.test(source))errors.push("New UI must consume the canonical library: "+path);
      }
    }
  }
  return errors;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const root=resolve(process.env.EH_DESIGN_ROOT??dirname(fileURLToPath(import.meta.url))+"/..");
  const arg=process.argv.indexOf("--base");const errors=check(root,{base:arg>=0?process.argv[arg+1]:undefined});
  if(errors.length){console.error(errors.join("\n"));process.exitCode=1;}else console.log("EH_DESIGN_CONSISTENT");
}
