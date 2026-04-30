import * as vscode from 'vscode';
import { getSettings, validateSettings } from './config';
import { buildCaptureContext, buildDescription } from './context';
import { createTaskIssue, logWorkToIssue } from './jira/client';

export function activate(context: vscode.ExtensionContext): void {
    // Register the new jira:snap-hours command
    const snapHours = vscode.commands.registerCommand('jirasnap.snapHours', async () => {
      // 1. Validate settings
      const settings = getSettings();
      const missing = validateSettings(settings);
      if (missing.length > 0) {
        const action = 'Open Settings';
        const message = `JiraSnap is missing required settings: ${missing.join(', ')}`;
        const choice = await vscode.window.showErrorMessage(message, action);
        if (choice === action) {
          await vscode.commands.executeCommand('workbench.action.openSettings', 'jirasnap');
        }
        return;
      }

      // 2. Fetch user's Jira stories (issues assigned to them), using configurable JQL
      let issues: { key: string; summary: string }[] = [];
      try {
        const baseUrl = settings.baseUrl.replace(/\/$/, '');
        const authToken = Buffer.from(`${settings.email}:${settings.apiToken}`).toString('base64');
        // Use configurable JQL for hours logging
        const jql = settings.hoursJql || 'assignee = currentUser() AND resolution = Unresolved ORDER BY updated DESC';
        const url = `${baseUrl}/rest/api/3/search/jql`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Basic ${authToken}`,
          },
          body: JSON.stringify({ jql, fields: ["key", "summary"], maxResults: 20 }),
        });
        if (!response.ok) {
          throw new Error(`Jira API error (${response.status}) fetching issues.`);
        }
        type JiraIssueRaw = { key: string; fields?: { summary?: string } };
        const data = (await response.json()) as { issues?: JiraIssueRaw[] };
        issues = (data.issues || []).map((issue: JiraIssueRaw) => ({
          key: issue.key,
          summary: (issue.fields && typeof issue.fields.summary === 'string') ? issue.fields.summary : '(No summary)',
        }));
      } catch (err) {
        vscode.window.showErrorMessage('Failed to fetch Jira issues: ' + (err instanceof Error ? err.message : String(err)));
        return;
      }

      if (!issues.length) {
        vscode.window.showInformationMessage('No Jira stories assigned to you.');
        return;
      }

      // 3. Show dropdown (QuickPick) of issues
      const pick = await vscode.window.showQuickPick(
        issues.map((i) => ({
          label: `${i.key}: ${i.summary}`,
          description: i.key,
          issue: i,
        })),
        {
          placeHolder: 'Select a Jira story to log hours',
          ignoreFocusOut: true,
        }
      );
      if (!pick) return;

      // 4. Prompt for hours input with format instructions
      const timeSpent = await vscode.window.showInputBox({
        prompt: 'Enter time spent (e.g. 2w 4d 6h 45m)',
        placeHolder: 'Use the format: 2w 4d 6h 45m',
        ignoreFocusOut: true,
        validateInput: (value: string) => value.trim() ? null : 'Time spent is required',
      });
      if (!timeSpent) return;

      // 5. Save hours to Jira via API
      try {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: `Logging work to ${pick.issue.key}...`,
            cancellable: false,
          },
          async () => {
            await logWorkToIssue(settings, pick.issue.key, timeSpent);
          }
        );
        vscode.window.showInformationMessage(`Logged ${timeSpent} to ${pick.issue.key}`);
      } catch (err) {
        vscode.window.showErrorMessage('Failed to log work: ' + (err instanceof Error ? err.message : String(err)));
      }
    });

  const capturesButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  capturesButton.command = 'jirasnap.openCaptures';
  capturesButton.text = '$(list-selection) JiraSnap';
  capturesButton.tooltip = 'Open JiraSnap Captures';

  const refreshCapturesButton = (): void => {
    const settings = getSettings();
    if (settings.showStatusBarOpenCaptures) {
      capturesButton.show();
    } else {
      capturesButton.hide();
    }
  };

  refreshCapturesButton();

  const captureTask = vscode.commands.registerCommand('jirasnap.captureTask', async () => {
    const settings = getSettings();
    const missing = validateSettings(settings);

    if (missing.length > 0) {
      const action = 'Open Settings';
      const message = `JiraSnap is missing required settings: ${missing.join(', ')}`;
      const choice = await vscode.window.showErrorMessage(message, action);
      if (choice === action) {
        await vscode.commands.executeCommand('workbench.action.openSettings', 'jirasnap');
      }
      return;
    }

    const summary = await vscode.window.showInputBox({
      prompt: 'Jira task title',
      ignoreFocusOut: true,
      validateInput: (value: string) => (value.trim() ? null : 'Title is required'),
    });

    if (!summary || !summary.trim()) {
      return;
    }

    const note = (await vscode.window.showInputBox({
      prompt: 'Quick note (optional)',
      ignoreFocusOut: true,
      placeHolder: 'Add extra details for future triage',
    })) ?? '';

    try {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'JiraSnap creating task...',
          cancellable: false,
        },
        async () => {
          const captureContext = await buildCaptureContext();
          const description = buildDescription(note, captureContext);

          const result = await createTaskIssue(settings, summary.trim(), description);

          const openAction = 'Open Issue';
          const message = `Created ${result.key} in Jira.`;
          const selection = await vscode.window.showInformationMessage(message, openAction);
          if (selection === openAction) {
            await vscode.env.openExternal(vscode.Uri.parse(result.browseUrl));
          }
        }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error while creating Jira task.';
      vscode.window.showErrorMessage(`JiraSnap failed: ${message}`);
    }
  });

  const openCaptures = vscode.commands.registerCommand('jirasnap.openCaptures', async () => {
    const settings = getSettings();

    if (!settings.baseUrl) {
      const action = 'Open Settings';
      const choice = await vscode.window.showErrorMessage('JiraSnap is missing required setting: jirasnap.baseUrl', action);
      if (choice === action) {
        await vscode.commands.executeCommand('workbench.action.openSettings', 'jirasnap.baseUrl');
      }
      return;
    }

    const baseUrl = settings.baseUrl.replace(/\/$/, '');
    const jql = settings.capturesJql || 'labels = jirasnap ORDER BY created DESC';
    const capturesUrl = `${baseUrl}/issues/?jql=${encodeURIComponent(jql)}`;

    await vscode.env.openExternal(vscode.Uri.parse(capturesUrl));
  });

  const configChange = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('jirasnap.showStatusBarOpenCaptures')) {
      refreshCapturesButton();
    }
  });

  context.subscriptions.push(captureTask);
    context.subscriptions.push(snapHours);
  context.subscriptions.push(openCaptures);
  context.subscriptions.push(configChange);
  context.subscriptions.push(capturesButton);
}

export function deactivate(): void {
  // No-op.
}
