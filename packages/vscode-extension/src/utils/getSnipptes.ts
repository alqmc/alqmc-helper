import { readFile, writeFile } from 'fs/promises';
import { errorTip } from './tips';
import type { Snippets } from '../types/vscode.type';
export const getSnipptes = async (rootPath: string) => {
  try {
    const fileBuffer = await readFile(rootPath, 'utf-8');
    const snipptesList = fileBuffer
      ? (JSON.parse(fileBuffer.toString()) as Snippets)
      : null;
    return snipptesList;
  } catch (error) {
    errorTip(error as string);
  }
};

export const writeSnipptes = (dir: string, data: Snippets) => {
  writeFile(dir, JSON.stringify(data, null, 4)).catch((error) => {
    errorTip(error as string);
  });
};
