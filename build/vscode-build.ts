import { resolve } from 'path';
import { buildTypescriptLib } from '@alqmc/build-ts';
import { copy } from 'fs-extra';
import { series } from 'gulp';
import { vscodeExtensionPath } from './path';
import type { DefineLibConfig } from '@alqmc/build-ts';

const buildConfig: DefineLibConfig = {
  baseOptions: {
    input: resolve(vscodeExtensionPath, 'src/extension.ts'),
    enterPath: resolve(vscodeExtensionPath, 'src'),
    outPutPath: resolve(vscodeExtensionPath, 'dist'),
    tsConfigPath: resolve(vscodeExtensionPath, 'tsconfig.json'),
    pkgPath: resolve(vscodeExtensionPath, 'package.json'),
  },
  externalOptions: ['vscode', 'fast-glob', 'fs-extra'],
  buildProduct: ['lib'],
  pureOutput: true,
};

export const vscodeBuild = async () => {
  return buildTypescriptLib(buildConfig);
};
export const vscodeCopyFile = async () => {
  await copy(
    resolve(vscodeExtensionPath, 'public'),
    resolve(vscodeExtensionPath, 'dist/public'),
    {
      recursive: true,
    }
  );
  await copy(
    resolve(vscodeExtensionPath, 'src/snippets'),
    resolve(vscodeExtensionPath, 'dist/snippets'),
    {
      recursive: true,
    }
  );
  await copy(
    resolve(vscodeExtensionPath, 'package.json'),
    resolve(vscodeExtensionPath, 'dist/package.json')
  );
};
