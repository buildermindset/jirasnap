# Publishing JiraSnap

Publisher: `troyjohnson-devtools`
Extension ID: `troyjohnson-devtools.jirasnap`

---

## Step 1 — Create a Marketplace PAT

You need a fresh PAT every time the old one expires.

1. Go to: https://dev.azure.com/johnsontroye1/_usersSettings/tokens
   - Use this URL specifically. The generic `app.vssps.visualstudio.com` token page may not work for this account.
2. Click **New Token**.
3. Fill in:
   - **Name**: anything descriptive, e.g. `vsce-publish-jirasnap`
   - **Organization**: `All accessible organizations`
   - **Expiration**: your choice (90 days is a reasonable default)
   - **Scopes**: choose **Custom defined**, then under **Marketplace** check **Manage**
4. Click **Create**.
5. Copy the token value immediately. It will not be shown again.

> Account note: The `troyjohnson-devtools` publisher belongs to the account signed in
> at `johnsontroye1`. If you sign into Azure DevOps with a different account (work vs
> personal), the PAT will fail with access denied on the publisher resource.

---

## Step 2 — Bump version

```bash
npm version 0.0.5 --no-git-tag-version
```

Replace `0.0.5` with the actual next version. This updates `package.json` only — no git tag is created.

---

## Step 3 — Update CHANGELOG.md

Add a section at the top of [CHANGELOG.md](CHANGELOG.md) describing what changed:

```
## 0.0.5

- Brief description of what changed.
```

---

## Step 4 — Run release checks

```bash
npm run lint
npm test
npm run package:vsix
```

All three must succeed. The last command produces `jirasnap-<version>.vsix`.

---

## Step 5 — Publish to Marketplace

Set your PAT and publish:

```bash
export VSCE_PAT="<paste-your-token-here>"
npx @vscode/vsce publish
```

VSCE will:

1. Re-package the extension.
2. Upload to the Marketplace under `troyjohnson-devtools`.
3. Print a success message with the published version.

If you prefer a one-liner without exporting:

```bash
npx @vscode/vsce publish --pat "<paste-your-token-here>"
```

---

## Step 6 — Verify the published version

```bash
npx @vscode/vsce show troyjohnson-devtools.jirasnap
```

Confirm `Version` in the output matches the version you just published.

---

## Step 7 — Commit and push release

```bash
git commit -am "chore(release): bump to <version>"
git push origin main
```

---

## Common Issues

### VSCE prompts for PAT and appears to hang

- This happens when `VSCE_PAT` is not set and no cached login exists.
- Set `VSCE_PAT` via export before running publish (Step 5 above).

### Access Denied on resource `/troyjohnson-devtools`

- The PAT you used was created from the wrong Microsoft account.
- Sign into Azure DevOps at https://dev.azure.com/johnsontroye1 and create the token there.

### `publisher does not exist`

- `publisher` in `package.json` must exactly match the Marketplace publisher ID (`troyjohnson-devtools`).

### Packaging/asset errors

- Run `npm run assets` to regenerate PNG images from SVG sources.
- Ensure `images/icon.png` and `images/banner.png` exist before packaging.

---

## Web Upload Fallback

If CLI auth keeps failing, use the web UI instead:

1. Open: https://marketplace.visualstudio.com/manage/publishers/troyjohnson-devtools
2. Click **New extension**.
3. Upload `jirasnap-<version>.vsix`.
4. Complete the publish flow in the browser.
5. Verify the version is live with `npx @vscode/vsce show troyjohnson-devtools.jirasnap`.
