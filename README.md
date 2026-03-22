# JiraSnap

Create Jira tasks from VS Code in seconds.

![JiraSnap banner](images/banner.png)

JiraSnap is a focused capture extension: minimal prompts, automatic context, and reliable issue creation even when parent assignment fails.

## Features

- Fast command-driven capture from inside the editor
- Optional parent epic assignment
- Automatic fallback to unparented task if parent is invalid
- Automatic label (`jirasnap`)
- Optional quick note + captured context
  - repo
  - branch
  - file path
  - selected line range
  - timestamp
- Open captures view using configurable JQL
- Status bar shortcut for quick access

## Commands

- `JiraSnap: Capture Task`
- `JiraSnap: Open Captures`

Default keybinding:

- macOS: `cmd+shift+j`

## Requirements

- Jira Cloud base URL
- Jira account email
- Jira API token
- Jira project key

Create an Atlassian API token at:

- https://id.atlassian.com/manage-profile/security/api-tokens

## Extension Settings

Required settings:

- `jirasnap.baseUrl`
- `jirasnap.email`
- `jirasnap.apiToken`
- `jirasnap.projectKey`

Optional settings:

- `jirasnap.defaultEpicKey`
  - accepts issue key (example: `TNT-1900`) or full browse URL
- `jirasnap.capturesJql`
  - default: `labels = jirasnap ORDER BY created DESC`
- `jirasnap.showStatusBarOpenCaptures`
  - default: `true`
- `jirasnap.capitalizableFieldId`
  - default: `customfield_11302`
- `jirasnap.capitalizableValue`
  - default: `Yes`

## How It Works

1. Run `JiraSnap: Capture Task`.
2. Enter title and optional quick note.
3. JiraSnap builds Jira ADF description with captured context.
4. JiraSnap attempts to create task with parent if configured.
5. If parent is rejected, JiraSnap retries without parent.
6. JiraSnap returns a clickable issue link.

## Installation

### Install from VSIX (local)

1. In VS Code Extensions view, open `...` menu.
2. Select `Install from VSIX...`.
3. Choose `jirasnap-0.0.1.vsix`.

### Development install

1. Clone repository.
2. Run `npm install`.
3. Press `F5` to launch Extension Development Host.

## Usage Example

1. Set required settings.
2. Run `JiraSnap: Capture Task`.
3. Enter:
   - Title: `Fix missing cache invalidation on product update`
   - Quick note: `Observed while testing update endpoint`
4. JiraSnap creates the task and offers `Open Issue`.

## Troubleshooting

- `Authentication failed`
  - verify `jirasnap.email` and `jirasnap.apiToken`
- `Permission denied`
  - your Jira account cannot create issues in that project
- `Project key not found` or project create failure
  - verify `jirasnap.projectKey`
- Parent/epic errors
  - clear or correct `jirasnap.defaultEpicKey`; JiraSnap can create without parent
- Jira custom field errors
  - confirm `jirasnap.capitalizableFieldId` and option value for your Jira instance
- Description format errors
  - JiraSnap sends ADF automatically; if this appears again, validate against the latest packaged version

## Validation

- `npm run lint`
- `npm run build`
- `npm test`
- `npm run smoke` (live Jira call, requires credentials in env)

Smoke environment variables:

- `JIRASNAP_BASE_URL`
- `JIRASNAP_PROJECT_KEY`
- `JIRASNAP_PARENT_KEY`
- `JIRASNAP_SKIP_PARENT=1`
- `JIRASNAP_EMAIL` / `JIRASNAP_API_TOKEN` (or `JIRA_EMAIL` / `JIRA_API_TOKEN`)

## Real Jira Validation Checklist

Use this before publishing or after major changes:

1. Create a task with a valid parent epic.
2. Create a task with no parent configured.
3. Create a task with an invalid parent and confirm fallback succeeds.
4. Open captures from the status bar or `JiraSnap: Open Captures`.
5. Verify created issue includes:

- label `jirasnap`
- capitalizable field set to `Yes`
- captured description context

## Project Docs

- Build and implementation checklist: [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md)
- Working task list: [docs/todo.md](docs/todo.md)
- Release notes: [CHANGELOG.md](CHANGELOG.md)
- Publishing steps: [PUBLISHING.md](PUBLISHING.md)

## License

MIT. See [LICENSE](LICENSE).
