# Security policy

## Supported versions

Security fixes target the latest Release and the current `main` branch. Modified deployments, old versions and third-party forks are not guaranteed to receive fixes.

## Report a vulnerability privately

Use GitHub's private security advisory form:

https://github.com/SuperBXO-O/FF14-RP-Front-Desk-Helper/security/advisories/new

Do not disclose the vulnerability in a public Issue before coordinated disclosure. Do not include real access tokens, player identifiers, customer records or complete data files.

Please include:

- affected version or commit;
- browser, operating system and whether Browsingway or INPA Bridge is involved;
- concise reproduction steps;
- security impact and realistic attack scenario;
- proof of concept using synthetic data;
- suggested mitigation, if known.

If the issue also affects the plugin, report the relevant component in the INPA Bridge repository's private security channel.

## Scope

Relevant reports include cross-origin access to the local plugin service, token exposure, unintended data disclosure, script injection, unsafe import handling and vulnerabilities that corrupt accounting records.

General bugs, feature requests and installation problems should use the public Issue forms in `SUPPORT.md`.
