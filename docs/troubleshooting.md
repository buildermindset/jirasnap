# JiraSnap Troubleshooting

This page captures known issues hit during development and publishing, plus quick fixes.

## Jira API Issues

### Authentication failed

Symptoms:

- JiraSnap shows auth failure
- Jira API returns 401

Checks:

- Verify `jirasnap.email`
- Verify `jirasnap.apiToken`
- Confirm token is generated from Atlassian API token page

### Permission denied

Symptoms:

- Jira API returns 403

Checks:

- Account can create issues in target project
- Project key in settings is valid and visible to that account

### Description format error

Symptoms:

- Jira rejects description payload

Fix:

- Jira Cloud requires ADF document format
- Use latest packaged JiraSnap version (ADF is already implemented)

### Capture shortcut triggers wrong command

Symptoms:

- Pressing `cmd+shift+j` shows `Invalid JSON, please check manually`
- JiraSnap title/note prompts do not appear

Root cause:

- Shortcut conflict with another extension or built-in command

Fix:

- Verify JiraSnap itself works from Command Palette: `JiraSnap: Capture Task`
- Open Keyboard Shortcuts and search `cmd+shift+j`
- Keep only `JiraSnap: Capture Task` bound to that key
- Remove conflicting bindings, commonly:
  - `json.shortcut`
  - `workbench.action.search.toggleQueryDetails`

### Parent epic rejected

Symptoms:

- Jira returns hierarchy or parent validation errors

Fix:

- Confirm `jirasnap.defaultEpicKey`
- JiraSnap retries creation without parent when parent assignment is invalid

### Custom field errors (capitalizable)

Symptoms:

- Jira rejects custom field payload

Checks:

- Confirm `jirasnap.capitalizableFieldId` matches your Jira instance
- Confirm option value exists (default `Yes`)

### Invalid custom fields JSON

Symptoms:

- JiraSnap shows `jirasnap.customFieldsJson is invalid JSON`

Fix:

- Set `jirasnap.customFieldsJson` to a valid JSON object string
- Example: `{"customfield_11302":{"value":"Yes"},"customfield_12345":"ABC"}`

### How to discover required Jira fields for your account

Symptoms:

- Jira issue creation fails even though auth and project key are correct
- Jira error mentions missing required field, invalid option, or customfield id

Fix:

1. In Jira web, create the same issue type manually in the same project.
2. Record fields marked required (`*`).
3. Use browser DevTools Network tab during manual issue create to inspect the request body and capture exact field keys and value shapes.
4. Add those fields to `jirasnap.customFieldsJson`.

Example:

```json
{
  "customfield_11302": { "value": "Yes" },
  "customfield_12345": "ABC"
}
```

Common mappings:

- Text: `"customfield_12345": "Some text"`
- Single select: `"customfield_12345": { "value": "Option Name" }`
- Multi select: `"customfield_12345": [{ "value": "Option A" }, { "value": "Option B" }]`
- User picker: `"customfield_12345": { "accountId": "<jira-account-id>" }`
- Number: `"customfield_12345": 5`

## Marketplace Publishing Issues

### Publisher mismatch on upload

Symptoms:

- Error says manifest publisher must match target publisher

Fix:

- `package.json` `publisher` must exactly match Marketplace publisher ID
- Rebuild VSIX after changing `publisher`

### PAT verification fails with access denied

Symptoms:

- `vsce login` returns access denied on resource `/<publisher>`

Root cause:

- PAT/account does not own that publisher

Fix:

- Sign in with the account that owns the publisher
- Create PAT from that same account
- Re-run `vsce login <publisherId>`

### Account split (work vs personal)

Symptoms:

- Extension exists under one account, PAT from another account fails

Fix:

- Confirm active account in Marketplace and Azure DevOps
- Publish under the account-owned publisher
- If needed, create a new publisher under the correct account and update manifest

### Token page confusion

Known working PAT URL in this project:

- https://dev.azure.com/johnsontroye1/_usersSettings/tokens

## Packaging and Asset Issues

### Icon not found in VSIX

Symptoms:

- VSCE reports icon file not found

Fix:

- Ensure `images/icon.png` exists
- Run `npm run assets` to regenerate PNGs from SVG sources

### Oversized package due to source images

Fix:

- Keep source SVG in repo for maintainability
- Exclude source SVG and image notes from VSIX via `.vscodeignore`

## Fallback Publish Path

If CLI auth keeps failing:

1. Open publisher page in Marketplace.
2. Choose **New extension**.
3. Upload `jirasnap-<version>.vsix`.
4. Publish from the web UI.

## Add New Gotchas

When adding a new issue to this page, include:

- Symptom/error text
- Root cause
- Exact fix steps
- Whether the fix is account-specific or general
