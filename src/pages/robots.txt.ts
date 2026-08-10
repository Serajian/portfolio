import type { APIRoute } from 'astro';
import { site } from '../data/site';

/* Generated rather than a static file so the sitemap URL can never drift
   from the canonical domain. */
export const GET: APIRoute = ({ site: astroSite }) => {
  const origin = (astroSite ?? new URL(site.meta.url)).origin;

  const body = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
