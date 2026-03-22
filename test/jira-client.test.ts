import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFriendlyErrorMessage,
  isParentError,
  parseJiraErrorBody,
  toADFDescription,
} from '../src/jira/client';

test('parseJiraErrorBody returns parsed object for valid json', () => {
  const raw = JSON.stringify({
    errorMessages: ['Top level error'],
    errors: { parent: 'Parent not allowed' },
  });

  const parsed = parseJiraErrorBody(raw);
  assert.deepEqual(parsed.errorMessages, ['Top level error']);
  assert.equal(parsed.errors?.parent, 'Parent not allowed');
});

test('parseJiraErrorBody returns empty object for invalid json', () => {
  const parsed = parseJiraErrorBody('not-json');
  assert.deepEqual(parsed, {});
});

test('isParentError detects parent-related jira validation errors', () => {
  const body = {
    errorMessages: ['Issue type hierarchy is invalid for this parent'],
    errors: { parent: 'Parent cannot be set for this issue type' },
  };

  assert.equal(isParentError(400, body), true);
});

test('isParentError ignores non-400 and unrelated errors', () => {
  assert.equal(isParentError(401, { errorMessages: ['Auth failed'] }), false);
  assert.equal(isParentError(400, { errorMessages: ['Some other field failed'] }), false);
});

test('buildFriendlyErrorMessage maps 401 and 403 to actionable text', () => {
  const authMsg = buildFriendlyErrorMessage(401, {}, 'fallback');
  const permissionMsg = buildFriendlyErrorMessage(403, {}, 'fallback');

  assert.match(authMsg, /Authentication failed/i);
  assert.match(permissionMsg, /Permission denied/i);
});

test('buildFriendlyErrorMessage uses jira body messages when present', () => {
  const msg = buildFriendlyErrorMessage(
    400,
    {
      errorMessages: ['Top level'],
      errors: { description: 'Must be ADF' },
    },
    'fallback'
  );

  assert.match(msg, /Top level/);
  assert.match(msg, /Must be ADF/);
});

test('toADFDescription returns ADF doc paragraphs', () => {
  const adf = toADFDescription('Line 1\n\nLine 2');

  assert.equal(adf.type, 'doc');
  assert.equal(adf.version, 1);
  assert.equal(adf.content.length, 2);
  assert.equal(adf.content[0].content[0].text, 'Line 1');
  assert.equal(adf.content[1].content[0].text, 'Line 2');
});
