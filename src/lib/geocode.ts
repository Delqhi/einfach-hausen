import { db } from './db';
export type Geo={lat:number,lon:number};

// Deterministic two-digit PLZ-region centroids for pilot matching. These are only a coarse
// availability fallback when no exact cached/network geocode exists and are never presented
// to users as a precise address position.
const REGION_CENTROIDS:Record<string,Geo>={
  '01':{lat:51.05,lon:13.74},'02':{lat:51.15,lon:14.98},'03':{lat:51.76,lon:14.33},'04':{lat:51.34,lon:12.37},
  '06':{lat:51.48,lon:11.97},'07':{lat:50.88,lon:12.08},'08':{lat:50.72,lon:12.50},'09':{lat:50.83,lon:12.92},
  '10':{lat:52.52,lon:13.40},'11':{lat:52.50,lon:13.35},'12':{lat:52.45,lon:13.44},'13':{lat:52.56,lon:13.39},'14':{lat:52.40,lon:13.06},
  '15':{lat:52.30,lon:13.62},'16':{lat:52.75,lon:13.24},'17':{lat:53.56,lon:13.26},'18':{lat:54.09,lon:12.10},'19':{lat:53.63,lon:11.41},
  '20':{lat:53.55,lon:10.00},'21':{lat:53.46,lon:10.01},'22':{lat:53.62,lon:10.07},'23':{lat:53.87,lon:10.69},'24':{lat:54.32,lon:10.14},
  '25':{lat:53.92,lon:9.52},'26':{lat:53.14,lon:8.21},'27':{lat:53.54,lon:8.58},'28':{lat:53.08,lon:8.80},'29':{lat:52.62,lon:10.08},
  '30':{lat:52.38,lon:9.73},'31':{lat:52.15,lon:9.95},'32':{lat:52.12,lon:8.67},'33':{lat:52.02,lon:8.53},'34':{lat:51.31,lon:9.49},
  '35':{lat:50.58,lon:8.67},'36':{lat:50.55,lon:9.68},'37':{lat:51.53,lon:9.93},'38':{lat:52.27,lon:10.52},'39':{lat:52.13,lon:11.63},
  '40':{lat:51.23,lon:6.78},'41':{lat:51.19,lon:6.44},'42':{lat:51.26,lon:7.15},'44':{lat:51.51,lon:7.47},'45':{lat:51.46,lon:7.01},
  '46':{lat:51.72,lon:6.88},'47':{lat:51.43,lon:6.76},'48':{lat:51.96,lon:7.63},'49':{lat:52.28,lon:8.05},
  '50':{lat:50.94,lon:6.90},'51':{lat:50.99,lon:7.12},'52':{lat:50.78,lon:6.08},'53':{lat:50.73,lon:7.10},'54':{lat:49.75,lon:6.64},
  '55':{lat:49.99,lon:8.25},'56':{lat:50.36,lon:7.59},'57':{lat:50.87,lon:8.02},'58':{lat:51.36,lon:7.47},'59':{lat:51.68,lon:7.82},
  '60':{lat:50.11,lon:8.68},'61':{lat:50.23,lon:8.61},'63':{lat:49.98,lon:9.15},'64':{lat:49.87,lon:8.65},'65':{lat:50.08,lon:8.24},
  '66':{lat:49.24,lon:6.99},'67':{lat:49.48,lon:8.44},'68':{lat:49.49,lon:8.47},'69':{lat:49.40,lon:8.68},
  '70':{lat:48.78,lon:9.18},'71':{lat:48.90,lon:9.19},'72':{lat:48.52,lon:9.06},'73':{lat:48.72,lon:9.45},'74':{lat:49.14,lon:9.22},
  '75':{lat:48.89,lon:8.70},'76':{lat:49.01,lon:8.40},'77':{lat:48.47,lon:7.94},'78':{lat:48.06,lon:8.46},'79':{lat:47.99,lon:7.85},
  '80':{lat:48.14,lon:11.58},'81':{lat:48.11,lon:11.50},'82':{lat:48.00,lon:11.34},'83':{lat:47.86,lon:12.13},'84':{lat:48.54,lon:12.15},
  '85':{lat:48.40,lon:11.74},'86':{lat:48.37,lon:10.90},'87':{lat:47.73,lon:10.31},'88':{lat:47.78,lon:9.61},'89':{lat:48.40,lon:9.99},
  '90':{lat:49.45,lon:11.08},'91':{lat:49.59,lon:11.01},'92':{lat:49.44,lon:11.86},'93':{lat:49.02,lon:12.10},'94':{lat:48.57,lon:13.46},
  '95':{lat:49.95,lon:11.58},'96':{lat:49.90,lon:10.90},'97':{lat:49.79,lon:9.95},'98':{lat:50.61,lon:10.69},'99':{lat:50.98,lon:11.03},
};

export function regionalPostcodeGeo(postcode:string):Geo|null{
  const code=postcode.trim();if(!/^\d{5}$/.test(code))return null;
  const exact=db.prepare('SELECT lat,lon FROM postcode_geo WHERE postcode=?').get(code) as Geo|undefined;if(exact)return exact;
  const prefix=code.slice(0,2);
  const cached=db.prepare(`SELECT AVG(lat) lat,AVG(lon) lon,COUNT(*) c FROM postcode_geo WHERE substr(postcode,1,2)=?`).get(prefix) as {lat:number|null;lon:number|null;c:number};
  if(cached?.c&&Number.isFinite(cached.lat)&&Number.isFinite(cached.lon))return {lat:Number(cached.lat),lon:Number(cached.lon)};
  return REGION_CENTROIDS[prefix]||null;
}

export async function geocodePostcode(postcode:string):Promise<Geo|null>{
  const code=postcode.trim(); if(!/^\d{5}$/.test(code)) return null;
  const cached=db.prepare('SELECT lat,lon FROM postcode_geo WHERE postcode=?').get(code) as Geo|undefined; if(cached)return cached;
  try{
    const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),1500);
    const url=new URL('https://nominatim.openstreetmap.org/search'); url.searchParams.set('postalcode',code);url.searchParams.set('country','Germany');url.searchParams.set('format','jsonv2');url.searchParams.set('limit','1');
    const res=await fetch(url,{headers:{'User-Agent':'EinfachHausen/1.0 (postcode matching)'},signal:controller.signal,cache:'no-store'});clearTimeout(timer);if(!res.ok)return regionalPostcodeGeo(code);
    const rows=await res.json() as Array<{lat:string,lon:string}>; if(!rows[0])return regionalPostcodeGeo(code); const geo={lat:Number(rows[0].lat),lon:Number(rows[0].lon)};if(!Number.isFinite(geo.lat)||!Number.isFinite(geo.lon))return regionalPostcodeGeo(code);
    db.prepare(`INSERT INTO postcode_geo(postcode,lat,lon,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(postcode) DO UPDATE SET lat=excluded.lat,lon=excluded.lon,updated_at=CURRENT_TIMESTAMP`).run(code,geo.lat,geo.lon);return geo;
  }catch{return regionalPostcodeGeo(code);}
}
export function distanceKm(a:Geo,b:Geo){const R=6371;const rad=(x:number)=>x*Math.PI/180;const dLat=rad(b.lat-a.lat),dLon=rad(b.lon-a.lon);const s=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(s));}
