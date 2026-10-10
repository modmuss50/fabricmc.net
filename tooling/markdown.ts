import type { Root, RootContent } from "hast";
import type { MdsvexOptions } from "mdsvex";
import { escapeSvelte } from "mdsvex";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";

loadLanguages(["java", "groovy", "diff", "json"]);

type MarkdownNode = Root | RootContent | { type: "raw"; value: string };

// Preserve existing heading links, including markdown-it-anchor's duplicate suffixes.
function headingIds() {
    return (tree: Root) => {
        const used = new Set<string>();
        function text(node: MarkdownNode): string {
            if (node.type === "comment" || node.type === "raw" && node.value.startsWith("<!--")) {
                return "";
            }
            if ("value" in node) {
                return node.value;
            }
            return "children" in node ? node.children.map(text).join("") : "";
        }
        function visit(node: MarkdownNode) {
            if (node.type === "element" && /^h[1-6]$/.test(node.tagName)) {
                const slug = text(node).toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s/g, "-");
                let id = slug;
                let suffix = 1;
                while (used.has(id)) {
                    id = `${slug}-${suffix}`;
                    suffix += 1;
                }
                used.add(id);
                node.properties = { ...node.properties, id, tabIndex: -1 };
            }
            for (const child of "children" in node ? node.children : []) {
                visit(child);
            }
        }
        visit(tree);
    };
}

export const markdownOptions: MdsvexOptions = {
    extensions: [".md"],
    rehypePlugins: [headingIds],
    highlight: {
        highlighter(code, language) {
            const languageName = language ?? "";
            const grammar = Prism.languages[languageName];
            const html = grammar ? Prism.highlight(code, grammar, languageName) : Prism.util.encode(code);
            const className = languageName ? ` class="language-${languageName}"` : "";
            return escapeSvelte(`<pre><code${className}>${html}</code></pre>`);
        },
    },
};
