#!/usr/bin/env node
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..", "dist");
const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${host}:${port}`);
  let relPath = url.pathname;

  if (relPath === "/" || !relPath) {
    relPath = "/index.html";
  }

  const filePath = path.join(rootDir, relPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    const mime = mimeTypes[ext] || "application/octet-stream";
    res.setHeader("Content-Type", mime);

    const stream = fs.createReadStream(filePath);
    stream.on("error", () => {
      res.statusCode = 500;
      res.end("Internal server error");
    });
    stream.pipe(res);
  });
});

server.listen(port, host, () => {
  console.log(`Serving dist on http://${host}:${port}`);
});

