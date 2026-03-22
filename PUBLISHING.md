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
   - **Expiration**: **1 year** (recommended — avoids repeating this step frequently)
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

## Step 5 — Log in and publish

**First time (or after token expiry):** store the PAT in your macOS Keychain so you never have to pass it again:

```bash
npx @vscode/vsce login troyjohnson-devtools
# paste token when prompted
```

A successful login prints nothing alarming and exits 0. If it prints an error, see Common Issues below.

**Every time:** publish using the stored login:

```bash
npx @vscode/vsce publish
```

VSCE will re-package, upload, and print:

```
 DONE  Published troyjohnson-devtools.jirasnap v<version>.
```

If `DONE` appears, the publish succeeded regardless of what `vsce show` says next (see Step 6).

---

## Step 6 — Verify the published version

```bash
npx @vscode/vsce show troyjohnson-devtools.jirasnap
```

Confirm `Version` in the output matches the version you just published.

> **Note:** `vsce show` may still display the old version for 5–10 minutes after
> a successful publish. This is normal Marketplace CDN propagation. If `vsce publish`
> printed `DONE Published ... v<version>`, the publish succeeded. Wait a few minutes
> and re-run `vsce show` to confirm.

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

### Access Denied on resource `/troyjohnson-devtools` — or null UUID error

Exact error text seen during 0.0.4 release:

```
ERROR  The Personal Access Token verification has failed. Additional information:
TF400813: The user 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' is not authorized to access this resource.
```

The `aaaaaaaa` UUID means Azure DevOps could not resolve the account — the PAT was created from a different Microsoft account than the one that owns `troyjohnson-devtools`.

Fix:

1. Open https://dev.azure.com/johnsontroye1/_usersSettings/tokens in an incognito/private window.
2. Sign in when prompted — verify the account shown is `johnsontroye1`, not a work account.
3. Create the PAT there and retry `vsce login troyjohnson-devtools`.

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
