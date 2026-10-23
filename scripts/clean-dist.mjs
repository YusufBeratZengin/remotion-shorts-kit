import { rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(project, "dist");
if (dirname(output) !== project || output === project) {
  throw new Error("Refusing to remove a build directory outside this project");
}
rmSync(output, { recursive: true, force: true });
