import * as vscode from 'vscode';
import type { Group } from '../models';
import { t } from '../locale';

export class GroupItem extends vscode.TreeItem {
  contextValue = 'group';
  groupId: string;

  constructor(public readonly group: Group) {
    super(group.name, vscode.TreeItemCollapsibleState.Collapsed);

    this.id = group.id;
    this.groupId = group.id;
    this.tooltip = group.name;
    this.setIcon();

    this.command = {
      title: t('customCommands.command.executeGroup'),
      command: 'customCommands.executeGroup',
      arguments: [this.group],
    };
  }

  getGroupItem() {
    return this.group;
  }

  setIcon() {
    this.iconPath = new vscode.ThemeIcon(this.group.icon || 'folder');
  }
}
