import React, { useCallback } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import { history, useModel, useIntl } from 'umi';

import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';


export interface GlobalHeaderRightProps {
  menu?: boolean;
}


const loginOut = async () => {

  if (window.location.pathname !== '/user/login') {
    localStorage.clear();
    window.location.href='/welcome';
  }
};
const login = async () => {

  if (window.location.pathname !== '/user/login') {
    localStorage.clear();
    window.location.href='/user/login';
      
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState({ ...initialState, currentUser: undefined });
        loginOut();
        return;
      }
     
      history.push(`/account/${key}`);
    },
    [],
  );



  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
  
      
      <Menu.Item key="logout">
        <LogoutOutlined />
        {`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Sign out' })}`}
      </Menu.Item>
      
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSzp5msT5b7xo01jyGDrCsYq0ygg6KSe_ux0w&usqp=CAU" alt="avatar" />
        <span className={`${styles.name} anticon`}>{`${useIntl().formatMessage({ id: 'app.pwa.dashboard.Hello' })}`}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
