import { readFile } from 'fs-extra';
import * as vscode from 'vscode';
export const openFile = async (path: string, label: string) => {
  const fileText = await readFile(path, 'utf-8');
  const fileTextArr = fileText.split('\n');
  const position = {
    line: 0,
    character: 0,
  };
  fileTextArr.forEach((x, index) => {
    if (
      x.includes(`"${label}":`) &&
      position.line === 0 &&
      position.character === 0
    ) {
      position.line = index;
      position.character = x.indexOf(`"${label}":`);
    }
  });
  await vscode.window.showTextDocument(vscode.Uri.file(path), {
    selection: new vscode.Range(
      new vscode.Position(position.line, position.character),
      new vscode.Position(position.line, position.character + label.length + 1)
    ),
  });
};
