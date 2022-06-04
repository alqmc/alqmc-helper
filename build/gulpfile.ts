import { resolve } from 'path';
import { withTask } from '@alqmc/build-utils';
import { series, task, watch } from 'gulp';
import { vscodeBuild, vscodeCopyFile } from './vscode-build';
import { vscodeExtensionPath } from './path';

task('watchVscode', () => {});

export const vscode = series(
  withTask('vscode-build', vscodeBuild),
  withTask('vscode-conpy', vscodeCopyFile)
);
export const vscodeExtension = withTask('vscode-watch', () => {
  watch(resolve(vscodeExtensionPath, 'src'), vscode);
});

export const watchVscode = series(vscodeExtension);
