import { HoverProvider } from './provide-hover';
import type { RegisterHoverProviderOptions } from '../types/vscode.type';

export const getProvideHovers = async (): Promise<
  RegisterHoverProviderOptions[]
> => {
  const libs = HoverProvider();
  return libs.map((lib) => {
    return {
      file: lib.file,
      handler: lib.handler,
    };
  });
};
