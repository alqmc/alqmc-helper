import { join } from 'path';
import { exec } from 'child_process';
import * as vscode from 'vscode';
import { errorTip } from './tips';
import type { SmippetsItem } from '../types/vscode.type';
/**
 * 获取某个扩展文件绝对路径
 * @param context 上下文
 * @param relativePath 扩展中某个文件相对于根目录的路径，如 images/test.jpg
 */
export const getExtensionFileAbsolutePath = (
  context: vscode.ExtensionContext,
  relativePath: string
) => {
  return join(context.extensionPath, relativePath);
};

/**
 * 使用默认浏览器中打开某个URL
 */
export const exportopenUrlInBrowser = (url: string) => {
  exec(`open '${url}'`);
};

/**
 * 读取插件用户配置
 * @param key
 * @returns
 */
export const getGlobalConfig = (key: string) => {
  return vscode.workspace.getConfiguration().get(key);
};
/**
 * 修改插件配置
 * @param key
 * @param value
 * @param global
 */
export const updataGlobalConfig = (key: string, value: any, global = true) => {
  vscode.workspace.getConfiguration().update(key, value, global);
};

/**
 * 创建简易代码片段
 */
export const createSnipptsTemplate = ({
  scope,
  prefix,
  body,
  description,
}: SmippetsItem) => {
  return {
    [prefix]: { scope, prefix, body, description },
  };
};

/**
 * 获取工作区路径
 */
export const getWorkspacePath = () => {
  if (!vscode.workspace.workspaceFolders) errorTip('当前工作区不存在！');
  if (vscode.workspace.workspaceFolders?.length === 1) {
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  }
};

export const moveCursor = (characterDelta: number) => {
  const active = vscode.window.activeTextEditor!.selection.active!;
  const position = active.translate({ characterDelta });
  vscode.window.activeTextEditor!.selection = new vscode.Selection(
    position,
    position
  );
};

/**
 * 获取当前位置单词
 * @param document
 * @param position
 * @returns
 */
export const getWordRangeAtPosition = (
  document: vscode.TextDocument,
  position: vscode.Position
) => {
  const word = document.getWordRangeAtPosition(
    position,
    /([A-z]{1,}[-]{0,1}){1,}[A-z]{1,}/g
  );
  return document.getText(word);
};

/**
 * 找到前置未闭合的标签
 * @param document
 * @param position
 * @returns
 */
export const findTag = (
  document: vscode.TextDocument,
  position: vscode.Position
): string | null => {
  const writeTag = ['template'];
  const line = document.lineAt(position);
  const tagStart = line.text.indexOf('<');
  const tagReg = /<\/{0,1}[A-z-]*/;
  if (tagStart !== -1) {
    let tag: null | string = null;
    const tagExpMatchArray = line.text.match(tagReg);
    if (tagExpMatchArray && tagExpMatchArray.length > 0) {
      tag = tagExpMatchArray[0].replace(/[/<]/g, '');
      if (writeTag.includes(tag)) {
        const newPosition = new vscode.Position(
          position.line - 1,
          position.character
        );
        return findTag(document, newPosition);
      }
    }
    return tag;
  } else {
    const newPosition = new vscode.Position(
      position.line - 1,
      position.character
    );
    return findTag(document, newPosition);
  }
};
