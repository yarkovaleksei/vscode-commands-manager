import * as vscode from 'vscode';
import type { Command, Group } from '../models';
import { pickIcon } from '../iconPicker';
import { t } from '../locale';
import { getStorageData } from '../storage';

export async function addCommand(
  context: vscode.ExtensionContext,
  groupId?: Group['id']
) {
  const data = getStorageData(context);
  let targetGroupId = groupId;

  if (!targetGroupId) {
    if (data.groups.length === 0) {
      vscode.window.showErrorMessage(t('error.noGroups'));

      return;
    }

    const selected = await vscode.window.showQuickPick(
      data.groups.map((g) => ({
        label: g.icon ? `$(${g.icon}) ${g.name}` : `$(folder) ${g.name}`,
        group: g,
      })),
      { placeHolder: t('select.group') }
    );

    if (!selected) {
      return;
    }

    targetGroupId = selected.group.id;
  }

  const name = await vscode.window.showInputBox({
    prompt: t('prompt.command.name'),
    placeHolder: t('prompt.command.name.placeholder'),
  });

  if (!name) {
    return;
  }

  const command = await vscode.window.showInputBox({
    prompt: t('prompt.command.text'),
    placeHolder: t('prompt.command.text.placeholder'),
  });

  if (!command) {
    return;
  }

  const icon = await pickIcon('play');
  const newCommand: Command = {
    id: Date.now().toString(),
    name: name,
    command: command,
    groupId: targetGroupId,
    icon: icon,
  };

  data.commands.push(newCommand);

  await context.globalState.update('customCommandsData', data);

  vscode.window.showInformationMessage(t('message.command.added', name));
}
