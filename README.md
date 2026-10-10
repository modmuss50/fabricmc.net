# fabricmc.net

This repository contains the source code and content for [https://fabricmc.net/](https://fabricmc.net/).

## License

The code is licensed as MIT as detailed in `LICENSE`, unless otherwise indicated.

The contents of this website, unless otherwise indicated, are licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

The site uses SvelteKit with mdsvex and the static adapter. The Minima 2.5.1
styles are included in `src/styles/includes`, with the theme's MIT license in
`src/styles/includes/minima/LICENSE.txt`.

## Development

Use the Node version in `.nvmrc` (`nvm install` and `nvm use` if using nvm).
Install dependencies and start the website from the repository root:

```sh
npm ci
npm run dev
```

Open http://localhost:4000/.

### Content

Blog posts live in `_posts/YYYY-MM-DD-slug.md` and automatically publish at
`/YYYY/MM/DD/slug.html`. Set `title` and `layout: post` in the YAML frontmatter.
The blog listing, homepage summaries, Atom feed, and sitemap update automatically.

Other pages live in `content/pages/*.md`, with a `permalink` specifying their URL
and a `layout` of `default`, `page`, `home`, or `use`. Markdown can import Svelte
components. Wrap interactive tools in `ClientOnly` so their API requests run in
the browser rather than during the build.

Shared templates live in `src/lib`, interactive tools and the shared CLI library
in `scripts/src/lib`, and public files in `static`. Markdown transforms and code
highlighting are configured in `tooling/markdown.ts`.

### Preview the build

Build the website and serve the generated files without live reloading:

```sh
npm run build:site
npm run preview
```

Open http://localhost:4173/. Preview serves the existing `_site` directory;
run the build again to include further changes. Deploy the contents of `_site` to
any static host; no Node server is required. The build checks types and validates
the generated routes, metadata, feeds, and assets.

Post pages contain complete HTML and ship no client JavaScript. Interactive pages
are prerendered and then hydrated in the browser. Links use normal document
navigation, including links to the separately hosted wiki and download service. The separate PHP download
service is outside this site build.

### Running the CLI

Run CLI commands from the repository root:

```sh
npm run cli -- init
npm run cli -- versions
```
