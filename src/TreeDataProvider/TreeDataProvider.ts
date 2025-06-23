import * as vscode from 'vscode';
import { getStorageData } from '../storage';
import { GroupItem } from './GroupItem';
import { CommandItem } from './CommandItem';

export class TreeDataProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(
    element?: GroupItem | CommandItem
  ): Promise<vscode.TreeItem[]> {
    // Корневой уровень - показываем группы
    if (!element) {
      return this.getGroups();
    }

    // Уровень группы - показываем команды
    if (element instanceof GroupItem) {
      return this.getCommands(element.groupId);
    }

    return [];
  }

  private async getGroups(): Promise<GroupItem[]> {
    const data = getStorageData(this.context);

    return data.groups.map((group) => new GroupItem(group));
  }

  private async getCommands(
    groupId: GroupItem['groupId']
  ): Promise<CommandItem[]> {
    const data = getStorageData(this.context);

    return data.commands
      .filter((command) => command.groupId === groupId)
      .map((command) => new CommandItem(command));
  }
}
