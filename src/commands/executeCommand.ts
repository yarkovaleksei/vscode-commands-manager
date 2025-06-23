import * as vscode from 'vscode';
import type { CommandItem } from '../TreeDataProvider';

/**
 * При клике на команду в дереве сюда приходит строка (непосредственно команда).
 * А при выборе пункта меню "Выполнить команду" сюда приходит объект типа CommandItem.
 */
export async function executeCommand(
  context: vscode.ExtensionContext,
  command: string | CommandItem
) {
  const terminal =
    vscode.window.activeTerminal || vscode.window.createTerminal();

  terminal.show();

  const executedCommandString =
    typeof command === 'string' ? command : command.getCommandItem().command;

  terminal.sendText(executedCommandString);
}
