import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { BLOG_POSTS, LEXIKON_TERMS } from '@/lib/seo-cluster';

/**
 * SEO P0: statische Sitemap aller oeffentlichen Marketing-Routen.
 * Privat: /app/*, /admin/*, /pro/*, Auth (/login, /register*), dynamische
 * App-Routen (/anfrage/*, /chat/*, /onboarding/*, /transfer/*), funktionale
 * Tools (/ki-chat, /mein-haus, /ansprechpartner, /anfragen-pro) sind
 * bewusst NICHT enthalten (diese tragen zusaetzlich noindex-Metadata).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{ path: string; changeFrequency: 'weekly' | 'monthly' | 'yearly'; priority: number }> = [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/leistungen', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/preise', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/so-funktionierts', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/pilotphase', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/eigenheimbesitzer', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/hausakte', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/partner', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/hilfe', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/leistungen/heizung', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.6 },
    { path: '/lexikon', changeFrequency: 'weekly', priority: 0.6 },
    { path: '/kontakt', changeFrequency: 'yearly', priority: 0.5 },
    { path: '/ueber-uns', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/sicherheit', changeFrequency: 'yearly', priority: 0.4 },
    { path: '/barrierefreiheit', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/agb', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/datenschutz', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/impressum', changeFrequency: 'yearly', priority: 0.3 },
  ];
  const cluster: Array<{ path: string; changeFrequency: 'weekly' | 'monthly' | 'yearly'; priority: number }> = [
    ...BLOG_POSTS.map((p) => ({ path: `/blog/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...LEXIKON_TERMS.map((t) => ({ path: `/lexikon/${t.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
  const now = new Date();
  return [...pages, ...cluster].map(({ path, changeFrequency, priority }) => ({
    // Prozent-kodiert: Slugs duerfen Umlaute enthalten (/lexikon/lueftungsanlage).
    url: path === '/' ? `${SITE_URL}/` : `${SITE_URL}${encodeURI(path)}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
