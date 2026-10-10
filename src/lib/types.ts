import type { Component } from "svelte";

export interface ContentPage {
    source: string;
    url: string;
    date: string;
    title: string;
    author: string;
    layout: string;
    description: string;
    summary: string;
    html: string;
}

export type PostSummary = Omit<ContentPage, "html" | "source">;

export interface PageData {
    page: Omit<ContentPage, "html">;
    posts: PostSummary[];
}

export interface MarkdownModule {
    default: Component<{ posts?: PostSummary[] }>;
    metadata: {
        permalink?: string;
        title?: string;
        author?: string;
        layout?: string;
        description?: string;
    };
}
