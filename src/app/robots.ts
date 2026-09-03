import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/** SEO P0: oeffentlich alles, privat (/app, /admin, /api) gesperrt + Sitemap-Zeile. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/app/', '/admin/', '/api/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
