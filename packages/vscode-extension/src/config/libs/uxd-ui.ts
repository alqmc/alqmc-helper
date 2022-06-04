import type { ComponentLibrary } from '../../types/vscode.type';
export const uxdUi: ComponentLibrary = {
  name: 'UXD-UI',
  docs: 'https://uxd.100credit.cn/uxd-ui/',
  effectiveFile: ['vue', 'typescript', 'javascript'],
  prefix: 'u-',
  components: {
    button: {
      path: 'views/components/button.html',
      props: [
        {
          name: 'type',
          desc: '按钮类型，可设置为default,primary,success,info,warning,danger,dashed,text',
        },
      ],
    },
    icon: {
      path: 'views/components/icon.html',
      props: [],
    },
    alert: {
      path: 'views/components/alert.html',
      props: [],
    },
  },
  snippts: [],
};
export default uxdUi;
