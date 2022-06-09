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
  default?: string | number | boolean | Array<any> | object;
  type?: string;
  desc: string;
  example?: string;
}
export interface ComponentEvent {
  name: string;
  desc: string;
  require?: boolean;
  type?: 'native' | 'custom';
  default?: string;
}

export interface ComponentSlot {
  name: string;
  desc: string;
  default?: string;
  slotProps?: any;
}
export interface ComponentDesc {
  key: string;
  path?: string;
  desc?: string;
  props?: ComponentProps[];
  event?: ComponentEvent[];
  slot?: ComponentSlot[];
  childComponent?: ComponentDesc[];
}

export type Component = Array<ComponentDesc>;

export interface EffectiveFile {
  components: Array<string>;
  snippts?: Array<string>;
}
export interface ComponentLibrary {
  name: string;
  docs: string;
  effectiveFile: EffectiveFile;
  prefix: string;
  components: Array<ComponentDesc>;
  snippts?: Array<any>;
}

export interface SmippetsItem {
  scope?: string;
  prefix: string;
  body: string | string[];
  description?: string;
}
export type Snippets = Record<string, SmippetsItem>;
