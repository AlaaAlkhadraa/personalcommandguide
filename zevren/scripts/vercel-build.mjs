#!/usr/bin/env node
import { spawn } from "node:child_process";
import { join } from "node:path";

function run(file, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(file, args, { stdio: "inherit", env: process.env });
    child.once("error", reject);
    child.once("exit", (code, signal) =>
      code === 0 ? resolve() : reject(new Error(`${file} ${args.join(" ")} failed (${signal ?? `exit ${code}`})`))
    );
  });
}

// The schema must exist before any protected public endpoint can safely run.
await run(process.execPath, [join("scripts", "migrate.mjs")]);
await run(process.execPath, [join("node_modules", "next", "dist", "bin", "next"), "build"]);
