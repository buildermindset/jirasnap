import * as path from 'path';
import * as vscode from 'vscode';
import { CaptureContext } from './types';
import { getCurrentBranchName, getRepositoryName } from './git';

export async function buildCaptureContext(): Promise<CaptureContext> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  const workspacePath = workspaceFolder?.uri.fsPath;

  const repo = workspacePath ? await getRepositoryName(workspacePath) : 'none';
  const branch = workspacePath ? await getCurrentBranchName(workspacePath) : 'none';

  const editor = vscode.window.activeTextEditor;
  const filePath = editor && workspacePath
    ? path.relative(workspacePath, editor.document.uri.fsPath) || path.basename(editor.document.uri.fsPath)
    : 'none';

  let lines = 'none selected';
  if (editor && !editor.selection.isEmpty) {
    const start = editor.selection.start.line + 1;
    const end = editor.selection.end.line + 1;
    lines = `${start}-${end}`;
  }

  return {
    repo,
    branch,
    filePath,
    lines,
    capturedAt: new Date().toISOString(),
  };
}

export function buildDescription(note: string, context: CaptureContext): string {
  const quickNote = note.trim() ? note.trim() : '(none)';

  return [
    '[Quick note]',
    quickNote,
    '',
    '[Captured context]',
    `Repo: ${context.repo}`,
    `Branch: ${context.branch}`,
    `File: ${context.filePath}`,
    `Lines: ${context.lines}`,
    `Captured at: ${context.capturedAt}`,
  ].join('\n');
}
