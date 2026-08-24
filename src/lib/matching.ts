export type EmergencyResponseInput={averageResponseMinutes:number|null|undefined;responseSamples:number|null|undefined;responseTargetMinutes:number|null|undefined;emergencyMode?:string|null};
export type PreferredRequestWindowInput={preferredDate?:string|null;preferredTime?:string|null;now?:Date};
export type EmergencyAvailabilityInput={emergencyMode?:string|null;emergencyDays?:string|null;emergencyStart?:string|null;emergencyEnd?:string|null;now?:Date};

function clamp(value:number,min:number,max:number){return Math.max(min,Math.min(max,value));}

function berlinParts(value:Date){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',weekday:'short',hourCycle:'h23'}).formatToParts(value);
  const numberPart=(type:string)=>Number(parts.find(p=>p.type===type)?.value||0);
  const weekday=String(parts.find(p=>p.type==='weekday')?.value||'Sun');
  const weekdayIndex=({Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6} as Record<string,number>)[weekday]??0;
  return {year:numberPart('year'),month:numberPart('month'),day:numberPart('day'),hour:numberPart('hour'),minute:numberPart('minute'),weekday:weekdayIndex};
}

function berlinWallClockMs(value:Date){
  const part=berlinParts(value);
  return Date.UTC(part.year,part.month-1,part.day,part.hour,part.minute);
}

function validWallDate(year:number,month:number,day:number){
  if(!Number.isInteger(year)||!Number.isInteger(month)||!Number.isInteger(day)||month<1||month>12||day<1||day>31)return false;
  const candidate=new Date(Date.UTC(year,month-1,day));
  return candidate.getUTCFullYear()===year&&candidate.getUTCMonth()===month-1&&candidate.getUTCDate()===day;
}

function timeToMinutes(value:string|undefined|null){
  const match=String(value||'').match(/^(\d{1,2}):(\d{2})$/);
  if(!match)return null;
  const hour=Number(match[1]),minute=Number(match[2]);
  if(hour>23||minute>59)return null;
  return hour*60+minute;
}

export function preferredRequestWindow(input:PreferredRequestWindowInput){
  const date=String(input.preferredDate||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return {hasPreference:false,deltaMinutes:null,shortNotice:false,expired:false};
  const [year,month,day]=date.split('-').map(Number);
  if(!validWallDate(year,month,day))return {hasPreference:false,deltaMinutes:null,shortNotice:false,expired:false};
  const explicitTime=timeToMinutes(input.preferredTime);
  const targetMinutes=explicitTime??(23*60+59);
  const targetWall=Date.UTC(year,month-1,day,Math.floor(targetMinutes/60),targetMinutes%60);
  const deltaMinutes=(targetWall-berlinWallClockMs(input.now||new Date()))/60000;
  return {hasPreference:true,deltaMinutes,shortNotice:deltaMinutes>=0&&deltaMinutes<=48*60,expired:deltaMinutes<0};
}

export function emergencyAvailableAt(input:EmergencyAvailabilityInput){
  if(input.emergencyMode==='24_7')return true;
  const days=new Set(String(input.emergencyDays||'').split(',').map(value=>Number(value.trim())).filter(value=>Number.isInteger(value)&&value>=0&&value<=6));
  if(!days.size)return false;
  const start=timeToMinutes(input.emergencyStart),end=timeToMinutes(input.emergencyEnd);
  if(start===null||end===null)return false;
  const now=berlinParts(input.now||new Date());
  const minutes=now.hour*60+now.minute;
  if(start===end)return days.has(now.weekday);
  if(start<end)return days.has(now.weekday)&&minutes>=start&&minutes<end;
  if(minutes>=start)return days.has(now.weekday);
  if(minutes<end)return days.has((now.weekday+6)%7);
  return false;
}

export function berlinRequestTimestamp(now=new Date()){
  const part=berlinParts(now);
  return {
    date:`${part.year}-${String(part.month).padStart(2,'0')}-${String(part.day).padStart(2,'0')}`,
    time:`${String(part.hour).padStart(2,'0')}:${String(part.minute).padStart(2,'0')}`,
  };
}

export function emergencyResponseScore(input:EmergencyResponseInput){
  const samples=Math.max(0,Number(input.responseSamples)||0);
  const measured=Number(input.averageResponseMinutes);
  if(samples>=3&&Number.isFinite(measured)&&measured>=0){
    return clamp(30-measured*0.6,-8,30)+(input.emergencyMode==='24_7'?2:0);
  }
  const target=Number(input.responseTargetMinutes);
  const declared=Number.isFinite(target)&&target>0?clamp(18-target*0.08,2,16):8;
  return declared+(input.emergencyMode==='24_7'?2:0);
}
