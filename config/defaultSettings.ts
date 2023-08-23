import { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { isNull } from 'lodash';
import { history } from 'umi';

export default {

  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'InnerERP',
  pwa: false,
  iconfontUrl: '/welcome',
} as LayoutSettings & {
  pwa: boolean;
};
