run: build
	node bundled.mjs

check:
	npm run check

fontgen:
	node fontgen.ts

test: fontgen check
	npm test

build: fontgen check
	node bundle.ts

install: build
	npm install -g .

install-bundled: install

init: build
	rm -rf ./test
	node bundled.mjs init ./test

versions: build
	node bundled.mjs versions

init-bundled: init
