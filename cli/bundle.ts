import * as esbuild from "esbuild";
import { chmod, readFile, writeFile } from "node:fs/promises";

const { version } = JSON.parse(await readFile("./package.json", "utf8"));

const header = `/**
* Fabric Command Line tools
* This file contains a bundled TypeScript file with the code and dependencies for the Fabric command line tools.
* The source code for this tool can be found at: https://github.com/FabricMC/fabricmc.net
*/
`;

try {
  const nodeBundle = await esbuild.build({
    entryPoints: ["./main.ts"],
    bundle: true,
    format: "esm",
    minify: true,
    supported: { "dynamic-import": true },
    write: false,
    outfile: "./bundled.mjs",
    platform: "node",
    target: ["node22"],
    define: {
      __VERSION__: JSON.stringify(version),
    },
    banner: {
      js: header +
        'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);',
    },
  });
  await writeFile("./bundled.mjs", nodeBundle.outputFiles![0].text);
  await chmod("./bundled.mjs", 0o755);
} finally {
  esbuild.stop();
}
