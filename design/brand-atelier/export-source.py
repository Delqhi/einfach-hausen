#!/usr/bin/env python3
"""Export every changed text file in full, plus SHA256 for every artifact.
Only this capsule and its manifest are excluded to avoid recursive containers.
"""
from pathlib import Path
import subprocess, hashlib, json, re
root=Path(__file__).resolve().parents[2]
base='1239f7c469007ca5dd9895a8a0f44100c2b8b583'
output=root/'docs/brand/ATELIER_02_SOURCE.md'
manifest=root/'docs/brand/evidence/atelier/manifest.json'
tracked=subprocess.check_output(['git','diff','--name-only',base,'--'],cwd=root,text=True).splitlines()
untracked=subprocess.check_output(['git','ls-files','--others','--exclude-standard'],cwd=root,text=True).splitlines()
skip={str(output.relative_to(root)),str(manifest.relative_to(root))}
paths=sorted(set(tracked+untracked)-skip)
parts=['# Atelier 02 — complete source capsule','Base: '+base,'Workspace: '+str(root),'Branch: design/einfachhausen-brand-atelier-20260906','Every new or changed UTF-8 file follows in full, including the generated standalone preview. Binary artifacts are listed with SHA256 in manifest.json. Only this derived capsule and its own manifest are excluded to avoid recursion. Existing unchanged asset bytes are identified in assets.json and remain in their original repository paths.']
records=[]
for name in paths:
    p=root/name
    if not p.is_file(): continue
    data=p.read_bytes()
    item={'path':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
    try:
        content=data.decode('utf-8')
        if '\x00' in content: raise UnicodeError('binary')
        fence=chr(96)*max(3,max((len(x) for x in re.findall(chr(96)+'+',content)),default=0)+1)
        lang={'.js':'javascript','.mjs':'javascript','.py':'python','.html':'html','.css':'css','.json':'json','.md':'markdown'}.get(p.suffix,'text')
        parts.extend(['\n## '+name,'SHA256: '+item['sha256'],fence+lang+'\n'+content+'\n'+fence])
        item['kind']='complete-text'
    except UnicodeError:
        item['kind']='binary'
    records.append(item)
output.write_text('\n\n'.join(parts)+'\n')
manifest.write_text(json.dumps({'base':base,'workspace':str(root),'capsule_sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'files':records},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'capsule':str(output),'text_files':sum(x['kind']=='complete-text' for x in records),'artifacts':len(records),'bytes':output.stat().st_size}))
