"""Export complete changed text files and SHA256 assets; no omitted code or recursive capsules."""
from pathlib import Path
import argparse, subprocess, hashlib, json
parser=argparse.ArgumentParser()
parser.add_argument('--root',required=True)
parser.add_argument('--base',required=True)
parser.add_argument('--out',default='docs/brand/system')
a=parser.parse_args(); root=Path(a.root).resolve(); out=root/a.out
subprocess.run(['git','cat-file','-e',a.base+'^{commit}'],cwd=root,check=True)
def names(args): return subprocess.check_output(['git',*args],cwd=root).decode().splitlines()
paths=sorted(set(names(['diff','--name-only',a.base,'--'])+names(['ls-files','--others','--exclude-standard'])))
exclude={str((out/f).relative_to(root)) for f in ['SOURCE.md','source-manifest.json']}
fence=chr(96)*5
body=['# Vollständige Quelldateien der Lieferung','',f'Basiscommit: {a.base}. Pfade relativ zu diesem Repository. Dateien vollständig, keine Auslassungszeichen. Binärdateien werden im Manifest mit SHA256 referenziert. Dieses Dokument ist ein Nachschlagewerk; implementiert wird aus den versionierten Quelldateien.','']
manifest={'base':a.base,'files':{},'deleted':[]}
for rel in paths:
 if rel in exclude: continue
 p=root/rel
 if not p.exists(): manifest['deleted'].append(rel); continue
 if not p.is_file() or p.is_symlink(): continue
 data=p.read_bytes(); item={'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)}
 try: text=data.decode('utf-8'); is_text='\0' not in text
 except UnicodeDecodeError: is_text=False
 item['kind']='text' if is_text else 'binary';manifest['files'][rel]=item
 if is_text:
  lang={'.tsx':'tsx','.ts':'ts','.mjs':'js','.js':'js','.css':'css','.json':'json','.py':'python','.yml':'yaml','.md':'markdown'}.get(p.suffix,'text')
  body.extend(['## '+rel,'',fence+lang,text,fence,''])
out.mkdir(parents=True,exist_ok=True)
(out/'SOURCE.md').write_text('\n'.join(body))
(out/'source-manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
print('EH_SOURCE_COMPLETE',len(manifest['files']))
