import { readFile } from 'fs-extra';
import * as vscode from 'vscode';
import { NodeDependenciesProvider } from '../menu-view';
import { infoTip } from '../utils/tips';
import { createLog } from './fast-log';
import { createSnippts } from './snippts-manage';
export const commandOptions = [
  {
    name: 'alqmc-helper.fast-log',
    handler: createLog,
  },
  {
    name: 'alqmc-helper.create-snippets',
    handler: createSnippts,
  },
  {
    name: 'alqmc-helper.open-file',
    handler: async (val: string, label: string) => {
      if (val && label) {
        const fileText = await readFile(val, 'utf-8');
        const fileTextArr = fileText.split('\n');
        const position = {
          line: 0,
          character: 0,
        };
        fileTextArr.forEach((x, index) => {
          if (
            x.includes(label) &&
            position.line === 0 &&
            position.character === 0
          ) {
            position.line = index;
            position.character = x.indexOf(label);
          }
        });
        await vscode.window.showTextDocument(vscode.Uri.file(val), {
          selection: new vscode.Range(
            new vscode.Position(position.line, position.character),
            new vscode.Position(
              position.line,
              position.character + label.length + 1
            )
          ),
        });
      }
    },
  },
  {
    name: 'alqmc-helper.refreshEntry',
    handler: () => {
      NodeDependenciesProvider.refresh();
    },
  },
];
