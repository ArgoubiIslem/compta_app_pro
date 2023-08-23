import React, { useState, useEffect } from 'react';
import { Anchor, Drawer, Button } from 'antd';
import './style.less'
import { useHistory } from "react-router-dom";
const { Link } = Anchor;

function AppHeader() {

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
 
  return (
    <div className="container-fluid">
      <div className="header">
        <div className="logo">
          <a href="#">INNERP</a>
        </div>
        <div className="mobileHidden">
          <Anchor targetOffset="65">
            <Link href="#home" title="Accueil" />
            <Link href="#about" title="À propos" />
            <Link href="#contact" title="Contact" />
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
            <Link href="#hero" title="Accueil" />
            <Link href="#about" title="À propos" />
            <Link href="#contact" title="Contact" />
            <Button type="primary" size="small" onClick={handleClick} >Login</Button>
            </Anchor>
          </Drawer>
        </div>
      </div>
    </div>
  );
}

export default AppHeader;
