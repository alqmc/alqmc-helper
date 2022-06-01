import { mkdir } from 'fs/promises';
import { resolve } from 'path';
import * as vscode from 'vscode';
import { infoTip } from '../utils/tips';
import { createSnipptsTemplate, getWorkspacePath } from '../utils/vscode';
import { getSnipptes, writeSnipptes } from '../utils/getSnipptes';
import { snippetsPath } from '../config/path';

const getQuestion = async () => {
  const prefix = await vscode.window.showInputBox({
    title: 'alqmc-helper:触发关键字',
    placeHolder: '请输入代码片段触发关键词',
  });
  const scope = await vscode.window.showQuickPick(
    [
      'typescript',
      'javascript',
      'vue',
      'markdown',
      'less',
      'sass',
      'css',
      'html',
    ],
    {
      title: 'alqmc-helper:代码片段作用范围',
      placeHolder: '代码片段生效范围',
      canPickMany: true,
    }
  );
  const isGlobal = await vscode.window.showQuickPick(
    [
      {
        label: 'yes',
        value: true,
      },
      {
        label: 'no',
        value: false,
      },
    ],
    {
      title: 'alqmc-helper:是否全局生效',
      placeHolder: '是否是否注册为全局代码片段',
    }
  );
  const description = await vscode.window.showInputBox({
    title: 'alqmc-helper:代码片段描述',
    placeHolder: '简短的描述一下代码片段',
  });

  return {
    prefix,
    scope,
    isGlobal,
    description,
  };
};

const getCurrectText = () => {
  const activeTextEditor = vscode.window.activeTextEditor;
  const selection = activeTextEditor?.selection;
  if (!selection) return;
  const currectText = activeTextEditor.document.getText(
    new vscode.Range(selection.start, selection.end)
  );
  return currectText;
};

const snipptsCreator = () => {};
export const createSnippts = async () => {
  const currectText = getCurrectText();
  if (!currectText) return;
  const { prefix, description, scope, isGlobal } = await getQuestion();

  if (!prefix || !scope || scope.length == 0) return;
  const workspacePath = getWorkspacePath();
  if (isGlobal?.value) {
    await mkdir(snippetsPath).catch(() => {});
  } else {
    if (workspacePath?.uri.fsPath)
      await mkdir(resolve(workspacePath?.uri.fsPath, `.vscode`)).catch(
        () => {}
      );
  }

  scope.forEach(async (fileType) => {
    let filePath = resolve(snippetsPath, `${fileType}.json`);
    if (!isGlobal?.value && workspacePath?.uri.fsPath) {
      filePath = resolve(
        workspacePath?.uri.fsPath,
        `.vscode/${fileType}.code-snippets`
      );
    }
    const snippts = createSnipptsTemplate({
      scope: fileType,
      prefix,
      body: currectText.split('\n'),
      description,
    });
    let tsSnippets = await getSnipptes(filePath);
    if (tsSnippets) tsSnippets[prefix] = snippts[prefix];
    else tsSnippets = snippts;
    writeSnipptes(filePath, tsSnippets);
  });
};
