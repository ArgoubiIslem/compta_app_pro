import React from 'react'
import {Layout } from 'antd'
import './style.less'
import AppHeaderCompta from './headerCompta';
import AppHomeCompta from './homeCompta';
import AppFooter from '../footer';
import AppOffersCompta from './offerCompta'
const {Header,Content,Footer}=Layout

const index = () => {

  return (
    <Layout className="mainLayout">
    <div>
      <Header>
        <AppHeaderCompta/>
      </Header>
      <Content>
      <section id="home">
        <AppHomeCompta/>
      </section>
      <section id ="offers">
      <AppOffersCompta/>
      </section>
      </Content>
      <Footer>
        <AppFooter/>
      </Footer>
     </div>
     </Layout>
  )
}

export default index;
