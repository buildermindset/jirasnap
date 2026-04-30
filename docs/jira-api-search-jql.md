# Jira Cloud API: Search Issues with JQL (POST)

## How to search Jira issues using JQL via API (with curl)

1. **Use the /rest/api/3/search/jql endpoint with POST.**
2. **Pass your JQL in the JSON body as the `jql` property.**
3. **Authenticate with your Jira email and API token.**

---

### Example curl command

```
curl -u "tjohnso112@chewy.com:YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST \
  --data '{"jql": "project = TNT AND assignee = currentUser() AND updated >= -4w", "fields": ["key", "summary"]}' \
  "https://chewyinc.atlassian.net/rest/api/3/search/jql"
```

- Replace `YOUR_API_TOKEN` with your Jira API token.
- You can adjust the JQL and fields as needed.

---

### Notes

- GET requests to this endpoint are often rejected as "unbounded" even if your JQL is correct. Always use POST.
- You can add more fields to the `fields` array to get more data per issue.
- This works for any JQL you would use in the Jira UI, as long as it is properly bounded (e.g., by project, assignee, or date).

---

**Reference:**

- [Jira Cloud REST API docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-jql-post)
- [Jira API tokens](https://id.atlassian.com/manage-profile/security/api-tokens)

---

_Last updated: 2026-04-29_
