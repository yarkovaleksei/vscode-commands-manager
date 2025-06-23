import * as vscode from 'vscode';
import { t } from '../locale';
import { getStorageData } from '../storage';
import type { GroupItem } from '../TreeDataProvider';

export async function deleteGroup(
  context: vscode.ExtensionContext,
  group: GroupItem
) {
  const grp = group.getGroupItem();
  const confirmation = await vscode.window.showWarningMessage(
    t('prompt.deleteGroup', grp.name),
    { modal: true },
    t('button.yes'),
    t('button.no')
  );

  if (confirmation !== t('button.yes')) {
    return;
  }

  const data = getStorageData(context);

  // Удаляем группу
  data.groups = data.groups.filter((g) => g.id !== grp.id);

  // Удаляем все команды этой группы
  data.commands = data.commands.filter((cmd) => cmd.groupId !== grp.id);

  await context.globalState.update('customCommandsData', data);

  vscode.window.showInformationMessage(t('message.group.deleted', grp.name));

  return true;
}
