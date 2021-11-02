import * as path from 'path';
import * as vscode from 'vscode';
import * as textstat from 'text-readability';

import { getWeekRange, formatDate } from './date-utils';

const templateFolder = 'templates'; // inside extension codebase
const templateFilename = 'week-NN.md';
const targetFolder = 'journals'; // inside user's workspace
const targetFilenamePattern = /^week-(\d{2})\.md$/; // e.g. "week-05.md"

async function inferNextWeekIndex(folderUri: vscode.Uri): Promise<number> {
  let weekIndex = 0;

  for (const [name, type] of await vscode.workspace.fs.readDirectory(folderUri)) {
    if (type !== vscode.FileType.File) { continue; }
    const matches = name.match(targetFilenamePattern);
    if (!matches) { continue; }
    weekIndex = parseInt(matches[1], 10);
  }

  return weekIndex + 1;
}

function formatWeekIndex(weekIndex: number): string {
  return weekIndex.toString().padStart(2, '0');
}

function fillTemplateFilename(weekIndex: number): string {
  return templateFilename.replace('NN', formatWeekIndex(weekIndex));
}

function fillTemplateContent(templateContent: string, weekIndex: number): string {
  const weekRange = getWeekRange(new Date());
  let dayIndex = 0;

  return templateContent
    .replace('{NN}', formatWeekIndex(weekIndex))
    .replace('{YYYY-MM-DD} - {YYYY-MM-DD}', `${formatDate(weekRange[0])} - ${formatDate(weekRange[4])}`)
    .replaceAll('{YYYY-MM-DD}', () => formatDate(weekRange[dayIndex++]));
}

async function createJournalFromTemplate(templatePath: string): Promise<void> {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showWarningMessage(
      `A folder needs to be open, so weekly logs could be stored under "./${targetFolder}/".`,
    );
    return;
  }

  const workspaceFolderUri = vscode.workspace.workspaceFolders[0].uri;
  const targetFolderUri = vscode.Uri.file(path.join(workspaceFolderUri.path, targetFolder));

  await vscode.workspace.fs.createDirectory(targetFolderUri);

  const nextWeekIndex = await inferNextWeekIndex(targetFolderUri);

  const templateUri = vscode.Uri.file(templatePath);
  const targetUri = vscode.Uri.file(path.join(targetFolderUri.path, fillTemplateFilename(nextWeekIndex)));

  const templateContent = Buffer
    .from(await vscode.workspace.fs.readFile(templateUri))
    .toString('utf8');
  const targetContent = fillTemplateContent(
    templateContent,
    nextWeekIndex,
  );

  await vscode.workspace.fs.writeFile(targetUri, Buffer.from(targetContent, 'utf8'));
  await vscode.window.showTextDocument(targetUri);
}

async function showReadabilityScore(): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showWarningMessage(
      'A file needs to be open, so text stats could be retrieved.',
    );
    return;
  }

  const text = editor.document.getText();
  const wordCount = textstat.lexiconCount(text, true);
  const consensusScore = textstat.textStandard(text, false);

  vscode.window.showInformationMessage(
    `Number of words: ${wordCount}, readability score: ${consensusScore}.`,
  );
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'weekly-journal.weeklyJournal.create',
      () => createJournalFromTemplate(
        context.asAbsolutePath(path.join(templateFolder, templateFilename)),
      ),
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'weekly-journal.weeklyJournal.show-readability-score',
      showReadabilityScore,
    ),
  );
}

export function deactivate(): void {
  console.log('deactivating');
}
