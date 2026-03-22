# Changelog

## 0.0.4

- Bumped extension version to `0.0.4` for Marketplace release.
- Re-validated release gates: `npm run lint`, `npm test`, and `npm run package:vsix`.
- Confirmed packaged artifact `jirasnap-0.0.4.vsix` is generated successfully.
- Updated publishing documentation with the exact PAT/auth flow observed during publish.
- Updated README installation wording and VSIX example version.

## 0.0.3

- Added Marketplace badge and listing placeholders to README.
- Consolidated open TODO items into a single combined list.
- Added troubleshooting guide for Jira and Marketplace publish gotchas.
- Updated publishing docs for the current publisher and web-upload fallback.
- Cleaned image packaging by excluding source SVG files from VSIX output.

## 0.0.2

- Refined Marketplace and README assets, including regenerated banner and icon source files.
- Added publishing documentation and packaging metadata for GitHub and Marketplace release flow.
- Finalized the initial public release structure with tests, smoke validation, and extension scaffolding.

## 0.0.1

- Added Jira task capture command in VS Code.
- Added optional parent epic assignment with safe fallback when invalid.
- Added required Chewy capitalizable field mapping (`customfield_11302` => `Yes`).
- Added contextual ticket description capture (repo, branch, file, lines, timestamp).
- Added Open Captures command and status bar shortcut.
- Added friendly Jira error messages for auth, permission, and config failures.
- Added ADF description formatting for Jira Cloud compatibility.
- Added unit tests for Jira parsing, parent detection, and ADF conversion.
- Added live smoke validation script and npm smoke command.
