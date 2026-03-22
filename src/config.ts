import * as vscode from 'vscode';
import { JiraSnapSettings } from './types';

function parseIssueKeyFromInput(raw: string): string {
  const value = raw.trim();
  if (!value) {
    return '';
  }

  const browseMatch = value.match(/\/browse\/([A-Z][A-Z0-9]+-\d+)/i);
  if (browseMatch?.[1]) {
    return browseMatch[1].toUpperCase();
  }

  const keyMatch = value.match(/^([A-Z][A-Z0-9]+-\d+)$/i);
  if (keyMatch?.[1]) {
    return keyMatch[1].toUpperCase();
  }

  return value;
}

export function getSettings(): JiraSnapSettings {
  const config = vscode.workspace.getConfiguration('jirasnap');

  return {
    baseUrl: String(config.get('baseUrl', '')).trim(),
    email: String(config.get('email', '')).trim(),
    apiToken: String(config.get('apiToken', '')).trim(),
    projectKey: String(config.get('projectKey', '')).trim(),
    defaultEpicKey: parseIssueKeyFromInput(String(config.get('defaultEpicKey', ''))),
    capturesJql: String(config.get('capturesJql', 'labels = jirasnap ORDER BY created DESC')).trim(),
    showStatusBarOpenCaptures: Boolean(config.get('showStatusBarOpenCaptures', true)),
    capitalizableFieldId: String(config.get('capitalizableFieldId', 'customfield_11302')).trim(),
    capitalizableValue: String(config.get('capitalizableValue', 'Yes')).trim(),
  };
}

export function validateSettings(settings: JiraSnapSettings): string[] {
  const missing: string[] = [];

  if (!settings.baseUrl) {
    missing.push('jirasnap.baseUrl');
  }
  if (!settings.email) {
    missing.push('jirasnap.email');
  }
  if (!settings.apiToken) {
    missing.push('jirasnap.apiToken');
  }
  if (!settings.projectKey) {
    missing.push('jirasnap.projectKey');
  }

  return missing;
}
