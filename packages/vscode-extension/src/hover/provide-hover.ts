import * as vscode from 'vscode';
import { getGlobalConfig } from '../utils/vscode';
import libs from '../config/libs';
import { bigCamelize, kebabCase } from '../utils/tool';
import type { ComponentLibrary } from '../types/vscode.type';

/**
 * 找到前置未闭合的标签
 * @param document
 * @param position
 * @returns
 */
const findTag = (
  document: vscode.TextDocument,
  position: vscode.Position
): string | null => {
  const line = document.lineAt(position);
  const tagStart = line.text.indexOf('<');
  const tagReg = /<[^>]*/;
  if (tagStart !== -1) {
    let tag: null | string = null;
    const tagExpMatchArray = line.text.match(tagReg);
    if (tagExpMatchArray && tagExpMatchArray.length > 0) {
      tag = tagExpMatchArray[0].replace('<', '');
    }
    return tag;
  } else {
    const newPosition = new vscode.Position(
      position.line - 1,
      position.character
    );
    return findTag(document, newPosition);
  }
};
const createHandler = (lib: ComponentLibrary) => {
  return (document: vscode.TextDocument, position: vscode.Position) => {
    const word = document.getText(document.getWordRangeAtPosition(position));
    const line = document.lineAt(position);
    const tag = findTag(document, position);
    const hoverRender = Object.keys(lib.components)
      .filter((x) => {
        const reg = kebabCase(lib.prefix + x);
        const regBig = bigCamelize(lib.prefix + x);
        if (line.text.includes(reg) || line.text.includes(regBig)) return true;
        if (tag && (tag.includes(reg) || tag.includes(regBig))) return true;
        return false;
      })
      .map((x) => {
        let propsText = '';
        if (word && lib.components[x].props) {
          lib.components[x].props!.forEach((x) => {
            if (x.name.includes(word)) {
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
