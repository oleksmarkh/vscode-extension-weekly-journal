import * as vscode from 'vscode';

import * as path from 'path';

const templateFolder = 'templates'; // inside extension codebase
const targetFolder = 'journals'; // inside user's workspace

async function createJournalFromTemplate(templatePath: string, weekIndex: number): Promise<void> {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showWarningMessage(
      `Please open some folder, so weekly logs could be stored under "${targetFolder}/" inside.`,
    );
    return;
  }

  const weekIndexFormatted = weekIndex.toString().padStart(2, '0');

  const templateUri = vscode.Uri.file(templatePath);
  const targetUri = vscode.Uri.file(path.join(
    vscode.workspace.workspaceFolders[0].uri.path,
    targetFolder,
    `week-${weekIndexFormatted}.md`,
  ));

  // await vscode.workspace.fs.copy(templateUri, targetUri, { overwrite: true });

  const templateContent = Buffer
    .from(await vscode.workspace.fs.readFile(templateUri))
    .toString('utf8');

  const targetContent = templateContent
    .replace('{NN}', weekIndexFormatted);

  await vscode.workspace.fs.writeFile(targetUri, Buffer.from(targetContent, 'utf8'));
  await vscode.window.showTextDocument(targetUri);
}

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(
    'weekly-journal.weeklyJournal',
    () => createJournalFromTemplate(
      context.asAbsolutePath(path.join(templateFolder, 'week-NN.md')),
      1,
    ),
  );

  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  console.log('deactivating');
}
