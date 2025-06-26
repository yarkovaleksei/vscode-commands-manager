import * as vscode from 'vscode';
import { t } from './locale';
import { vscodeDefaultIcons } from './vscodeDefaultIcons';

export async function pickIcon(defaultIcon = ''): Promise<string | undefined> {
  const items = vscodeDefaultIcons.map((icon) => ({
    label: `$(${icon})`,
    description: icon,
    icon: icon,
  }));

  const selected = await vscode.window.showQuickPick(
    [
      ...items,
      {
        label: `$(close) ${t('icon.noIcon')}`,
        description: t('icon.noIcon.description'),
        icon: undefined,
      },
      {
        label: `$(edit) ${t('icon.custom')}`,
        description: t('icon.custom.description'),
        icon: 'custom',
      },
    ],
    {
      placeHolder: t('select.icon'),
      matchOnDescription: true,
    }
  );

  if (!selected) {
    return undefined;
  }

  if (selected.icon === 'custom') {
    const customIcon = await vscode.window.showInputBox({
      prompt: t('prompt.icon.custom'),
      placeHolder: t('prompt.icon.custom.placeholder'),
      value: defaultIcon,
    });

    return customIcon || undefined;
  }

  return selected.icon;
}
