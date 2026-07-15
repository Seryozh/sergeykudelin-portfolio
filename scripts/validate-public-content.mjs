import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const roots = ["app", "public"];
const textExtensions = new Set([".css", ".html", ".js", ".json", ".mjs", ".svg", ".ts", ".tsx", ".txt"]);

const blocked = [
  ["absolute local path", new RegExp(["/", "Users", "/"].join(""), "i")],
  ["private Drive URL", new RegExp(["drive", ".google", ".com"].join(""), "i")],
  ["old unsupported reply claim", /15\s*%/i],
  ["unverified click claim", /12\s*%/i],
  ["weaker FutureClinic ownership framing", /first working version/i],
  ["removed Fyxed outbound meeting claim", /first meeting booked through outbound/i],
  ["unsupported formal title", new RegExp(["Founding", " Engineer"].join(""), "i")],
  ["unsupported bank wording", new RegExp(["FDIC", "-backed"].join(""), "i")],
  ["private FutureClinic repository", new RegExp(["doctor", "-preview", "-pages"].join(""), "i")],
  ["private Fyxed repository", new RegExp(["fyxed", "-owner", "-pages"].join(""), "i")],
  ["private operating context", new RegExp(["fyxed", "-ops"].join(""), "i")],
  ["em dash", /—/],
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if (textExtensions.has(extname(entry.name))) files.push(path);
  }
  return files;
}

const failures = [];
for (const target of roots) {
  for (const file of await walk(join(root, target))) {
    const source = await readFile(file, "utf8");
    for (const [label, expression] of blocked) {
      if (expression.test(source)) failures.push(`${relative(root, file)}: ${label}`);
    }
  }
}

if (failures.length) {
  console.error("Public-content validation failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("Public-content validation passed.");
