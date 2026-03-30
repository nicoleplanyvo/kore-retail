import { Router, type Router as RouterType } from 'express';
import prisma from '../lib/prisma.js';

export const sitemapRouter: RouterType = Router();

const PUBLIC_URL = process.env['PUBLIC_URL'] ?? 'https://kore-retail.de';

/**
 * Statische Seiten der KORE Website mit Prioritaeten und Aenderungshaeufigkeit.
 */
const STATIC_PAGES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/consulting', changefreq: 'monthly', priority: '0.9' },
  { path: '/training', changefreq: 'monthly', priority: '0.9' },
  { path: '/suite', changefreq: 'monthly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/audit', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/legal', changefreq: 'yearly', priority: '0.3' },
  { path: '/blog', changefreq: 'daily', priority: '0.8' },
];

// ── GET /sitemap.xml — Dynamic Sitemap ──
sitemapRouter.get('/', async (_req, res) => {
  try {
    // Alle veroeffentlichten Blog-Posts aus der Datenbank holen
    const blogPosts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      select: {
        slug: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    // XML generieren
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Statische Seiten
    for (const page of STATIC_PAGES) {
      xml += '  <url>\n';
      xml += `    <loc>${PUBLIC_URL}${page.path}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    // Blog-Posts dynamisch
    for (const post of blogPosts) {
      const lastmod = (post.updatedAt ?? post.publishedAt)?.toISOString().split('T')[0];
      xml += '  <url>\n';
      xml += `    <loc>${PUBLIC_URL}/blog/${post.slug}</loc>\n`;
      if (lastmod) {
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
      }
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    }

    xml += '</urlset>\n';

    // Cache-Control: maximal 1 Stunde cachen, danach muss revalidiert werden
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, must-revalidate');
    res.set('X-Robots-Tag', 'noindex');
    res.send(xml);
  } catch (err) {
    console.error('[sitemap] Fehler:', err);
    res.status(500).set('Content-Type', 'text/plain').send('Sitemap generation failed');
  }
});
