import type { MarkdownModule, PageData } from "./types";

const components = import.meta.glob<MarkdownModule>(["../../content/pages/*.md", "../../_posts/*.md"]);

export async function load({ data }: { data: PageData }) {
    const module = await components[`../..${data.page.source}`]();
    return { ...data, Content: module.default };
}

export function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(date));
}
