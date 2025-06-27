import * as vscode from 'vscode';
import { pickIcon } from '../iconPicker';
import { t } from '../locale';
import { getStorageData } from '../storage';
import type { CommandItem } from '../TreeDataProvider';

export async function editCommand(
  context: vscode.ExtensionContext,
  command: CommandItem
) {
  const cmd = command.getCommandItem();
  const newName = await vscode.window.showInputBox({
    prompt: t('prompt.command.name'),
    value: cmd.name,
  });

  if (newName === undefined) {
    return;
  }

  const newCommandText = await vscode.window.showInputBox({
    prompt: t('prompt.command.text'),
    value: cmd.command,
  });

  if (!newCommandText || newCommandText.trim() === '') {
    return;
  }

  const newIcon = await pickIcon(cmd.icon || 'file');
  const data = getStorageData(context);
  const index = data.commands.findIndex((c) => c.id === cmd.id);

  if (index === -1) {
    return;
  }

  if (newName) {
    data.commands[index].name = newName;
  }

  if (newCommandText) {
    data.commands[index].command = newCommandText;
  }

  data.commands[index].icon = newIcon;

  await context.globalState.update('customCommandsData', data);

  vscode.window.showInformationMessage(t('message.command.updated'));
}
