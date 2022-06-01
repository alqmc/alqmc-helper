import { basename, join } from 'path';
import { exec } from 'child_process';
import * as vscode from 'vscode';
import { errorTip } from '../utils/tips';
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

export const getWorkspacePath = () => {
  if (!vscode.workspace.workspaceFolders) errorTip('当前工作区不存在！');
  if (vscode.workspace.workspaceFolders?.length === 1) {
    return vscode.workspace.workspaceFolders[0];
  }
};
