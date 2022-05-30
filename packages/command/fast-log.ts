import * as vscode from 'vscode';
export const createLog = () => {
  const activeTextEditor = vscode.window.activeTextEditor;
  const activeDocument = activeTextEditor?.document;

  // 1. 获取所有选中行信息
  const selection = activeTextEditor?.selection;
  if (!selection) return;
  // sample for selection: {"start":{"line":2,"character":0},"end":{"line":2,"character":7},"active":{"line":2,"character":7},"anchor":{"line":2,"character":0}}
  const { start, end } = selection;
  // 当前行文本内容
  const curLineText = activeDocument?.lineAt(start.line).text;

  // 当前行非空文本起始位置
  const curLineStartCharacter = curLineText?.search(/\S/i);

  // 当前行为空文本
  const curBlankText = curLineText?.substring(0, curLineStartCharacter);

  // 当前选中文本内容
  const curText = curLineText?.substring(start.character, end.character);

  // console插入位置
  const insertPositon = new vscode.Position(end.line + 1, 0);

  // 调用编辑接口
  activeTextEditor?.edit((TextEditorEdit) => {
    TextEditorEdit.insert(
      insertPositon,
      `${curBlankText}console.log('${curText}', ${curText});\n`
    );
  });
};
