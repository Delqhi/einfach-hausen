import { db } from './db';
export type Geo={lat:number,lon:number};
export async function geocodePostcode(postcode:string):Promise<Geo|null>{
  const code=postcode.trim(); if(!/^\d{5}$/.test(code)) return null;
  const cached=db.prepare('SELECT lat,lon FROM postcode_geo WHERE postcode=?').get(code) as Geo|undefined; if(cached)return cached;
  try{
    const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),1500);
    const url=new URL('https://nominatim.openstreetmap.org/search'); url.searchParams.set('postalcode',code);url.searchParams.set('country','Germany');url.searchParams.set('format','jsonv2');url.searchParams.set('limit','1');
    const res=await fetch(url,{headers:{'User-Agent':'MeinHausmeister/1.0 (marketplace postcode geocoding)'},signal:controller.signal,cache:'no-store'});clearTimeout(timer);if(!res.ok)return null;
    const rows=await res.json() as Array<{lat:string,lon:string}>; if(!rows[0])return null; const geo={lat:Number(rows[0].lat),lon:Number(rows[0].lon)};if(!Number.isFinite(geo.lat)||!Number.isFinite(geo.lon))return null;
    db.prepare('INSERT OR REPLACE INTO postcode_geo(postcode,lat,lon,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP)').run(code,geo.lat,geo.lon);return geo;
  }catch{return null;}
}
export function distanceKm(a:Geo,b:Geo){const R=6371;const rad=(x:number)=>x*Math.PI/180;const dLat=rad(b.lat-a.lat),dLon=rad(b.lon-a.lon);const s=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(s));}
