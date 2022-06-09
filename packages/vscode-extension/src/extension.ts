import {
  registerCommands,
  registerCompletionItemProvider,
  registerHoverProvider,
  registerTreeDataProvider,
} from './utils/register';
import { commandOptions } from './command';
import { getProvideHovers } from './hover';
import { CodeTreeProvider } from './menu-view';
import { getCompletionOptions } from './completion';
import type * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  registerCommands(context, commandOptions);
  registerHoverProvider(context, getProvideHovers());
  registerTreeDataProvider(context, [
    {
      viewID: 'codeSnipptes',
      treeDataProvider: new CodeTreeProvider(),
    },
  ]);
  registerCompletionItemProvider(context, getCompletionOptions());
}

export function deactivate() {}
