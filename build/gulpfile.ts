import { resolve } from 'path';
import { run, withTask } from '@alqmc/build-utils';
import { series, task, watch } from 'gulp';
import { vscodeBuild, vscodeCopyFile } from './vscode-build';
import { vscodeExtensionPath } from './path';

task('watchVscode', () => {});

export const vscode = series(
  withTask('clear', () => run('pnpm run vscode:clear')),
  withTask('vscode-build', vscodeBuild),
  withTask('vscode-copy', vscodeCopyFile)
);
export const vscodeExtension = withTask('vscode-watch', () => {
  watch(resolve(vscodeExtensionPath, 'src'), vscode);
});

export const watchVscode = series(vscodeExtension);
