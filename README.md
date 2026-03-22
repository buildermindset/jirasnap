# Instant Jira Capture for VS Code

## Executive Summary

Modern software development suffers from a consistent behavioral gap: engineers frequently discover bugs or enhancements while coding but defer creating Jira tickets due to workflow friction. This results in lost work, poor tracking, and inconsistent documentation.

This project proposes a VS Code extension that enables developers to create Jira tickets instantly, without leaving their coding context. The goal is to reduce friction to near zero, allowing ticket creation in under 10 seconds.

Unlike the existing Atlassian VS Code extension, which acts as a full Jira client requiring navigation and form completion, this tool focuses on rapid capture. It prioritizes speed, minimal input, and preservation of developer flow.

## Problem Statement

Engineers often:
- Discover work mid-development
- Avoid switching context to Jira
- Delay or forget to create tickets

The root issue is not time, but cognitive interruption and workflow friction.

## Solution Overview

A lightweight VS Code extension that:
- Triggers via keyboard shortcut or command palette
- Captures minimal input (title, optional type)
- Auto-fills context (file, branch, repo)
- Creates a Jira ticket instantly
- Returns a clickable link

## Key Differentiation

| Feature | Atlassian Extension | This Tool |
|--------|--------------------|-----------|
| Purpose | Full Jira client | Rapid capture tool |
| Interaction | Sidebar navigation | Inline shortcut |
| Input required | Multiple fields | Minimal |
| Workflow impact | Interruptive | Flow-preserving |

## Architecture

### Components

1. VS Code Extension (TypeScript)
   - UI triggers
   - Context capture
   - User prompts

2. MCP Server (optional but recommended)
   - Handles Jira API calls
   - Applies defaults and mappings

3. Jira API / Atlassian MCP
   - Ticket creation and updates

### Flow

1. User triggers command
2. Extension captures context
3. User enters title
4. Extension calls MCP or Jira API
5. Ticket is created
6. Link is returned to user

## MVP Features

- Command + keyboard shortcut
- Title input
- Jira ticket creation
- Link display

## Future Enhancements

- Create from code selection
- TODO parsing
- Git integration
- Status synchronization

## Configuration

JiraSnap is designed to be generic and company-agnostic. Configure it for your environment:

```json
{
  "jirasnap.baseUrl": "https://your-org.atlassian.net",
  "jirasnap.projectKey": "YOUR_PROJECT",
  "jirasnap.authType": "token"
}
```

All company-specific settings stay in your local config — never in the repo.

## Why This Matters

This tool aligns with how developers actually work. It reduces friction, preserves flow, and increases compliance with tracking practices.

## Conclusion

This is not a replacement for Jira tools, but a complementary layer focused on speed and usability. It solves a real problem with a focused, opinionated approach and represents a strong portfolio project demonstrating developer experience optimization.
