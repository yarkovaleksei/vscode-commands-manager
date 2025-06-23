import type { ExtensionContext } from 'vscode';
import type { StorageData } from '../models';

export function getStorageData(context: ExtensionContext): StorageData {
  const defaultData: StorageData = {
    version: 1,
    groups: [],
    commands: [],
  };

  return context.globalState.get<StorageData>('customCommandsData', defaultData);
}
