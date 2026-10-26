# Maintaining the project

This document defines the expected issue intake and closure flow. It does not create a support-level guarantee or response deadline.

## Labels

Create these labels in the repository before relying on automatic issue form labels:

| Label | Meaning |
|---|---|
| `bug` | Confirmed defect in project behavior |
| `enhancement` | General improvement being evaluated |
| `question` | Usage or configuration question routed to support |
| `needs-triage` | New issue not yet reviewed |
| `needs-info` | Waiting for version, environment, reproduction or privacy cleanup |
| `duplicate` | Same underlying issue already tracked |
| `cannot-reproduce` | Steps do not reproduce on an unmodified supported version |
| `out-of-scope` | Private customization, unrelated platform issue or unsupported deployment |
| `not-planned` | Considered but intentionally not scheduled |
| `security` | Public-safe tracking label; vulnerability details must remain private |

## Intake flow

1. Confirm the issue uses the correct repository and a structured form.
2. Check the latest Release, `main` and duplicate reports.
3. Verify the minimum evidence:
   - webpage version or commit;
   - plugin version when applicable;
   - browser, operating system and runtime;
   - data mode;
   - expected and actual behavior;
   - concise reproduction steps;
   - attachments with private data removed.
4. Reproduce on an unmodified page. Do not debug a user's private fork as the baseline.
5. Apply one outcome:
   - `bug` after reproduction;
   - `needs-info` when evidence is incomplete;
   - `enhancement` for a general problem worth evaluating;
   - `out-of-scope` or `not-planned` with a short reason when declined.

## Feature proposals

Evaluate the underlying workflow problem before evaluating a requested implementation. Prefer changes that benefit multiple deployments and preserve offline operation.

Acceptance means the proposal is worth considering. It does not imply a release date, implementation commitment or priority over defects.

## Needs-info closure

If an issue remains `needs-info` without a response for 14 days, it may be closed. A user may reopen it or open a new issue when the missing evidence is available. Do not close confirmed defects solely because they are difficult.

## Pull requests

- Focused fixes may link to an existing issue and proceed directly.
- Large features, architecture changes and new dependencies need an accepted Issue first.
- Require tests proportional to the change and explicit verification evidence.
- Verify privacy, third-party licensing and AGPL-compatible distribution.
- Do not merge unrelated refactors into a behavior fix.

## Security

Never request or publish access tokens, complete browser storage, player identifiers or real business records. Move plausible vulnerabilities to a private security advisory and avoid discussing exploit details in public issues.
