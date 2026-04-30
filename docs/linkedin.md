# LinkedIn Post

---

## v0.1.0 — Hours, in two clicks (current)

Every developer I know has said it: "I'll make a Jira ticket for that later." And every developer I know has lost work because of it — not because the idea wasn't worth capturing, but because opening Jira mid-flow costs just enough mental effort to make it easy to put off. So I stopped putting it off in the usual way and started putting it off in a completely different way: I built a VS Code extension instead of fixing the habit.

The extension is called **JiraSnap**, and it now does two things — both in seconds, both without leaving the editor:

1. **Capture a Jira ticket** — `Cmd+Shift+J`, type a title, done. The description auto-fills with your repo, branch, file, and selected lines.
2. **Log work hours** — `Cmd+Shift+P → JiraSnap: Hours`, pick the story from a dropdown filtered to *only the work that matters to you*, type "1h 30m", done. Worklog posts to Jira instantly.

The new Hours command was the obvious next move. Capturing tickets without leaving the editor only goes so far if you still have to context-switch every time you log time at end of day. Two clicks. No tab. No browser. No "I'll do my hours tomorrow."

Filter the dropdown with any JQL — mine shows only Capitalizable TNT stories that are In Progress or Blocked. If you don't want to write JQL by hand, Atlassian's Rovo AI will write it for you in plain English.

Available now in the VS Code Marketplace. I wrote up the full story — what I built, why I built it, and why "the friction was the real problem" — link in the comments.

---

## v0.0.x — Capture only (original)

Every developer I know has said it: "I'll make a Jira ticket for that later." And every developer I know has lost work because of it — not because the idea wasn't worth capturing, but because opening Jira mid-flow costs just enough mental effort to make it easy to put off. So I stopped putting it off in the usual way and started putting it off in a completely different way: I built a VS Code extension instead of fixing the habit. The extension is called JiraSnap, it captures a Jira task in seconds without leaving your editor, and I wrote about why I built it, what it actually does, and why "the friction was the real problem" in my latest article — link in the comments.
