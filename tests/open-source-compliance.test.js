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

test("community intake uses structured issue forms and private security reporting", () => {
  const issueDir = path.join(root, ".github", "ISSUE_TEMPLATE");
  const config = fs.readFileSync(path.join(issueDir, "config.yml"), "utf8");
  const bug = fs.readFileSync(path.join(issueDir, "bug.yml"), "utf8");
  const feature = fs.readFileSync(path.join(issueDir, "feature.yml"), "utf8");
  const support = fs.readFileSync(path.join(root, "SUPPORT.md"), "utf8");
  const security = fs.readFileSync(path.join(root, "SECURITY.md"), "utf8");
  const maintaining = fs.readFileSync(path.join(root, "MAINTAINING.md"), "utf8");
  const conduct = fs.readFileSync(path.join(root, "CODE_OF_CONDUCT.md"), "utf8");
  const pullRequest = fs.readFileSync(
    path.join(root, ".github", "PULL_REQUEST_TEMPLATE.md"),
    "utf8",
  );

  assert.match(config, /blank_issues_enabled:\s*false/);
  assert.match(config, /SUPPORT\.md/);
  assert.match(config, /INPABridge\/issues/);
  assert.match(bug, /id:\s*version/);
  assert.match(bug, /id:\s*runtime/);
  assert.match(bug, /id:\s*data_mode/);
  assert.match(bug, /id:\s*privacy/);
  assert.match(bug, /needs-triage/);
  assert.match(feature, /id:\s*problem/);
  assert.match(feature, /id:\s*workaround/);
  assert.match(feature, /id:\s*scope/);
  assert.match(support, /GitHub Issues/);
  assert.match(support, /私人定制/);
  assert.match(security, /security\/advisories\/new/);
  assert.match(maintaining, /needs-info/);
  assert.match(maintaining, /14 days/);
  assert.match(maintaining, /does not imply a release date/);
  assert.match(conduct, /Unacceptable behavior/);
  assert.match(pullRequest, /Privacy and licensing/);
});
