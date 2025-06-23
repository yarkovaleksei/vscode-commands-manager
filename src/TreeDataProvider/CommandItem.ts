import * as vscode from 'vscode';
import type { Command } from '../models';
import { t } from '../locale';

export class CommandItem extends vscode.TreeItem {
  contextValue = 'command';

  constructor(private readonly cmd: Command) {
    super(cmd.name, vscode.TreeItemCollapsibleState.None);

    this.tooltip = cmd.command;
    this.command = {
      title: t('customCommands.command.execute'),
      command: 'customCommands.executeCommand',
      arguments: [cmd.command],
    };
    this.setIcon();
  }

  getCommandItem() {
    return this.cmd;
  }

  setIcon() {
    this.iconPath = new vscode.ThemeIcon(this.cmd.icon || 'play');
  }
}
