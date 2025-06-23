import * as vscode from 'vscode';
import { t } from '../locale';
import { getStorageData } from '../storage';
import type { CommandItem } from '../TreeDataProvider';

export async function deleteCommand(
  context: vscode.ExtensionContext,
  command: CommandItem
) {
  const cmd = command.getCommandItem();
  const confirmation = await vscode.window.showWarningMessage(
    t('prompt.deleteCommand', cmd.name),
    { modal: true },
    t('button.yes'),
    t('button.no')
  );

  if (confirmation !== t('button.yes')) {
    return;
  }

  const data = getStorageData(context);

  // Удаляем команду
  data.commands = data.commands.filter((commandItem) => commandItem.id !== cmd.id);

  await context.globalState.update('customCommandsData', data);

  vscode.window.showInformationMessage(t('message.command.deleted', cmd.name));

  return true;
}
