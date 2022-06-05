import { mkdir } from 'fs/promises';
import { resolve } from 'path';
import * as vscode from 'vscode';
import { errorTip, infoTip } from '../utils/tips';
import { createSnipptsTemplate, getWorkspacePath } from '../utils/vscode';
import { getSnipptes, writeSnipptes } from '../utils/getSnipptes';
import { snippetsPath } from '../config/path';
import type { SmippetsItem } from '../types/vscode.type';

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
      'json',
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
        label: '项目代码片段',
        value: false,
      },
      {
        label: '全局代码片段',
        value: true,
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

const snipptsCreator = async (
  filePath: string,
  snipptsOption: SmippetsItem
) => {
  const { scope, prefix, body, description } = snipptsOption;
  const snippts = createSnipptsTemplate({
    scope,
    prefix,
    body,
    description,
  });
  let tsSnippets = await getSnipptes(filePath);
  if (tsSnippets) tsSnippets[prefix] = snippts[prefix];
  else tsSnippets = snippts;
  writeSnipptes(filePath, tsSnippets);
};
export const createSnippts = async () => {
  const currectText = getCurrectText();
  if (!currectText) return;
  const { prefix, description, scope, isGlobal } = await getQuestion();

  if (!prefix || !scope || scope.length == 0) return;
  const workspacePath = getWorkspacePath();
  if (isGlobal?.value) {
    await mkdir(snippetsPath).catch(() => {});
    scope.forEach(async (fileType) => {
      const filePath = resolve(snippetsPath, `${fileType}.json`);
      await snipptsCreator(filePath, {
        prefix,
        body: currectText.split('\n'),
        scope: fileType,
        description,
      });
    });
    infoTip('全局代码片段需要重启vscode生效！', '重启编辑器').then(
      (selection) => {
        if (selection === '重启编辑器') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      }
    );
  } else if (workspacePath) {
    await mkdir(resolve(workspacePath, `.vscode`)).catch(() => {});
    const filePath = resolve(workspacePath, `.vscode/${prefix}.code-snippets`);
    await snipptsCreator(filePath, {
      prefix,
      body: currectText.split('\n'),
      scope: scope.join(','),
      description,
    });
    infoTip('项目代码片段添加成功');
  } else {
    errorTip('代码片段添加失败！');
  }
};
