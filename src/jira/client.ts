import { JiraSnapSettings, CreateIssueResult } from '../types';

type JiraCreateIssueResponse = {
  id: string;
  key: string;
  self: string;
};

type ADFTextNode = {
  type: 'text';
  text: string;
};

type ADFParagraphNode = {
  type: 'paragraph';
  content: ADFTextNode[];
};

type ADFDoc = {
  version: 1;
  type: 'doc';
  content: ADFParagraphNode[];
};

export function toADFDescription(text: string): ADFDoc {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  const blocks = normalized ? normalized.split(/\n\n+/) : ['(none)'];

  const content: ADFParagraphNode[] = blocks.map((block) => ({
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: block,
      },
    ],
  }));

  return {
    version: 1,
    type: 'doc',
    content,
  };
}

type JiraErrorBody = {
  errorMessages?: string[];
  errors?: Record<string, string>;
};

function parseCustomFieldsJson(raw: string): Record<string, unknown> {
  const value = raw.trim();
  if (!value) {
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error('jirasnap.customFieldsJson is invalid JSON. Expected a JSON object like {"customfield_12345":{"value":"Yes"}}.');
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('jirasnap.customFieldsJson must be a JSON object. Example: {"customfield_12345":{"value":"Yes"}}.');
  }

  return parsed as Record<string, unknown>;
}

export class JiraRequestError extends Error {
  status: number;
  isParentAssignmentError: boolean;

  constructor(message: string, status: number, isParentAssignmentError = false) {
    super(message);
    this.name = 'JiraRequestError';
    this.status = status;
    this.isParentAssignmentError = isParentAssignmentError;
  }
}

export function parseJiraErrorBody(raw: string): JiraErrorBody {
  try {
    return JSON.parse(raw) as JiraErrorBody;
  } catch {
    return {};
  }
}

export function buildFriendlyErrorMessage(status: number, body: JiraErrorBody, fallback: string): string {
  if (status === 401) {
    return 'Authentication failed. Check jirasnap.email and jirasnap.apiToken.';
  }
  if (status === 403) {
    return 'Permission denied. Your Jira account cannot create issues in this project.';
  }

  const bodyMessages: string[] = [
    ...(body.errorMessages ?? []),
    ...Object.values(body.errors ?? {}),
  ].filter(Boolean);

  if (bodyMessages.length > 0) {
    return bodyMessages.join(' | ');
  }

  if (status === 404) {
    return 'Jira endpoint not found. Check jirasnap.baseUrl and project configuration.';
  }

  return fallback;
}

export function isParentError(status: number, body: JiraErrorBody): boolean {
  if (status !== 400) {
    return false;
  }

  const joined = [
    ...(body.errorMessages ?? []),
    ...Object.entries(body.errors ?? {}).map(([k, v]) => `${k}:${v}`),
  ]
    .join(' ')
    .toLowerCase();

  return (
    joined.includes('parent')
    || joined.includes('epic')
    || joined.includes('issue type hierarchy')
  );
}

async function postIssue(baseUrl: string, authToken: string, payload: unknown): Promise<JiraCreateIssueResponse> {
  const response = await fetch(`${baseUrl}/rest/api/3/issue`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const errorBody = parseJiraErrorBody(errorText);
    const fallback = `Jira API error (${response.status}).`;
    const message = buildFriendlyErrorMessage(response.status, errorBody, fallback);
    throw new JiraRequestError(message, response.status, isParentError(response.status, errorBody));
  }

  return (await response.json()) as JiraCreateIssueResponse;
}

export async function createTaskIssue(
  settings: JiraSnapSettings,
  summary: string,
  description: string
): Promise<CreateIssueResult> {
  const baseUrl = settings.baseUrl.replace(/\/$/, '');
  const authToken = Buffer.from(`${settings.email}:${settings.apiToken}`).toString('base64');

  const baseFields: Record<string, unknown> = {
    project: { key: settings.projectKey },
    summary,
    description: toADFDescription(description),
    issuetype: { name: 'Task' },
    labels: ['jirasnap'],
  };

  if (settings.capitalizableFieldId) {
    baseFields[settings.capitalizableFieldId] = {
      value: settings.capitalizableValue || 'Yes',
    };
  }

  const customFields = parseCustomFieldsJson(settings.customFieldsJson);
  Object.assign(baseFields, customFields);

  const withParentPayload = {
    fields: {
      ...baseFields,
      parent: { key: settings.defaultEpicKey },
    },
  };

  const withoutParentPayload = {
    fields: {
      ...baseFields,
    },
  };

  let json: JiraCreateIssueResponse;
  if (settings.defaultEpicKey) {
    try {
      json = await postIssue(baseUrl, authToken, withParentPayload);
    } catch (error) {
      if (!(error instanceof JiraRequestError) || !error.isParentAssignmentError) {
        throw error;
      }
      json = await postIssue(baseUrl, authToken, withoutParentPayload);
    }
  } else {
    json = await postIssue(baseUrl, authToken, withoutParentPayload);
  }

  return {
    key: json.key,
    self: json.self,
    browseUrl: `${baseUrl}/browse/${json.key}`,
  };
}
