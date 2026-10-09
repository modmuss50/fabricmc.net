import { rmSync, writeFileSync } from "node:fs";
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
    config.addGlobalData("buildTime", () => new Date());
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
    config.on("eleventy.before", () => {
        if (!development) {
            rmSync("_site", { recursive: true, force: true });
        }
    });
    config.on("eleventy.after", async () => {
        for (const name of ["main", "dark"]) {
            const result = compile(`assets/${name}.scss`, {
                loadPaths: ["_sass"],
                style: "compressed",
                silenceDeprecations: ["import", "global-builtin", "color-functions", "slash-div"],
            });
            // Sass is generated separately so the legacy public CSS URLs stay stable.
            writeFileSync(`_site/assets/${name}.css`, result.css);
        }
        await build({
            root: "scripts",
            configFile: "scripts/vite.config.js",
            mode: development ? "development" : "production",
        });
    });
    return {
        templateFormats: ["md", "html", "liquid"],
        markdownTemplateEngine: "liquid",
        htmlTemplateEngine: "liquid",
        dir: { input: ".", output: "_site", includes: "_includes", layouts: "_layouts", data: "_data" },
    };
}
