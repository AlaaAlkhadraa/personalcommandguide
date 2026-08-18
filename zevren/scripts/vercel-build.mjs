#!/usr/bin/env node
/**
 * Vercel production build: migrate first, bootstrap an admin only when both
 * one-time bootstrap variables are present, then compile the application.
 */
import { spawn } from "node:child_process";
import { join } from "node:path";

function run(file, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(file, args, { stdio: "inherit", env: process.env });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${file} ${args.join(" ")} failed (${signal ?? `exit ${code}`})`));
    });
  });
}

await run(process.execPath, [join("scripts", "migrate.mjs")]);

if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  await run(process.execPath, [join("scripts", "create-admin.mjs")]);
} else {
  console.log("Admin bootstrap skipped: one-time credentials are not configured.");
}

await run(process.execPath, [join("node_modules", "next", "dist", "bin", "next"), "build"]);
