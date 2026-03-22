# JiraSnap Combined TODO

Only open work is listed below.

## P0 - Post-Verification Release Tasks

- [ ] Replace README Marketplace placeholders with the final public listing URL.
- [ ] Confirm live listing visuals (icon, banner, README rendering) on Marketplace.
- [ ] Add a short demo recording (capture flow + Open Captures flow).

## P1 - Phase 2 Product Enhancements

- [ ] Meet UX target: from shortcut to created issue in under 10 seconds after setup.
- [ ] Add a `JiraSnap: Run Configuration Check` command.
  - Verify base URL reachability.
  - Verify auth (`/myself`).
  - Verify project key access.
  - Validate optional parent epic key if configured.
- [ ] Add stronger custom-field handling for `capitalizable`.
  - Detect field-not-found vs value-not-allowed failures.
  - Retry without custom field when explicitly configured to allow fallback.
  - Show actionable error with exact field id/value.
- [ ] Add optional code-selection snippet capture in description.
  - Bounded length with truncation notice.
  - Respect empty selection and never block issue creation.
- [ ] Add optional issue type setting for capture (`Task` default; allow `Bug`/`Story`).
- [ ] Add optional extra label setting (`jirasnap` always retained).

## P1 - Reliability and Testing

- [ ] Add integration-style tests for request payload shapes (with parent, without parent, custom field variants).
- [ ] Add tests for friendly error mapping for common Jira create failures.
- [ ] Add tests for issue-key parsing from browse URLs and invalid inputs.

## P2 - Code Quality and Maintainability

- [ ] Extract Jira field construction into a helper module (custom fields + parent + labels).
- [ ] Remove redundant `onCommand:*` activation events and rely on contributed commands activation.
- [ ] Add a small release helper script to run: lint + build + test + package in one command.

## P2 - Docs and Workflow

- [ ] Keep `docs/troubleshooting.md` updated with new Jira/Marketplace gotchas.
- [ ] Add a concise release checklist to `PUBLISHING.md` (account check, publisher check, version check, package, publish).
- [ ] Decide whether to archive or remove `docs/BUILD_PLAN.md` now that active work is tracked in this file.

## P3 - Future Enhancements (Migrated From BUILD_PLAN)

- [ ] Add multi-project support.
- [ ] Add bulk capture queue mode.
