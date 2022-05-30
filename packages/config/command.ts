import { createLog } from '../command/fast-log';
import { createSnippts } from '../command/snippts-manage';
export const commandOptions = [
  {
    name: 'alqmc-helper.fast-log',
    handler: createLog,
  },
  {
    name: 'alqmc-helper.create-snippets',
    handler: createSnippts,
  },
];
