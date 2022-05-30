import type * as vscode from 'vscode';
export interface RegisterCommandsOptions {
  name: string;
  handler: (...args: any[]) => any;
}
export interface RegisterHoverProviderOptions {
  file: Array<string> | string;
  handler: vscode.HoverProvider;
}
export interface ComponentLibrary {
  name: string;
  docs: string;
  effective: Array<string>;
  prefix: string;
  components: Array<any>;
  snippts?: Array<any>;
}
