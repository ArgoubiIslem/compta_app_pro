import React from 'react';

import { BackTop } from 'antd';
import {FacebookOutlined,TwitterOutlined,LinkedinOutlined,ArrowUpOutlined}from'@ant-design/icons';

function AppFooter() {
  return (
    <div className="container-fluid">
      <div className="footer">
        <div className="logo">
          <a href="#home">InnerERP</a>
        </div>
        <ul className="socials">
          <li><a href="https://www.facebook.com/"><FacebookOutlined /></a></li>
          <li><a href="https://www.twitter.com/"><TwitterOutlined /></a></li>
          <li><a href="https://www.linkedin.com/"><LinkedinOutlined /></a></li>
        </ul>
        <div className="copyright">Copyright &copy; 2022 InnerERP</div>
        <BackTop>
          <div className="goTop"><ArrowUpOutlined /></div>
        </BackTop>
      </div>
    </div>
  );
}

export default AppFooter;
