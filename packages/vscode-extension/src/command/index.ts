import { CodeTreeProvider } from '../menu-view';
import { createLog } from './fast-log';
import { createSnippts } from './snippts-manage';
import { openFile } from './open-file';
export const commandOptions = [
  {
    name: 'alqmc-helper.fast-log',
    handler: createLog,
  },
  {
    name: 'alqmc-helper.create-snippets',
    handler: createSnippts,
  },
  {
    name: 'alqmc-helper.open-file',
    handler: openFile,
  },
  {
    name: 'alqmc-helper.refreshEntry',
    handler: () => CodeTreeProvider.refresh(),
  },
];
