import React, { useState } from 'react';
import { Anchor, Drawer, Button } from 'antd';
import './style.less'
import { useHistory } from "react-router-dom";
const { Link } = Anchor;

function AppHeaderCompta() {

  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  function handleClick(){
    history.push("user/login");
  }
  function handleClickHome(){
    history.push("/accueil");
  }
  return (
    <div className="container-fluid">
      <div className="header">
        <div className="logo">
          <a onClick={handleClickHome} >INNERP</a>
        </div>
        <div className="mobileHidden">
          <Anchor targetOffset="65">
            <Button type="primary" size="middle" onClick={handleClick} >Login</Button>
          </Anchor>
        </div>
        <div className="mobileVisible">
          <Button type="primary" onClick={showDrawer}>
            <i className="fas fa-bars"> </i>
          </Button>
          <Drawer
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
          >
            <Anchor targetOffset="65">
            <Link title="Accueil" />
            <Button type="primary" size="small" onClick={handleClick} >Login</Button>
            </Anchor>
          </Drawer>
        </div>
      </div>
    </div>
  );
}

export default AppHeaderCompta;
