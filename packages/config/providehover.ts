import * as vscode from 'vscode';
// import { getGlobalConfig } from '../utils/vscode';
import type { RegisterHoverProviderOptions } from '../types/vscode.type';

const provideHover = (
  document: vscode.TextDocument,
  position: vscode.Position
) => {
  const line = document.lineAt(position);
  const componentLink = line.text.match(/alqmc/) ?? [];
  if (componentLink.length > 0) return new vscode.Hover('alqmc');
};
export const getProvideHovers = async (): Promise<
  RegisterHoverProviderOptions[]
> => {
  //   const disabledList = getGlobalConfig('alqmcHelper.disabled');
  return [
    {
      file: 'typescript',
      handler: { provideHover },
    },
  ];
};
