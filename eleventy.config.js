import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { compile } from "sass";
import { build } from "vite";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";
import { parse } from "yaml";
import site from "./_data/site.json" with { type: "json" };

loadLanguages(["java", "groovy", "diff", "json"]);

const markdown = new MarkdownIt({
    html: true,
    typographer: true,
    highlight(code, language) {
        const grammar = Prism.languages[language];
        if (grammar) {
            return Prism.highlight(code, grammar, language);
        }
        return "";
    },
}).use(anchor, { slugify: heading => heading.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s/g, "-") });

export default function (config) {
    const development = process.env.ELEVENTY_RUN_MODE !== "build";
    const assetUrls = new Map();
    config.addFilter("asset_url", url => {
        const assetUrl = assetUrls.get(url);
        if (!assetUrl) {
            throw new Error(`Unknown asset: ${url}`);
        }
        return assetUrl;
    });
    config.addDataExtension("yml", contents => parse(contents));
    config.setLibrary("md", markdown);
    config.addFilter("json", value => JSON.stringify(value).replace(/</g, "\\u003c"));
    config.addFilter("normalize_whitespace", text => text.replace(/\s+/g, " "));
    config.addFilter("date_to_xmlschema", value => new Date(value).toISOString());
    config.addFilter("absolute_url", value => new URL(value, site.url).href);
    config.addFilter("xml_escape", value => markdown.utils.escapeHtml(String(value)));
    config.addCollection("posts", collection => collection.getFilteredByTag("posts").reverse());
    config.addWatchTarget("assets/**/*.scss");
    config.addWatchTarget("_sass");
    config.addWatchTarget("scripts/src");
    config.addWatchTarget("scripts/svelte.config.js");
    config.addWatchTarget("scripts/vite.config.js");
    config.setServerOptions({ port: 4000, domDiff: false });

    config.addPassthroughCopy("assets/**/*.{png,jpg,svg,woff2,txt}");
    config.addPassthroughCopy("download");
    config.addPassthroughCopy("robots.txt");
    config.ignores.add("{README.md,LICENSE,scripts/**,cli/**,node_modules/**}");
    config.on("eleventy.before", async () => {
        if (!development) {
            rmSync("_site", { recursive: true, force: true });
        }
        mkdirSync("_site/assets", { recursive: true });
        for (const name of ["main", "dark"]) {
            const result = compile(`assets/${name}.scss`, {
                loadPaths: ["_sass"],
                style: "compressed",
                silenceDeprecations: ["import", "global-builtin", "color-functions", "slash-div"],
            });
            const hash = createHash("sha256").update(result.css).digest("hex").slice(0, 12);
            const url = `/assets/${name}-${hash}.css`;
            writeFileSync(`_site${url}`, result.css);
            assetUrls.set(`/assets/${name}.css`, url);
        }
        await build({
            root: "scripts",
            configFile: "scripts/vite.config.js",
            mode: development ? "development" : "production",
        });
        const manifest = JSON.parse(readFileSync("_site/scripts/.vite/manifest.json", "utf8"));
        assetUrls.set("/scripts/main.js", `/scripts/${manifest["src/main.ts"].file}`);
        assetUrls.set("/scripts/style.css", `/scripts/${manifest["style.css"].file}`);
    });
    return {
        templateFormats: ["md", "html", "liquid"],
        markdownTemplateEngine: "liquid",
        htmlTemplateEngine: "liquid",
        dir: { input: ".", output: "_site", includes: "_includes", layouts: "_layouts", data: "_data" },
    };
}
