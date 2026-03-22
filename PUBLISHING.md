# Publishing JiraSnap

## Prerequisites

- VS Code Marketplace publisher created: `TroyJohnson`
- Personal Access Token with Marketplace publish/manage scope
- Repository version updated in `package.json`

## One-time setup

1. Log in to the VS Code Marketplace publisher:

```bash
npx @vscode/vsce login TroyJohnson
```

2. Paste your Marketplace Personal Access Token when prompted.

## Pre-publish checks

Run all validation locally before publishing:

```bash
npm run lint
npm run build
npm test
```

Optional live Jira validation:

```bash
npm run smoke
```

## Package locally

Build an installable VSIX:

```bash
npm run package:vsix
```

This creates:

- `jirasnap-<version>.vsix`

## Publish to Marketplace

Publish the current version from `package.json`:

```bash
npx @vscode/vsce publish
```

If you want VSCE to bump versions automatically:

```bash
npx @vscode/vsce publish patch
npx @vscode/vsce publish minor
npx @vscode/vsce publish major
```

## Recommended release flow

1. Update `CHANGELOG.md`
2. Confirm `README.md` reflects current behavior
3. Run lint/build/tests
4. Run smoke test if Jira credentials are available
5. Build VSIX locally
6. Publish

## Common publish issues

- `publisher does not exist`
  - `publisher` in `package.json` must exactly match your Marketplace publisher ID
- image or README packaging errors
  - use PNG for extension icon and README images
- PAT login failures
  - create a new PAT with Marketplace permissions and run `vsce login` again
