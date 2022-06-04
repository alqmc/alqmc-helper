// 基于打包后的路径 dist
import { resolve } from 'path';
export const rootPath = resolve(__dirname, '..');

export const snippetsPath = resolve(rootPath, 'snippets');
