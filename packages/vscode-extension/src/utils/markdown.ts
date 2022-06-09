import type { ComponentProps } from '../types/vscode.type';

export const docsMdRender = (name: string, url: string) => {
  return `[${name}](${url})`;
};
export const propsMdRender = (props: ComponentProps[]) => {
  let text = `|名称|说明|类型|默认值|\n|----|----|----|----|`;
  props.forEach((x) => {
    text += `\n|${x.name}|${x.desc}|${x.type || '-'}|${x.default || '-'}|`;
  });
  return text;
};
