import * as vscode from 'vscode';
import {
  findTag,
  getGlobalConfig,
  getWordRangeAtPosition,
} from '../utils/vscode';
import libs from '../config/libs';
import { bigCamelize, kebabCase } from '../utils/tool';
import { docsMdRender, propsMdRender } from '../utils/markdown';
import type {
  ComponentDesc,
  ComponentLibrary,
  RegisterHoverProviderOptions,
} from '../types/vscode.type';

/**
 * 获取当前匹配组件
 * @param tag
 * @param prefix
 * @param components
 * @returns
 */
const getCurrentComponent = (
  tag: string,
  prefix: string,
  components: ComponentDesc[]
) => {
  let isChild = false;
  const component = components.filter((component) => {
    const reg = kebabCase(prefix + component.key);
    const regBig = bigCamelize(prefix + component.key);
    if (tag && (tag.includes(reg) || tag.includes(regBig))) return true;
    if (component.childComponent) {
      const child = getCurrentComponent(tag, prefix, component.childComponent);
      if (child) {
        isChild = true;
        return true;
      }
    }
    return false;
  });
  if (component.length > 0)
    return {
      isChild,
      component: component[0],
    };
};

/**
 * 创建组件提示
 * @param lib
 * @returns
 */
const createComponentHover = (
  lib: ComponentLibrary
): RegisterHoverProviderOptions => {
  const handler = (
    document: vscode.TextDocument,
    position: vscode.Position
  ) => {
    const { prefix, components, docs } = lib;
    const tag = findTag(document, position);
    if (!tag) return;
    const currentComponent = getCurrentComponent(tag, prefix, components);
    if (!currentComponent) return;
    const componentRender = `#### 组件: ${bigCamelize(
      lib.prefix + currentComponent.component.key
    )}`;
    const childComponentRender = '';
    const titleRender = ``;
    let docsRender = ``;
    let propsRender = '';
    const line = document.lineAt(position);

    if (line) {
      const componentTag = lib.prefix + currentComponent.component.key;
      const bigCamelizeTag = bigCamelize(componentTag);
      const text =
        line.text.includes(bigCamelizeTag) || line.text.includes(componentTag);
      if (text)
        docsRender = docsMdRender(
          lib.name,
          docs + currentComponent.component.path
        );
    }

    const word = getWordRangeAtPosition(document, position);
    if (
      currentComponent.isChild &&
      currentComponent.component.childComponent &&
      currentComponent.component.childComponent.length > 0
    ) {
      currentComponent.component.childComponent.forEach((x) => {
        if (x.props) {
          x.props.forEach((prop) => {
            if (prop.name === word) {
              propsRender = propsMdRender([prop]);
            }
          });
        }
      });
    } else {
      currentComponent.component.props?.forEach((x) => {
        if (x.name === word) {
          propsRender = propsMdRender([x]);
        }
      });
    }
    let hoverRender = '';
    if (childComponentRender) hoverRender += `\n\n${childComponentRender}`;
    if (componentRender) hoverRender += `\n\n${componentRender}`;
    if (titleRender) hoverRender += `\n\n${titleRender}`;
    if (docsRender) hoverRender += `\n\n${docsRender}`;
    if (propsRender) hoverRender = propsRender;
    console.log(hoverRender);
    const md = new vscode.MarkdownString(hoverRender);
    md.isTrusted = true;
    return new vscode.Hover(md);
  };
  return {
    file: lib.effectiveFile.components,
    handler: {
      provideHover: handler,
    },
  };
};
/**
 * 创建插槽提示
 * @param lib
 * @returns
 */
const createSlotHover = (
  lib: ComponentLibrary
): RegisterHoverProviderOptions | undefined => {
  if (!lib.snippts) return;
  const handler = (
    document: vscode.TextDocument,
    position: vscode.Position
  ) => {
    return new vscode.Hover('');
  };
  return {
    file: lib.effectiveFile.snippts || lib.effectiveFile.components,
    handler: {
      provideHover: handler,
    },
  };
};

// 创建提示Handler
const createHandler = (
  lib: ComponentLibrary
): RegisterHoverProviderOptions[] => {
  const hoverList = [];
  const componentHover = createComponentHover(lib);
  if (componentHover) hoverList.push(componentHover);
  const slotHover = createSlotHover(lib);
  if (slotHover) hoverList.push(slotHover);
  return hoverList;
};

/**
 * 创建代码hover提示
 * @returns
 */
export const getProvideHovers = () => {
  const disabledList = getGlobalConfig('alqmcHelper.disabled') as string[];
  const effectiveLib = Object.keys(libs).filter(
    (x) => !disabledList || !disabledList.includes(x)
  );
  const provideList = effectiveLib.map((x) => libs[x]);
  const hoverList: RegisterHoverProviderOptions[] = [];
  provideList.forEach((lib) => {
    hoverList.push(...createHandler(lib));
  });
  return hoverList;
};
