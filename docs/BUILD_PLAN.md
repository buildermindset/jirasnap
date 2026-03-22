# JiraSnap Build Plan

## Goal

Build a VS Code extension that captures Jira tasks in seconds while coding.

Non-goals for now:

- No hierarchy inference
- No branch parsing
- No story/sub-task automation
- No smart routing

## Product Rules (V1)

1. Never block creation on missing optional context.
2. Create a Jira Task with optional configured epic parent.
3. Always add label: `jirasnap`.
4. Return a clickable Jira issue link after creation.
5. If parent is missing or invalid, retry and create without parent.

## Ticket Shape (V1.1)

Title: entered by user
Type: Task
Epic: optional (for example `TNT-1900`)
Labels: `jirasnap`
Description:

```text
[Quick note]
<optional user comment>

[Captured context]
Repo: <repo or none>
Branch: <branch or none>
File: <path or none>
Lines: <start>-<end> or none selected
Captured at: <ISO timestamp>
```

## Work Plan

### Phase 0 - Project Scaffold

- [x] Initialize VS Code extension project (TypeScript)
- [x] Add npm scripts: build, watch, lint, test
- [x] Add basic extension command registration

Acceptance:

- [ ] Extension loads in Extension Development Host
- [x] Placeholder command runs without error

### Phase 1 - Jira Create (Core MVP)

- [x] Add settings
  - [x] `jirasnap.baseUrl`
  - [x] `jirasnap.email`
  - [x] `jirasnap.apiToken`
  - [x] `jirasnap.projectKey`
  - [x] `jirasnap.defaultEpicKey` (optional, issue key or browse URL)
- [x] Add command `JiraSnap: Capture Task`
- [x] Prompt for title
- [x] Call Jira REST API to create Task
- [x] Attach epic when configured + always add label `jirasnap`
- [x] Show success notification with issue key and URL

Acceptance:

- [ ] From shortcut to created issue in <10 seconds after initial setup
- [ ] New issue appears in Jira with expected parent behavior and label

### Phase 2 - Optional Comment + Context

- [x] Prompt for optional quick note (can be blank)
- [x] Read workspace repo name
- [x] Read git branch (best effort)
- [x] Read active editor file path
- [x] Read selected line range (if any)
- [x] Append context block to Jira description

Acceptance:

- [ ] Tickets include context when available
- [ ] Missing context does not fail ticket creation

### Phase 3 - UX Polish

- [x] Add keyboard shortcut
- [ ] Improve error messages (missing settings/auth failures)
- [x] Add command `JiraSnap: Open Captures in Jira`
- [x] Open filter URL for easy retrieval

Acceptance:

- [ ] User can find all captures quickly via label or epic query

## Retrieval Query

Use one saved filter in Jira:

```jql
labels = jirasnap ORDER BY created DESC
```

Optional epic-centric query:

```jql
"Epic Link" = TNT-1900 ORDER BY created DESC
```

## Implementation Notes

- Use Jira Cloud REST API v3.
- Auth: Basic with email + API token.
- Prefer direct API first (no MCP server required for MVP).
- Keep API client small and isolated (`src/jira/client.ts`).

## Definition of Done

- [ ] Command creates Jira Task reliably
- [ ] Label is always set
- [ ] Parent is applied when valid, and gracefully skipped when missing/invalid
- [ ] Optional note and context are appended
- [ ] Success notification includes issue URL
- [ ] README includes setup and usage steps
- [ ] Demo GIF or short screen recording added

## Start Here (Now)

1. Launch Extension Development Host and run `JiraSnap: Capture Task`.
2. Fill required settings (`baseUrl`, `email`, `apiToken`, `projectKey`).
3. Create one test ticket and confirm epic/label/description format.
4. Add `JiraSnap: Open Captures in Jira` command.
5. Add README setup steps and a short demo recording.

## Backlog (Later)

- [ ] Multi-project support
- [ ] Configurable default labels
- [ ] Bulk capture queue
- [ ] Better formatting for code selection excerpts
