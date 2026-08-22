export type EmergencyResponseInput={averageResponseMinutes:number|null|undefined;responseSamples:number|null|undefined;responseTargetMinutes:number|null|undefined;emergencyMode?:string|null};
export type PreferredRequestWindowInput={preferredDate?:string|null;preferredTime?:string|null;now?:Date};

function clamp(value:number,min:number,max:number){return Math.max(min,Math.min(max,value));}

function berlinWallClockMs(value:Date){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(value);
  const part=(type:Intl.DateTimeFormatPartTypes)=>Number(parts.find(p=>p.type===type)?.value||0);
  return Date.UTC(part('year'),part('month')-1,part('day'),part('hour'),part('minute'));
}

export function preferredRequestWindow(input:PreferredRequestWindowInput){
  const date=String(input.preferredDate||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return {hasPreference:false,deltaMinutes:null,shortNotice:false,expired:false};
  const time=/^\d{2}:\d{2}$/.test(String(input.preferredTime||''))?String(input.preferredTime):'12:00';
  const [year,month,day]=date.split('-').map(Number); const [hour,minute]=time.split(':').map(Number);
  if(month<1||month>12||day<1||day>31||hour>23||minute>59)return {hasPreference:false,deltaMinutes:null,shortNotice:false,expired:false};
  const targetWall=Date.UTC(year,month-1,day,hour,minute);
  const deltaMinutes=(targetWall-berlinWallClockMs(input.now||new Date()))/60000;
  return {hasPreference:true,deltaMinutes,shortNotice:deltaMinutes>=-24*60&&deltaMinutes<=48*60,expired:deltaMinutes< -24*60};
}

export function emergencyResponseScore(input:EmergencyResponseInput){
  const samples=Math.max(0,Number(input.responseSamples)||0);
  const measured=Number(input.averageResponseMinutes);
  if(samples>=3&&Number.isFinite(measured)&&measured>=0){
    // Measured behavior has the strongest emergency signal, but cannot outweigh verified quality by itself.
    return clamp(30-measured*0.6,-8,30)+(input.emergencyMode==='24_7'?2:0);
  }
  const target=Number(input.responseTargetMinutes);
  const declared=Number.isFinite(target)&&target>0?clamp(18-target*0.08,2,16):8;
  // 24/7 is a small availability confidence signal only; it is never a paid-ranking or price signal.
  return declared+(input.emergencyMode==='24_7'?2:0);
}
