import * as vscode from 'vscode';
import {
  addCommand,
  addGroup,
  editCommand,
  editGroup,
  executeCommand,
  executeGroup,
  deleteCommand,
  deleteGroup,
} from './commands';
import type { Group } from './models';
import { initLocalization, t } from './locale';
import {
  TreeDataProvider,
  type GroupItem,
  type CommandItem,
} from './TreeDataProvider';

export function activate(context: vscode.ExtensionContext) {
  initLocalization(context);

  const treeDataProvider = new TreeDataProvider(context);
  const treeView = vscode.window.createTreeView('customCommandsView', {
    treeDataProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(
    vscode.commands.registerCommand('customCommands.refresh', () =>
      treeDataProvider.refresh()
    )
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('customCommands.language')) {
        vscode.window.showInformationMessage(t('message.restart'));
      }
    })
  );

  // Функция для обновления дерева после операций
  const refreshTree = () => treeDataProvider.refresh();

  const commands = [
    vscode.commands.registerCommand('customCommands.addGroup', () =>
      addGroup(context).then(refreshTree)
    ),

    vscode.commands.registerCommand(
      'customCommands.addCommand',
      (group?: Group) => addCommand(context, group?.id).then(refreshTree)
    ),

    vscode.commands.registerCommand(
      'customCommands.editGroup',
      (group: GroupItem) => editGroup(context, group).then(refreshTree)
    ),

    vscode.commands.registerCommand(
      'customCommands.editCommand',
      (command: CommandItem) => editCommand(context, command).then(refreshTree)
    ),

    vscode.commands.registerCommand(
      'customCommands.deleteGroup',
      (group: GroupItem) =>
        deleteGroup(context, group).then((deleted) => {
          if (deleted) {
            refreshTree();
          }
        })
    ),

    vscode.commands.registerCommand(
      'customCommands.deleteCommand',
      (command: CommandItem) =>
        deleteCommand(context, command).then((deleted) => {
          if (deleted) {
            refreshTree();
          }
        })
    ),

    vscode.commands.registerCommand(
      'customCommands.executeCommand',
      (command: string | CommandItem) => executeCommand(context, command)
    ),

    vscode.commands.registerCommand(
      'customCommands.executeGroup',
      (group: Group) => executeGroup(context, group)
    ),
  ];

  context.subscriptions.push(...commands, treeView);
}

export function deactivate() {}
