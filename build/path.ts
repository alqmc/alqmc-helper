import { resolve } from 'path';
export const rootPath = resolve('../');

export const pkgPath = resolve(rootPath, 'packages');
export const vscodeExtensionPath = resolve(pkgPath, 'vscode-extension');
export const chromeExtensionPath = resolve(pkgPath, 'chrome-extension');
