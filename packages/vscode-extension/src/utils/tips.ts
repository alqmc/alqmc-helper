import * as vscode from 'vscode';
export const infoTip = (message: string) => {
  vscode.window.showInformationMessage(message);
};
export const worringTip = (message: string) => {
  vscode.window.showWarningMessage(message);
};
export const errorTip = (message: string) => {
  vscode.window.showErrorMessage(message);
};
