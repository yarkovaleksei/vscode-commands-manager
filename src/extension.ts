import * as vscode from 'vscode';
import { addGroup } from './commands/addGroup';
import { addCommand } from './commands/addCommand';
import { editGroup } from './commands/editGroup';
import { editCommand } from './commands/editCommand';
import { executeGroup } from './commands/executeGroup';
import { deleteGroup } from './commands/deleteGroup';
import { deleteCommand } from './commands/deleteCommand';
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
      'customCommands.execute',
      (command: string | CommandItem) => {
        /**
         * При клике на команду в дереве сюда приходит строка (непосредственно команда).
         * А при выборе пункта меню "Выполнить команду" сюда приходит объект типа CommandItem.
         */
        const terminal =
          vscode.window.activeTerminal || vscode.window.createTerminal();
        terminal.show();

        const executedCommandString =
          typeof command === 'string'
            ? command
            : command.getCommandItem().command;

        terminal.sendText(executedCommandString);
      }
    ),

    vscode.commands.registerCommand(
      'customCommands.executeGroup',
      (group: Group) => executeGroup(context, group)
    ),
  ];

  context.subscriptions.push(...commands, treeView);
}

export function deactivate() {}
