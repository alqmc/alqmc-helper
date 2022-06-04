import { basename, resolve } from 'path';
import glob from 'fast-glob';
import * as vscode from 'vscode';
import { rootPath, snippetsPath } from '../config/path';
import { getSnipptes } from '../utils/getSnipptes';
export class NodeDependenciesProvider
  implements vscode.TreeDataProvider<CodeNodeViewItem>
{
  constructor() {}

  getTreeItem(node: CodeNodeViewItem): vscode.TreeItem {
    return node;
  }

  async getChildren(node?: CodeNodeViewItem): Promise<CodeNodeViewItem[]> {
    const snippetsFile = await glob('*.json', {
      cwd: snippetsPath,
      absolute: true,
    });
    return new Promise((resolve) => {
      if (node) {
        if (node.isSnipptes) {
          resolve([]);
        }
        this.getSnippte(
          snippetsFile.filter((x) => basename(x, '.json') === node.nodeName)
        ).then((treeNode) => {
          resolve(treeNode);
        });
      } else {
        let count = 0;
        const treeNode: CodeNodeViewItem[] = [];
        snippetsFile.forEach((x) => {
          this.getSnippte([x])
            .then((node) => {
              if (node.length > 0) {
                treeNode.push(
                  new CodeNodeViewItem(
                    basename(x, '.json'),
                    '',
                    1,
                    false,
                    basename(x, '.json')
                  )
                );
              }
            })
            .finally(() => {
              count++;
              if (snippetsFile.length === count) {
                resolve(treeNode);
              }
            });
        });
      }
    });
  }

  private getSnippte(snippetsFile: string[]): Promise<CodeNodeViewItem[]> {
    return new Promise((resolve) => {
      const treeNode: CodeNodeViewItem[] = [];
      let count = 0;
      snippetsFile.forEach(async (file) => {
        const snippets = await getSnipptes(file);
        if (snippets) {
          Object.keys(snippets).forEach((x) => {
            treeNode.push(
              new CodeNodeViewItem(
                snippets[x].prefix,
                snippets[x].description || '',
                0,
                true,
                basename(x, snippets[x].prefix),
                file
              )
            );
          });
        }
        count++;
        if (count === snippetsFile.length) {
          resolve(treeNode);
        }
      });
    });
  }
  static _onDidChangeTreeData: vscode.EventEmitter<
    CodeNodeViewItem | undefined | null | void
  > = new vscode.EventEmitter<CodeNodeViewItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    CodeNodeViewItem | undefined | null | void
  > = NodeDependenciesProvider._onDidChangeTreeData.event;
  static refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class CodeNodeViewItem extends vscode.TreeItem {
  isSnipptes = false;
  nodeName = '';
  url = '';
  constructor(
    label: string,
    description: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    isSnipptes: boolean,
    nodeName: string,
    resourceUri?: string
  ) {
    super(label, collapsibleState);
    this.tooltip = description;
    this.description = description;
    this.isSnipptes = isSnipptes;
    this.nodeName = nodeName;
    if (resourceUri) this.url = resourceUri;
    this.iconPath = {
      light: resolve(
        rootPath,
        `public/${this.isSnipptes ? 'code' : 'floder'}.svg`
      ),
      dark: resolve(
        rootPath,
        `public/${this.isSnipptes ? 'code' : 'floder'}.svg`
      ),
    };
    this.command = {
      title: 'open-file',
      command: 'alqmc-helper.open-file',
      arguments: [this.url, this.label],
    };
  }
}
