import { decodeHTML } from "entities";
import { render } from "svelte/server";
import { error } from "@sveltejs/kit";
import type { ContentPage, MarkdownModule, PageData } from "../types";
import site from "../site.json";

const modules = import.meta.glob<MarkdownModule>(["../../../content/pages/*.md", "../../../_posts/*.md"], { eager: true });

function plainText(html: string) {
    return decodeHTML(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

export const pages: ContentPage[] = Object.entries(modules).map(([source, module]) => {
    const metadata = module.metadata;
    const isPost = source.includes("/_posts/");
    let date = "";
    let url = metadata.permalink;
    let html = "";
    if (isPost) {
        const filename = source.slice(source.lastIndexOf("/") + 1);
        const match = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/.exec(filename);
        if (!match) {
            throw new Error(`Invalid post filename: ${filename}`);
        }
        date = `${match[1]}-${match[2]}-${match[3]}T00:00:00.000Z`;
        url = `/${match[1]}/${match[2]}/${match[3]}/${match[4]}.html`;
        html = render(module.default).body.replace(/<!--.*?-->/gs, "");
    }
    if (!url) {
        throw new Error(`Missing permalink: ${source}`);
    }
    const excerpt = plainText(html.match(/^<(p|h[1-6])[^>]*>([\s\S]*?)<\/\1>/)?.[2] ?? "");
    const text = plainText(html);
    return {
        source: source.replace("../../..", ""),
        url,
        date,
        title: metadata.title ?? "",
        author: metadata.author ?? "",
        layout: metadata.layout ?? "page",
        description: metadata.description || excerpt || site.description,
        summary: text.length > 310 ? `${text.slice(0, 307)}...` : text,
        html,
    };
});

const urls = new Set<string>();
for (const page of pages) {
    if (urls.has(page.url)) {
        throw new Error(`Duplicate permalink: ${page.url}`);
    }
    urls.add(page.url);
}

export const posts = pages.filter(page => page.layout === "post").sort((a, b) => b.date.localeCompare(a.date) || b.source.localeCompare(a.source));

export function loadPage(url: string): PageData {
    const page = pages.find(page => page.url === url);
    if (!page) {
        error(404, "Page not found");
    }
    let summaries: ContentPage[] = [];
    if (page.url === "/") {
        summaries = posts.slice(0, 2);
    } else if (page.layout === "home") {
        summaries = posts;
    }
    const { html, ...pageData } = page;
    return {
        page: pageData,
        posts: summaries.map(({ html, source, ...post }) => post),
    };
}
