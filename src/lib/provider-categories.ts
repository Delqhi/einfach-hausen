import { db } from './db';

export function providerCategorySlugs(providerId:number){
  return (db.prepare(`SELECT category_slug FROM provider_category_assignments WHERE provider_id=? ORDER BY category_slug`).all(providerId) as Array<{category_slug:string}>).map(r=>r.category_slug);
}

export function providerHasCategory(providerId:number,slug:string){
  return !!db.prepare(`SELECT 1 FROM provider_category_assignments WHERE provider_id=? AND category_slug=?`).get(providerId,slug);
}

export function providerCategories(){
  return db.prepare(`SELECT * FROM provider_categories WHERE active=1 ORDER BY CASE slug WHEN 'handwerk' THEN 1 WHEN 'dienstleistung' THEN 2 WHEN 'makler' THEN 3 WHEN 'gutachter' THEN 4 ELSE 9 END,title`).all() as any[];
}

export function providerServiceSlugs(providerId:number){
  return (db.prepare(`SELECT service_slug FROM provider_service_offerings WHERE provider_id=? AND active=1 ORDER BY service_slug`).all(providerId) as Array<{service_slug:string}>).map(r=>r.service_slug);
}
