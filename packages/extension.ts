import { registerCommands, registerHoverProvider } from './utils/register';
import { commandOptions } from './config/command';
import { getProvideHovers } from './config/providehover';
import type * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  registerCommands(context, commandOptions);
  registerHoverProvider(context, await getProvideHovers());
}

export function deactivate() {}
