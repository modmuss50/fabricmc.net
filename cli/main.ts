#!/usr/bin/env node

import { exit } from "node:process";
import { Command } from "@cliffy/command";
import { CompletionsCommand } from "@cliffy/command/completions";
import { initCommand } from "./commands/init.ts";
import { versionsCommand } from "./commands/versions.ts";

// Replaced by esbuild.
declare let __VERSION__: string;
const VERSION = typeof __VERSION__ !== "undefined" ? __VERSION__ : "dev";

const cmd = new Command()
  .name("fabric")
  .version(VERSION)
  .description("A set of command line tools to aid Fabric mod development")
  .action(() => {
    // Show the help in the default command with no args.
    cmd.showHelp();
    exit(0);
  })
  .command("init", initCommand());

cmd
  .command("versions", versionsCommand())
  .command("completions", new CompletionsCommand());

await cmd.parse();
