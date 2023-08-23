import React from 'react'
import {Layout } from 'antd'
import './style.less'
import AppHeaderRH from './headerRH';
import AppHomeRH from './homeRH';
import AppFooter from '../footer';
import AppOffersRH from './offerRH'
const {Header,Content,Footer}=Layout

const index = () => {

  return (
    <Layout className="mainLayout">
    <div>
      <Header>
        <AppHeaderRH/>
      </Header>
      <Content>
      <section id="home">
        <AppHomeRH/>
      </section>
      <section id ="offers">
      <AppOffersRH/>
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
