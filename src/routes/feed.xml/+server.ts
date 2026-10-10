import { posts } from "#lib/server/content.ts";
import { escapeXml, xmlResponse } from "#lib/server/xml.ts";
import site from "#lib/site.json";

export const prerender = true;
export const trailingSlash = "never";

export function GET() {
    const entries = posts.slice(0, 10).map(post => {
        const url = escapeXml(new URL(post.url, site.url).href);
        return `<entry>
  <title>${escapeXml(post.title)}</title>
  <link href="${url}" rel="alternate" type="text/html"/>
  <published>${post.date}</published>
  <updated>${post.date}</updated>
  <id>${url}</id>
  <content type="html" xml:base="${url}">${escapeXml(post.html)}</content>
  <author><name>${escapeXml(post.author || site.title)}</name></author>
</entry>`;
    });
    return xmlResponse(`<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(site.title)}</title>
  <subtitle>${escapeXml(site.description)}</subtitle>
  <link href="${site.url}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${site.url}/" rel="alternate" type="text/html"/>
  <updated>${posts[0]?.date ?? "1970-01-01T00:00:00.000Z"}</updated>
  <id>${site.url}/feed.xml</id>
  ${entries.join("\n")}
</feed>`);
}
