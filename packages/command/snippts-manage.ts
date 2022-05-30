import * as vscode from 'vscode';
export const createSnippts = () => {
  const selection = vscode.window.activeTextEditor?.selection;
  if (!selection) return;
  const { start, end } = selection;
  console.log('🔥log=>snippts-manage=>5:start:%o', start.character);
  console.log('🔥log=>snippts-manage=>6:end:%o', end.character);
  const currectText = selection.active;
  console.log('🔥log=>snippts-manage=>9:currectText:%o', currectText);
};
