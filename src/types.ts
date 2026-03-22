export type JiraSnapSettings = {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
  defaultEpicKey: string;
  capturesJql: string;
  showStatusBarOpenCaptures: boolean;
  customFieldsJson: string;
  capitalizableFieldId: string;
  capitalizableValue: string;
};

export type CaptureContext = {
  repo: string;
  branch: string;
  filePath: string;
  lines: string;
  capturedAt: string;
};

export type CreateIssueResult = {
  key: string;
  self: string;
  browseUrl: string;
};
