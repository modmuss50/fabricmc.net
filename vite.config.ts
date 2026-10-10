import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import { markdownOptions } from "./tooling/markdown.ts";

export default defineConfig({
    plugins: [sveltekit({
        adapter: adapter({ pages: "_site", assets: "_site" }),
        // Routes enumerate their entries; historical /wiki links are hosted separately.
        prerender: { crawl: false },
        extensions: [".svelte", ".md"],
        preprocess: [vitePreprocess(), mdsvex(markdownOptions)],
    })],
    css: {
        preprocessorOptions: {
            scss: {
                loadPaths: ["src/styles/includes"],
                silenceDeprecations: ["import", "global-builtin", "color-functions", "slash-div"],
            },
        },
    },
});
