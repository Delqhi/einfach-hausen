import path from 'node:path';

export function privateRoot(){
  return path.resolve(process.cwd(),'data','private');
}

export function resolvePrivatePath(storedPath:string|null|undefined){
  if(!storedPath||storedPath.includes('\0')||path.isAbsolute(storedPath))return null;
  const root=privateRoot();
  const resolved=path.resolve(root,storedPath);
  const relative=path.relative(root,resolved);
  if(relative===''||relative==='..'||relative.startsWith(`..${path.sep}`)||path.isAbsolute(relative))return null;
  return resolved;
}

export function canReadJobMedia(user:{id:number;role:'homeowner'|'provider'}|null,homeownerId:number,providerAuthorized:boolean,admin:boolean){
  return admin||Boolean(user&&(user.id===homeownerId||(user.role==='provider'&&providerAuthorized)));
}
