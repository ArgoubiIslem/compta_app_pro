
import {Layout } from 'antd'
import './style.less'
import AppHeader from './header';
import AppHome from './home';
import AboutApp from './about';
import AppFooter from './footer';
import AppContact from './contact'
import React, {useState, useEffect } from 'react';
const {Header,Content,Footer}=Layout
const index = () => {

  return (
  <Layout className="mainLayout">
       <div>
         <Header>
      <AppHeader/>
      </Header>
      <Content>
      <section id="home">
        <AppHome/>
      </section>
        <AboutApp/>
        <AppContact/>
      </Content>
      <Footer>
        <AppFooter/>
      </Footer>
     </div>


 </Layout>
  )
}

export default index;
