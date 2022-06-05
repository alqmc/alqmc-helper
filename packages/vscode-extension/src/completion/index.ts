import * as vscode from 'vscode';
import libs from '../config/libs';
import { bigCamelize, kebabCase } from '../utils/tool';
import type {
  ComponentLibrary,
  RegisterCompletionOptions,
} from '../types/vscode.type';

const getResolveCompletionItem = (lib: ComponentLibrary) => {
  return (item: vscode.CompletionItem) => {
    const name = kebabCase(<string>item.label).slice(lib.prefix.length);
    const descriptor = lib.components[name];
    const propText = descriptor.props
      ? descriptor.props
          ?.filter((x) => x.require)
          .map((x) => `${x.name}='${x.default || null}'`)
      : [];
    const tagSuffix = `</${item.label}>`;
    item.insertText = `<${item.label} ${propText.join(' ')}>${tagSuffix}`;
    return item;
  };
};
const getProvideCompletionItems = (lib: ComponentLibrary) => {
  return () => {
    const completionItems: vscode.CompletionItem[] = [];
    Object.keys(lib.components).forEach((key: string) => {
      completionItems.push(
        new vscode.CompletionItem(
          `${lib.prefix + key}`,
          vscode.CompletionItemKind.Field
        ),
        new vscode.CompletionItem(
          bigCamelize(`${lib.prefix + key}`),
          vscode.CompletionItemKind.Field
        )
      );
    });
    return completionItems;
  };
};

export const completionOptions: RegisterCompletionOptions[] = [];

export const getCompletionOptions = (): RegisterCompletionOptions[] => {
  return Object.keys(libs).map((x) => {
    return {
      file: libs[x].effectiveFile.filter((x) => x === 'vue'),
      provider: {
        provideCompletionItems: getProvideCompletionItems(libs[x]),
        resolveCompletionItem: getResolveCompletionItem(libs[x]),
      },
    };
  });
};
