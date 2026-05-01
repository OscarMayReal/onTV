import { spawnSync } from "child_process";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const nodeGypBin = require.resolve("node-gyp/bin/node-gyp.js");

const result = spawnSync(
  process.execPath,
  [
    nodeGypBin,
    "rebuild",
    "--runtime=electron",
    "--target=39.2.7",
    "--arch=x64",
    "--dist-url=https://www.electronjs.org/headers",
    "--build-from-source",
  ],
  {
    cwd: path.join(root, "node_modules", "better-sqlite3"),
    stdio: "inherit",
  },
);

process.exit(result.status ?? 1);
