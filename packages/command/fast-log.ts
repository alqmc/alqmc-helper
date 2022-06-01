import * as vscode from 'vscode';
import { errorTip } from '../utils/tips';
export const createLog = () => {
  const activeTextEditor = vscode.window.activeTextEditor;
  const selection = activeTextEditor?.selection;
  if (!selection) {
    errorTip('未选中文本');
    return;
  }
  if (selection.end.line !== selection.start.line) {
    errorTip('只能选中一行文本！');
    return;
  }
  const currectText = activeTextEditor.document.getText(
    new vscode.Range(selection.start, selection.end)
  );
  const currectFileName = activeTextEditor.document.fileName.slice(
    activeTextEditor.document.fileName.lastIndexOf('\\') + 1
  );
  // console插入位置
  const insertPositon = new vscode.Position(selection.end.line + 1, 0);

  // 调用编辑接口
  activeTextEditor?.edit((TextEditorEdit) => {
    TextEditorEdit.insert(
      insertPositon,
      `console.log('file:${currectFileName},line:${selection.end.line}=>${currectText}:%o', ${currectText});\n`
    );
  });
};
