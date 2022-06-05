import * as vscode from 'vscode';
import { getGlobalConfig } from '../utils/vscode';
import libs from '../config/libs';
import type { ComponentLibrary } from '../types/vscode.type';
const createHandler = (lib: ComponentLibrary) => {
  return (document: vscode.TextDocument, position: vscode.Position) => {
    const word = document.getText(document.getWordRangeAtPosition(position));
    const line = document.lineAt(position);
    const hoverRender = Object.keys(lib.components)
      .filter((x) => {
        const reg = new RegExp(lib.prefix + x);
        const componentLink = line.text.match(reg) ?? [];
        return componentLink.length > 0;
      })
      .map((x) => {
        let propsText = '';
        if (word && lib.components[x].props) {
          lib.components[x].props!.forEach((x) => {
            if (x.name === word) {
              propsText = `#### ${word}:\n ${x.desc}`;
            }
          });
        }
        const titleText = `#### ${lib.prefix + x}（${lib.name}）`;
        const docsText = `#### 文档 \n${lib.docs + lib.components[x].path}`;
        return `${propsText}\n${titleText}\n${docsText}`;
      })
      .join(',');

    if (hoverRender) return new vscode.Hover(hoverRender);
  };
};

export const HoverProvider = () => {
  const disabledList = getGlobalConfig('alqmcHelper.disabled') as string[];
  const effectiveLib = Object.keys(libs).filter(
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
