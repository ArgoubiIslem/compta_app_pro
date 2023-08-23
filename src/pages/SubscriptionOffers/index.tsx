import React from 'react'
import {Layout } from 'antd'
import './Style.less'
import AppHeader from '../LandingPage/header';
import AppHome from '../LandingPage/home';
import AboutApp from '../LandingPage/about';
import AppFooter from '../LandingPage/footer';
import AppContact from '../LandingPage/contact'
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
