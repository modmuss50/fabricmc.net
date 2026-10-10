import { loadPage } from "#lib/server/content.ts";

export const trailingSlash = "never";
export const csr = false;

export function load() {
    return loadPage("/404.html");
}
