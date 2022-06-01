import { resolve } from 'path';
import { buildTypescriptLib } from '@alqmc/build-ts';
import { withTask } from '@alqmc/build-utils';
import { series, task, watch } from 'gulp';
import type { DefineLibConfig } from '@alqmc/build-ts/types/type/build-typescript';

const rootPath = resolve('../');

const buildConfig: DefineLibConfig = {
  baseOptions: {
    input: resolve(rootPath, 'packages/extension.ts'),
    enterPath: resolve(rootPath, 'packages'),
    outPutPath: resolve(rootPath, 'dist'),
    tsConfigPath: resolve(rootPath, 'tsconfig.json'),
    pkgPath: resolve(rootPath, 'package.json'),
  },
  externalOptions: ['vscode'],
  buildProduct: ['lib'],
};

task('watchTask', () => {
  watch(resolve(rootPath, 'packages'), async () => {
    await buildTypescriptLib(buildConfig);
  });
});

export default series(
  withTask('build', async () => {
    await buildTypescriptLib(buildConfig);
  })
);
