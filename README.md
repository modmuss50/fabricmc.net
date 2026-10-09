# fabricmc.net

This repository contains the source code and content for [https://fabricmc.net/](https://fabricmc.net/). Jekyll is used as the static site generator. A small TypeScript Svelte project located in /scripts powers the interactive parts of the site.

## License

The code is licensed as MIT as detailed in `LICENSE`, unless otherwise indicated.

The contents of this website, unless otherwise indicated, are licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## Develop using Docker dev container.

Install Docker and VSCode on the host, no need to install NodeJS or Ruby on the host.

* Open dev container with vscode
* Run `bundle install && bundler exec jekyll serve` in a terminal
* In a second terminal, run: `npm ci`, `npm run dev`
* http://localhost:4000/

## Build
### Prerequisites

- [NodeJS](https://nodejs.org/en/)
- [Ruby 2.7 *with* DevKit](https://rubyinstaller.org/downloads/)

### Install Jekyll

Ensure that the Ruby dependencies are installed locally, not system-wide:

```
bundle config set --local path 'vendor/bundle'
bundle install 
```

From then on, run Jekyll using `bundle exec jekyll <args>` to use the local version.

### Build JavaScript Assets

Install dependencies for the `scripts` and `cli` workspaces by running `npm ci` in the repository root.

Build the website assets with `npm run build --workspace scripts`, or build both workspaces with `npm run build`.

Build the CLI separately with `npm run build --workspace cli`.

### Running the CLI from Source

Run CLI commands from the repository root:

```sh
npm run cli -- init
npm run cli -- versions
```

Each invocation builds and type-checks the CLI before running it. Use the Node version in `.nvmrc` (`nvm install` and `nvm use` if using nvm).

### Build Site

```
bundle exec jekyll build
```

This will build the site into the `_site` folder.

### Developing the Site

To run a local development server to more comfortably edit the site, run:

```
bundle exec jekyll serve
```

Then open http://localhost:4000 in your browser of choice. The site should update automatically as you change the files.

## Docker

Used to build and run a production like server.

* `docker build -f Dockerfile.dev -t fabricmc-net .`
* `docker run -p 8080:80 fabricmc.net`
* `http://localhost:8080/`
