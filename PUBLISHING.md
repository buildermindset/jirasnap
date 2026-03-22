# Publishing JiraSnap

## Prerequisites

- VS Code Marketplace publisher exists and is owned by the active account (current: `troyjohnson-devtools`)
- Marketplace PAT with publish/manage permission
- Target version already set in `package.json`

## Release Flow (Verified)

The following sequence has been run successfully in this repo:

```bash
npm version 0.0.4 --no-git-tag-version
npm run lint
npm test
npm run package:vsix
```

Expected artifact:

- `jirasnap-0.0.4.vsix` (or `jirasnap-<version>.vsix` for future releases)

## Publish to Marketplace

Option A: publish with interactive PAT prompt:

```bash
npx @vscode/vsce publish
```

If no stored auth is available, VSCE prompts for a PAT in terminal.

Option B: publish non-interactively with environment variable:

```bash
export VSCE_PAT="<your-pat>"
npx @vscode/vsce publish
```

Option C: one-shot publish command:

```bash
npx @vscode/vsce publish --pat "<your-pat>"
```

## Verify Published Version

```bash
npx @vscode/vsce show troyjohnson-devtools.jirasnap
```

Use this to confirm the Marketplace version moved to the expected release (for example `0.0.4`).

## Recommended End-to-End Steps

1. Update `CHANGELOG.md`.
2. Ensure `README.md` install and usage instructions match behavior.
3. Bump version (`npm version <x.y.z> --no-git-tag-version`).
4. Run `npm run lint`.
5. Run `npm test`.
6. Run `npm run package:vsix`.
7. Publish with `vsce` (PAT required).
8. Verify with `vsce show`.
9. Commit version/docs updates and push.

## Common Publish Issues

- `Access Denied ... on resource /<publisher>`
  - PAT account does not own the publisher. Re-auth with the correct account.
- VSCE prompts for PAT and appears blocked
  - This is expected when `VSCE_PAT` is not set and no cached login exists.
- `publisher does not exist`
  - `publisher` in `package.json` must exactly match Marketplace publisher ID.
- packaging/asset errors
  - regenerate assets with `npm run assets` and keep packaged image paths valid.

## Web Upload Fallback

If CLI auth is blocked, publish through the Marketplace UI:

1. Open your publisher page.
2. Choose **New extension**.
3. Upload `jirasnap-<version>.vsix`.
4. Complete publish in web flow.
