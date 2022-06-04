import {
  registerCommands,
  registerCompletionItemProvider,
  registerHoverProvider,
} from './utils/register';
import { commandOptions } from './command';
import { getProvideHovers } from './hover';
import { NodeDependenciesProvider } from './menu-view';
import type * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  registerCommands(context, commandOptions);
  registerHoverProvider(context, await getProvideHovers());
  registerCompletionItemProvider(context, [
    {
      viewID: 'codeSnipptes',
      treeDataProvider: new NodeDependenciesProvider(),
    },
  ]);
}

export function deactivate() {}
