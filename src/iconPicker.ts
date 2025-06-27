import * as vscode from 'vscode';
import { t } from './locale';
import { vscodeDefaultIcons } from './vscodeDefaultIcons';

interface QuickPickItem extends vscode.QuickPickItem {
  icon?: string;
}

export async function pickIcon(defaultIcon = ''): Promise<string | undefined> {
  const items = vscodeDefaultIcons.map((icon) => {
    const item: QuickPickItem = {
      label: `$(${icon})`,
      description: icon,
      icon,
    };

    return item;
  });

  /**
   * Сортируем иконки так, чтобы текущая выбранная была первой.
   * Так она будет сразу в фокусе и достаточно нажать Enter чтобы выбрать.
   */
  items.sort((a, b) => a.icon === defaultIcon ? -1 : 1);

  const noIconItem: QuickPickItem = {
    label: `$(close) ${t('icon.noIcon')}`,
    description: t('icon.noIcon.description'),
    icon: undefined,
  };
  const customIconItem: QuickPickItem = {
    label: `$(close) ${t('icon.custom')}`,
    description: t('icon.custom.description'),
    icon: 'custom',
  };

  const selected = await vscode.window.showQuickPick(
    [
      ...items,
      noIconItem,
      customIconItem,
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
