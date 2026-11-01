import { cpSync, mkdirSync, rmSync } from "node:fs";

const buildDirectory = new URL("../build/", import.meta.url);

rmSync(buildDirectory, { recursive: true, force: true });
mkdirSync(buildDirectory, { recursive: true });

for (const file of ["Sidebar.html", "appsscript.json"]) {
	cpSync(new URL(`../${file}`, import.meta.url), new URL(`../build/${file}`, import.meta.url));
}
