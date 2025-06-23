import * as vscode from 'vscode';
import { t } from './locale';

const COMMON_ICONS = [
  'play',
  'debug-start',
  'run',
  'terminal',
  'zap',
  'rocket',
  'check',
  'circle-filled',
  'circle-outline',
  'circle-slash',
  'tag',
  'bell',
  'star',
  'heart',
  'eye',
  'eye-closed',
  'lightbulb',
  'flame',
  'gear',
  'settings',
  'tools',
  'wand',
  'extensions',
  'package',
  'folder',
  'folder-opened',
  'file',
  'file-code',
  'symbol-method',
  'symbol-key',
  'symbol-event',
  'symbol-variable',
  'pulse',
  'graph',
  'dashboard',
];

export async function pickIcon(defaultIcon = ''): Promise<string | undefined> {
  const items = COMMON_ICONS.map((icon) => ({
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
