import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2020"
    links={[
      {
        key: 'InnerERP1',
        title: 'InnerERP',
        href: '#',
        blankTarget: true,
      },
      {
        key: 'InnerERP2',
        title: <GithubOutlined />,
        href: '#',
        blankTarget: true,
      },
      {
        key: 'InnerERP3',
        title: 'InnerERP',
        href: '#',
        blankTarget: true,
      },
    ]}
  />
);
