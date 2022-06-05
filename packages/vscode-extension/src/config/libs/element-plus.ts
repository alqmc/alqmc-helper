import type { ComponentLibrary } from '../../types/vscode.type';
export const elementPlus: ComponentLibrary = {
  name: 'ElementPlus',
  docs: 'https://element-plus.gitee.io/zh-CN/',
  effectiveFile: ['vue', 'typescript', 'javascript'],
  prefix: 'el-',
  components: {
    button: {
      path: 'views/components/button.html',
      props: [
        {
          name: 'type',
          require: true,
          desc: '按钮类型',
        },
        {
          name: 'size',
          default: 'mini',
          require: false,
          desc: '按钮大小',
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
};
export default elementPlus;
