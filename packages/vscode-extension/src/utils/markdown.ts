import * as vscode from 'vscode';
import { bigCamelize } from './tool';
import type {
  ComponentDesc,
  ComponentEvent,
  ComponentLibrary,
  ComponentProps,
  ComponentSlot,
} from '../types/vscode.type';

export const componentMdRender = (
  lib: ComponentLibrary,
  component: ComponentDesc
) => {
  const hoverContent = new vscode.MarkdownString('', true);
  hoverContent.appendCodeblock(
    `${bigCamelize(lib.prefix + component.key)}`,
    'typescript'
  );
  if (component.props && component.props.length > 0) {
    hoverContent.appendMarkdown(`@props——属性\n`);
    component.props?.forEach((x) => {
      const require = x.require ? '' : '?';
      hoverContent.appendCodeblock(
        `${x.name}${require}: ${x.type}\n`,
        'typescript'
      );
    });
  }
  if (component.event && component.event.length) {
    hoverContent.appendMarkdown(`@event——事件\n`);
    component.event.forEach((x) => {
      const require = x.require ? '' : '?';
      hoverContent.appendCodeblock(
        `${x.name}${require}: '${x.desc}'\n`,
        'typescript'
      );
    });
  }
  if (component.slot && component.slot.length > 0) {
    hoverContent.appendMarkdown(`@slot——插槽\n`);
    component.slot.forEach((x) => {
      hoverContent.appendCodeblock(`${x.name}: '${x.desc}'\n`, 'typescript');
    });
  }
  hoverContent.appendMarkdown(
    `\n文档：[${lib.name}-${bigCamelize(lib.prefix + component.key)}](${
      lib.docs + component.path
    })`
  );
  hoverContent.appendText('\n\r');
  return hoverContent;
};

export const propsMdRender = (props: ComponentProps, type = 'props') => {
  const hoverContent = new vscode.MarkdownString('', true);
  const require = props.require ? '' : '?';
  hoverContent.appendCodeblock(
    `(${type}) ${props.name}${require}:${props.type}`,
    'typescript'
  );
  hoverContent.appendText(`@desc——${props.desc}`);
  return hoverContent;
};

export const slotMdRender = (slot: ComponentSlot) => {
  const hoverContent = new vscode.MarkdownString('', true);
  hoverContent.appendCodeblock(`(slots) ${slot.name}`, 'typescript');
  hoverContent.appendText(`\n@desc——${slot.desc}\n`);
  return hoverContent;
};

export const eventMdRender = (event: ComponentEvent) => {
  const hoverContent = new vscode.MarkdownString('', true);
  hoverContent.appendCodeblock(`(events) ${event.name}`, 'typescript');
  hoverContent.appendText(`\n@desc——${event.desc}\n`);
  return hoverContent;
};
