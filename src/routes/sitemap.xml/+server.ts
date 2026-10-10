import { pages } from "#lib/server/content.ts";
import { escapeXml, xmlResponse } from "#lib/server/xml.ts";
import site from "#lib/site.json";

export const prerender = true;
export const trailingSlash = "never";

export function GET() {
    const entries = pages.filter(page => page.url !== "/404.html").map(page => {
        const url = escapeXml(new URL(page.url, site.url).href);
        const lastModified = page.date ? `<lastmod>${page.date}</lastmod>` : "";
        return `<url><loc>${url}</loc>${lastModified}</url>`;
    });
    return xmlResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`);
}
