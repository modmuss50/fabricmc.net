import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { decodeHTML } from "entities";

const postFiles = (await readdir("_posts")).filter(name => name.endsWith(".md")).sort().reverse();
const postUrls = postFiles.map(name => `/${name.slice(0, 10).replaceAll("-", "/")}/${name.slice(11, -3)}.html`);
const pageUrls: string[] = [];
for (const filename of await readdir("content/pages")) {
    const content = await readFile(join("content/pages", filename), "utf8");
    pageUrls.push(content.match(/^permalink: (.+)$/m)![1]);
}
const urls = [...postUrls, ...pageUrls];

function outputPath(url: string) {
    return join("_site", url.endsWith("/") ? `${url}index.html` : url);
}

async function filesIn(directory: string): Promise<string[]> {
    const files: string[] = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...await filesIn(path));
        } else {
            files.push(path);
        }
    }
    return files;
}

test("every content page is generated at its original URL with matching metadata", async () => {
    const htmlFiles = (await filesIn("_site")).filter(path => path.endsWith(".html")).sort();
    assert.deepEqual(htmlFiles, urls.map(outputPath).sort());
    for (const url of urls) {
        const html = await readFile(outputPath(url), "utf8");
        const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)![1];
        assert.equal(canonical, `https://fabricmc.net${url}`, url);
        const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)![1]);
        assert.equal(schema.url, canonical, url);
        assert.ok(schema.description.length > 0, url);
        if (postUrls.includes(url)) {
            assert.equal(schema["@type"], "BlogPosting", url);
            assert.equal(schema.datePublished.slice(0, 10), url.slice(1, 11).replaceAll("/", "-"), url);
            assert.ok(!html.includes('type="module"'), `Post should work without client JavaScript: ${url}`);
        }
    }
});

test("blog and homepage link to the latest posts in date and filename order", async () => {
    const blog = await readFile(outputPath("/blog/"), "utf8");
    const links = [...blog.matchAll(/class="post-link" href="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(links, postUrls);
    const home = await readFile(outputPath("/"), "utf8");
    for (const url of postUrls.slice(0, 2)) {
        assert.ok(home.includes(`href="${url}"`), url);
    }
});

test("feed and sitemap are generated from the same content URLs", async () => {
    const sitemap = await readFile("_site/sitemap.xml", "utf8");
    const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decodeHTML(match[1]));
    assert.deepEqual(locations.sort(), urls.filter(url => url !== "/404.html").map(url => `https://fabricmc.net${url}`).sort());
    const feed = await readFile("_site/feed.xml", "utf8");
    const entries = [...feed.matchAll(/<entry>[\s\S]*?<id>(.*?)<\/id>[\s\S]*?<content type="html"[^>]*>([\s\S]*?)<\/content>[\s\S]*?<\/entry>/g)];
    assert.deepEqual(entries.map(match => match[1]), postUrls.slice(0, 10).map(url => `https://fabricmc.net${url}`));
    for (const entry of entries) {
        assert.ok(decodeHTML(entry[2]).includes("<p>"), entry[1]);
        assert.ok(!decodeHTML(entry[2]).includes("<!--"), entry[1]);
    }
});

test("public files and referenced build assets exist in the static output", async () => {
    for (const source of await filesIn("static")) {
        const output = source.replace(/^static\//, "_site/");
        assert.deepEqual(await readFile(output), await readFile(source), source);
    }
    for (const url of urls) {
        const html = await readFile(outputPath(url), "utf8");
        for (const match of html.matchAll(/(?:src|href)="(\/_app\/[^"?#]+)"/g)) {
            await readFile(join("_site", match[1]));
        }
    }
});
