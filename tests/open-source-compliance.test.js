const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");

test("deployed page offers the repository source and names the license", () => {
  assert.match(
    html,
    /<a[^>]+href="https:\/\/github\.com\/SuperBXO-O\/FF14-RP-Front-Desk-Helper"[^>]*>[^<]*(?:Source|源码)[^<]*AGPL-3\.0[^<]*<\/a>/i
  );
  assert.match(html, /target="_blank"/i);
  assert.match(html, /rel="noopener noreferrer"/i);
});

test("README keeps generic deployment guidance without Cloudflare Workers", () => {
  assert.match(readme, /## Deployment/i);
  assert.doesNotMatch(readme, /Cloudflare Workers/i);
  assert.doesNotMatch(readme, /\bWrangler\b/i);
});
