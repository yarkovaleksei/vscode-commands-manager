import * as vscode from 'vscode';
import type { Group } from '../models';
import { pickIcon } from '../iconPicker';
import { t } from '../locale';
import { getStorageData } from '../storage';

export async function addGroup(context: vscode.ExtensionContext) {
  const name = await vscode.window.showInputBox({
    prompt: t('prompt.group.name'),
    placeHolder: t('prompt.group.name.placeholder'),
  });

  if (!name) {
    return;
  }

  const data = getStorageData(context);
  const icon = await pickIcon('folder');
  const newGroup: Group = {
    id: Date.now().toString(),
    name: name,
    icon: icon,
  };

  data.groups.push(newGroup);

  await context.globalState.update('customCommandsData', data);

  vscode.window.showInformationMessage(t('message.group.added', name));

  return newGroup;
}
