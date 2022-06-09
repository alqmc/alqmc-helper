import type * as vscode from 'vscode';
export interface RegisterCommandsOptions {
  name: string;
  handler: (...args: any[]) => any;
}
export interface RegisterHoverProviderOptions {
  file: Array<string>;
  handler: vscode.HoverProvider;
}

export interface RegisterCompletionOptions {
  file: string[];
  provider: vscode.CompletionItemProvider<vscode.CompletionItem>;
}
export interface RegisterTreeDataOptions {
  viewID: string;
  treeDataProvider: vscode.TreeDataProvider<unknown>;
}

export interface ComponentProps extends Record<string, any> {
  name: string;
  require?: boolean;
  default?: string | number | boolean;
  type?: string;
  desc: string;
}
export interface ComponentDesc {
  path: string;
  props?: ComponentProps[];
  event?: any;
  slot?: any;
  childComponent: ComponentDesc[];
}

export type componentMap = Record<string, ComponentDesc>;
export interface ComponentLibrary {
  name: string;
  docs: string;
  effectiveFile: Array<string>;
  prefix: string;
  components: componentMap;
  snippts?: Array<any>;
}

export interface SmippetsItem {
  scope?: string;
  prefix: string;
  body: string | string[];
  description?: string;
}
export type Snippets = Record<string, SmippetsItem>;
