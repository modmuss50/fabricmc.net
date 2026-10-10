import type { EntryGenerator, PageServerLoad } from "./$types";
import { posts, loadPage } from "#lib/server/content.ts";

export const trailingSlash = "never";
export const csr = false;

export const entries: EntryGenerator = () => {
    return posts.map(post => {
        const [, year, month, day, filename] = post.url.split("/");
        return { year, month, day, slug: filename.slice(0, -5) };
    });
};

export const load: PageServerLoad = ({ params }) => {
    return loadPage(`/${params.year}/${params.month}/${params.day}/${params.slug}.html`);
};
