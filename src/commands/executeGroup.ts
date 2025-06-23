import * as vscode from 'vscode';
import type { Group } from '../models';
import { t } from '../locale';
import { getStorageData } from '../storage';

export async function executeGroup(
  context: vscode.ExtensionContext,
  group: Group
) {
  const config = vscode.workspace.getConfiguration('customCommands');
  const timeoutSeconds = config.get<number>('commandTimeout', 30);

  const data = getStorageData(context);

  const commands = data.commands
    .filter((cmd) => cmd.groupId === group.id)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (commands.length === 0) {
    vscode.window.showInformationMessage(
      t('message.no.commands.in.group', group.name)
    );

    return;
  }

  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  statusBar.text = t('status.executing', group.name);
  statusBar.show();

  vscode.window.showInformationMessage(t('message.executing.group', group.name));

  const terminal = vscode.window.createTerminal(
    t('terminal.group.execution', group.name)
  );

  terminal.show();

  let successCount = 0;
  let currentIndex = 0;

  const executeNextCommand = async () => {
    if (currentIndex >= commands.length) {
      statusBar.hide();

      vscode.window.showInformationMessage(
        t(
          'message.group.execution.complete',
          String(successCount),
          String(commands.length)
        )
      );

      return;
    }

    const command = commands[currentIndex];

    currentIndex++;

    statusBar.text = t(
      'status.executing',
      `${command.name} (${currentIndex}/${commands.length})`
    );

    vscode.window.showInformationMessage(
      t('message.executing.command', command.name)
    );

    // Отправляем команду в терминал
    terminal.sendText(command.command);

    try {
      // Используем простой таймаут вместо отслеживания вывода
      await waitForCommand(timeoutSeconds * 1000);

      successCount++;

      statusBar.text = t(
        'status.group.complete',
        String(successCount),
        String(commands.length)
      );

      executeNextCommand();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      vscode.window.showErrorMessage(
        t('error.command.failed', `${command.name}: ${errorMessage}`)
      );

      const choice = await vscode.window.showErrorMessage(
        t('prompt.continue.execution'),
        t('button.continue'),
        t('button.stop')
      );

      if (choice === t('button.continue')) {
        executeNextCommand();
      } else {
        statusBar.hide();
      }
    }
  };

  executeNextCommand();
}

// Упрощенная реализация ожидания
function waitForCommand(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
