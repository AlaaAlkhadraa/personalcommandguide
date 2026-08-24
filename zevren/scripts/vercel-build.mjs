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
// With ADMIN_EMAIL and ADMIN_PASSWORD set in the deployment's environment,
// the admin account is created or its password refreshed on every build: the
// owner manages the credentials in Vercel's settings, never in a chat or a
// terminal. The script upserts, so this is idempotent.
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  await run(process.execPath, [join("scripts", "create-admin.mjs")]);
}
await run(process.execPath, [join("node_modules", "next", "dist", "bin", "next"), "build"]);
