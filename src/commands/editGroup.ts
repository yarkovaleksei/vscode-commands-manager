import * as vscode from 'vscode';
import { pickIcon } from '../iconPicker';
import { t } from '../locale';
import { getStorageData } from '../storage';
import type { GroupItem } from '../TreeDataProvider';

export async function editGroup(
  context: vscode.ExtensionContext,
  group: GroupItem
) {
  const grp = group.getGroupItem();
  const newName = await vscode.window.showInputBox({
    prompt: t('prompt.group.name'),
    value: grp.name,
  });

  if (!newName || newName.trim() === '') {
    return;
  }

  const data = getStorageData(context);
  const newIcon = await pickIcon(grp.icon || 'folder');
  const index = data.groups.findIndex((g) => g.id === grp.id);

  if (index === -1) {
    return;
  }

  if (newName) {
    data.groups[index].name = newName;
  }

  data.groups[index].icon = newIcon;

  await context.globalState.update('customCommandsData', data);

  vscode.window.showInformationMessage(t('message.group.updated'));
}
