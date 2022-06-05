import * as vscode from 'vscode';
import type {
  RegisterCommandsOptions,
  RegisterCompletionOptions,
  RegisterHoverProviderOptions,
  RegisterTreeDataOptions,
} from '../types/vscode.type';

/**
 * 注册命令
 * @param registerOptions
 * @returns
 */
export const registerCommands = (
  context: vscode.ExtensionContext,
  registerOptions: RegisterCommandsOptions[]
) => {
  const commands: Array<vscode.Disposable> = [];
  registerOptions.forEach((command) => {
    const item = vscode.commands.registerCommand(command.name, command.handler);
    commands.push(item);
  });
  context.subscriptions.push(...commands);
  return commands;
};

/**
 * 注册HoverProvider
 * @param registerOptions
 * @returns
 */
export const registerHoverProvider = (
  context: vscode.ExtensionContext,
  registerOptions: RegisterHoverProviderOptions[]
) => {
  const hoverProviders: Array<vscode.Disposable> = [];
  registerOptions.forEach((command) => {
    const item = vscode.languages.registerHoverProvider(
      command.file,
      command.handler
    );
    hoverProviders.push(item);
  });
  context.subscriptions.push(...hoverProviders);
  return hoverProviders;
};
/**
 * 注册自动补全
 * @param context
 * @param registerOptions
 */
export const registerCompletionItemProvider = (
  context: vscode.ExtensionContext,
  registerOptions: RegisterCompletionOptions[]
) => {
  const completionProvider = registerOptions.map((x) => {
    return vscode.languages.registerCompletionItemProvider(x.file, x.provider);
  });
  context.subscriptions.push(...completionProvider);
};

/**
 * 注册侧边菜单视图
 * @param context
 * @param registerOptions
 */
export const registerTreeDataProvider = (
  context: vscode.ExtensionContext,
  registerOptions: RegisterTreeDataOptions[]
) => {
  const treeDataProvider = registerOptions.map((x) => {
    return vscode.window.registerTreeDataProvider(x.viewID, x.treeDataProvider);
  });
  context.subscriptions.push(...treeDataProvider);
};
