import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'weekly-journal.weeklyJournal',
    () => {
      vscode.window.showInformationMessage('sample message from Weekly Journal');
    },
  );

	context.subscriptions.push(disposable);
}

export function deactivate() {
  console.log('deactivating');
}
