# JiraSnap TODO

## High Priority

- [x] Add tiny unit tests for Jira error parsing and parent-error detection logic.
- [x] Confirm required Jira field `capitalizable` mapping from `tnt-tools-hub/tnt-forms`.
- [x] Implement `capitalizable = Yes` in Jira create payload using the exact field ID/value shape from `tnt-forms`.
- [ ] Add fallback/error handling if `capitalizable` mapping is missing or rejected by Jira.
- [ ] Validate end-to-end issue creation in Chewy Jira with:
  - [x] configured parent epic (validated via TNT-1901)
  - [x] no parent epic (validated via TNT-1903)
  - [x] invalid parent epic (validated via TNT-1902 fallback)

## Medium Priority

- [ ] Add a small helper module for Jira field mappings (custom fields) to keep payload construction clean.
- [ ] Add integration-style payload tests (shape-only, no live Jira call).
- [ ] Improve user-facing error messages for custom field failures (include field name + action).
- [ ] Add command to run a quick Jira configuration self-check (base URL, auth, project, optional parent).

## Docs

- [x] Document `capitalizable` requirement and mapping details in README.
- [x] Add troubleshooting section for common Jira create failures (auth, permission, project key, custom field mapping).
- [x] Add a short "How to validate in a real Jira project" checklist.

## Polish

- [ ] Add demo recording showing capture flow and Open Captures flow.
- [ ] Add changelog notes for parent fallback + friendly error handling + status bar button.
