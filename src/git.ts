import { execFile } from 'child_process';

function runGitCommand(cwd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile('git', args, { cwd }, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

export async function getCurrentBranchName(cwd: string): Promise<string> {
  try {
    const branch = await runGitCommand(cwd, ['rev-parse', '--abbrev-ref', 'HEAD']);
    return branch || 'none';
  } catch {
    return 'none';
  }
}

export async function getRepositoryName(cwd: string): Promise<string> {
  try {
    const remoteUrl = await runGitCommand(cwd, ['config', '--get', 'remote.origin.url']);
    if (!remoteUrl) {
      return 'none';
    }

    const normalized = remoteUrl.replace(/\\.git$/, '');
    const parts = normalized.split(/[/:]/);
    return parts[parts.length - 1] || 'none';
  } catch {
    return 'none';
  }
}
