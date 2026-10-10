import type { EntryGenerator, PageServerLoad } from "./$types";
import { pages, loadPage } from "#lib/server/content.ts";

export const entries: EntryGenerator = () => {
    return pages.filter(page => page.url.endsWith("/")).map(page => ({ path: page.url.slice(1, -1) }));
};

export const load: PageServerLoad = ({ params }) => {
    return loadPage(params.path ? `/${params.path.replace(/\/$/, "")}/` : "/");
};
