import * as vscode from 'vscode';
import { getGlobalConfig } from '../utils/vscode';
import libs from '../config/libs';
import type { ComponentLibrary } from '../types/vscode.type';
const componentsLibs = ['uxdUi'];
const createHandler = (lib: ComponentLibrary) => {
  return (document: vscode.TextDocument, position: vscode.Position) => {
    const line = document.lineAt(position);
    const hoverRender = Object.keys(lib.components)
      .filter((x) => {
        const reg = new RegExp(lib.prefix + x);
        const componentLink = line.text.match(reg) ?? [];
        return componentLink.length > 0;
      })
      .map((x) => {
        return `### ${lib.name}\n - ${lib.prefix + x}: ${
          lib.docs + lib.components[x].path
        }
        `;
      })
      .join(',');
    if (hoverRender.length > 0) {
      console.log('hover已生效');
      console.log(hoverRender);
      return new vscode.Hover(hoverRender);
    }
  };
};

export const HoverProvider = () => {
  const disabledList = getGlobalConfig('alqmcHelper.disabled') as string[];
  const effectiveLib = componentsLibs.filter(
    (x) => !disabledList || !disabledList.includes(x)
  );
  const provideList = effectiveLib.map((x) => libs[x]);
  return provideList.map((lib) => {
    return {
      key: lib.name,
      file: lib.effectiveFile,
      handler: {
        provideHover: createHandler(lib),
      },
    };
  });
};
