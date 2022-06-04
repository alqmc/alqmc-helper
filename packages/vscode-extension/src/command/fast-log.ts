import { basename } from 'path';
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
    errorTip('最多选中一行文本！');
    return;
  }
  const currectText = activeTextEditor.document.getText(
    new vscode.Range(selection.start, selection.end)
  );
  const currectFileName = basename(activeTextEditor.document.fileName);
  // console插入位置
  const insertPositon = new vscode.Position(selection.end.line + 1, 0);

  // 调用编辑接口
  activeTextEditor?.edit((TextEditorEdit) => {
    TextEditorEdit.insert(
      insertPositon,
      `console.log('file:${currectFileName},line:${
        selection.end.line + 2
      }=>${currectText}:%o', ${currectText});\n`
    );
  });
};
