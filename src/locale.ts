import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface LocaleStrings {
  [key: string]: string
}

class LocalizationManager {
  private static instance: LocalizationManager;
  private strings: LocaleStrings = {};
  private currentLanguage: string = 'en';

  private constructor(private context: vscode.ExtensionContext) {
    this.loadLanguage();
  }

  static init(context: vscode.ExtensionContext): LocalizationManager {
    if (!LocalizationManager.instance) {
      LocalizationManager.instance = new LocalizationManager(context);
    }

    return LocalizationManager.instance;
  }

  static t(key: string, ...args: string[]): string {
    if (!LocalizationManager.instance) {
      return key;
    }

    return LocalizationManager.instance.translate(key, ...args);
  }

  private loadLanguage(): void {
    const config = vscode.workspace.getConfiguration('customCommands');

    this.currentLanguage = config.get<string>('language', 'en');

    // Используем путь относительно текущего файла
    const localePath = path.join(
      this.context.extensionPath,
      'l10n',
      `${this.currentLanguage}.json`
    );
    const fallbackPath = path.join(
      this.context.extensionPath,
      'l10n',
      'en.json'
    );

    try {
      // Пробуем загрузить выбранный язык
      if (fs.existsSync(localePath)) {
        const rawData = fs.readFileSync(localePath, 'utf-8');

        this.strings = JSON.parse(rawData);
      }
      // Если не найден, используем английский как fallback
      else if (fs.existsSync(fallbackPath)) {
        const rawData = fs.readFileSync(fallbackPath, 'utf-8');

        this.strings = JSON.parse(rawData);
      } else {
        this.strings = {};
      }
    } catch (error) {
      this.strings = {};
    }
  }

  private translate(key: string, ...args: string[]): string {
    const template = this.strings[key] || key;

    return template.replace(/{(\d+)}/g, (match, index) => {
      return args[index] !== undefined ? args[index] : match;
    });
  }

  refresh(): void {
    this.loadLanguage();
  }
}

export function initLocalization(context: vscode.ExtensionContext): void {
  LocalizationManager.init(context);
}

export function t(key: string, ...args: string[]): string {
  return LocalizationManager.t(key, ...args);
}
