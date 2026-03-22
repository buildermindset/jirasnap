import * as vscode from 'vscode';
import { getSettings, validateSettings } from './config';
import { buildCaptureContext, buildDescription } from './context';
import { createTaskIssue } from './jira/client';

export function activate(context: vscode.ExtensionContext): void {
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
  context.subscriptions.push(openCaptures);
  context.subscriptions.push(configChange);
  context.subscriptions.push(capturesButton);
}

export function deactivate(): void {
  // No-op.
}
