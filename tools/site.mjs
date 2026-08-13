import { createServer } from "node:http";
import { cp, mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const ignoredDirectories = new Set([".git", ".wrangler", "dist", "node_modules", "tools"]);
const ignoredRootFiles = new Set([
  ".gitignore",
  "package.json",
  "package-lock.json",
  "README.md",
  "RECOVERY_AUDIT_2026-08-13.md",
  "SECURITY_MODEL.md",
  "SITE_ARCHITECTURE.md"
]);
const ignoredPublishPrefixes = ["blog/src/"];
const ignoredPublishFiles = new Set([
  "blog/static/js/main.70d4e2e3.js",
  "blog/static/js/main.70d4e2e3.js.LICENSE.txt"
]);
const referencePattern = /(?:href|src|data-full)\s*=\s*["']([^"']*)["']|url\(\s*["']?([^"')]+)|(?:window\.)?location\.href\s*=\s*["']([^"']+)["']/gi;

function isIgnoredDirectory(directory) {
  return ignoredDirectories.has(directory) || directory.startsWith(".restore-");
}

async function walk(directory, base = directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && isIgnoredDirectory(entry.name)) continue;
    if (directory === root && entry.isFile() && ignoredRootFiles.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute, base));
    if (entry.isFile()) {
      const relative = path.relative(base, absolute).split(path.sep).join("/");
      if (relative.endsWith(".map")) continue;
      if (ignoredPublishFiles.has(relative)) continue;
      if (ignoredPublishPrefixes.some((prefix) => relative.startsWith(prefix))) continue;
      files.push(relative);
    }
  }
  return files;
}

function isExternal(reference) {
  return !reference || reference.startsWith("#") || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference);
}

function localCandidates(page, reference) {
  const clean = reference.split(/[?#]/, 1)[0];
  let decoded;
  try {
    decoded = decodeURIComponent(clean);
  } catch {
    decoded = clean;
  }
  const pageDirectory = path.posix.dirname(page);
  const target = path.posix.normalize(decoded.startsWith("/")
    ? decoded.slice(1)
    : path.posix.join(pageDirectory, decoded));
  const candidates = [target];
  if (decoded.endsWith("/")) candidates.push(path.posix.join(target, "index.html"));
  if (!path.posix.extname(target)) candidates.push(path.posix.join(target, "index.html"));
  return candidates;
}

async function checkSite(directory) {
  const files = await walk(directory, directory);
  const fileSet = new Set(files);
  const pages = files.filter((file) => file.endsWith(".html"));
  const missing = [];
  const pageEdges = new Map(pages.map((page) => [page, []]));

  for (const page of pages) {
    const source = await readFile(path.join(directory, page), "utf8");
    for (const match of source.matchAll(referencePattern)) {
      const reference = match[1] || match[2] || match[3] || "";
      if (isExternal(reference)) continue;
      const candidates = localCandidates(page, reference);
      const resolved = candidates.find((candidate) => fileSet.has(candidate));
      if (!resolved) {
        missing.push(`${page}: ${reference}`);
      } else if (resolved.endsWith(".html")) {
        pageEdges.get(page).push(resolved);
      }
    }
  }

  if (missing.length) {
    throw new Error(`Missing local references:\n${missing.map((item) => `- ${item}`).join("\n")}`);
  }

  const reachable = new Set(["index.html"]);
  const queue = ["index.html"];
  while (queue.length) {
    const page = queue.shift();
    for (const target of pageEdges.get(page) || []) {
      if (reachable.has(target)) continue;
      reachable.add(target);
      queue.push(target);
    }
  }
  const unreachable = pages.filter((page) => !reachable.has(page));
  if (unreachable.length) {
    throw new Error(`Unreachable HTML pages:\n${unreachable.map((page) => `- ${page}`).join("\n")}`);
  }

  const bytes = (await Promise.all(files.map(async (file) => (await stat(path.join(directory, file))).size)))
    .reduce((total, size) => total + size, 0);
  return { files: files.length, pages: pages.length, reachable: reachable.size, bytes };
}

async function build() {
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  for (const file of await walk(root, root)) {
    const destination = path.join(output, file);
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(path.join(root, file), destination);
  }
  const result = await checkSite(output);
  console.log(`Built ${result.pages} pages and ${result.files} files (${result.bytes} bytes) into dist/.`);
  return result;
}

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"], [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"], [".jpg", "image/jpeg"], [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"], [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"], [".png", "image/png"],
  [".svg", "image/svg+xml"], [".txt", "text/plain; charset=utf-8"], [".webp", "image/webp"]
]);

async function serve() {
  await build();
  const port = Number(process.env.PORT || 4173);
  const host = process.env.HOST || "127.0.0.1";
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", `http://${request.headers.host || host}`);
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.endsWith("/")) pathname += "index.html";
      const file = path.resolve(output, `.${pathname}`);
      if (file !== output && !file.startsWith(`${output}${path.sep}`)) throw new Error("Invalid path");
      const body = await readFile(file);
      response.writeHead(200, { "Content-Type": mimeTypes.get(path.extname(file).toLowerCase()) || "application/octet-stream" });
      response.end(body);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("404 Not Found");
    }
  });
  server.listen(port, host, () => console.log(`Local preview: http://${host}:${port}/`));
}

const command = process.argv[2] || "check";
if (command === "check") {
  const result = await checkSite(root);
  console.log(`Checked ${result.pages} pages and ${result.files} files; local references resolve and all pages are reachable.`);
} else if (command === "build") {
  await build();
} else if (command === "serve" || command === "preview") {
  await serve();
} else {
  throw new Error(`Unknown command: ${command}`);
}
