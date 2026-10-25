# Contributing

By submitting a contribution, you agree that it may be distributed under the repository's AGPL-3.0 license.

Before submitting:

1. Do not include official Final Fantasy XIV artwork, logos, fonts, screenshots, game text, player data or business records.
2. Do not include credentials, tokens, local storage dumps or `data/` directories.
3. Third-party code or assets must include a compatible license and complete attribution in `THIRD-PARTY-NOTICES.md`.
4. Keep the application runnable without a build step unless a proposal explicitly changes the project architecture.
5. Test the affected desktop and mobile workflow.
6. For network-visible changes, verify offline mode, plugin-disconnected mode and reduced-motion behavior.

Constructive issues and focused pull requests are preferred.

## Automated checks

Run the open-source presentation checks before submitting a pull request:

```bash
node --test tests/open-source-compliance.test.js
node --test tests/accounting.test.js
```

