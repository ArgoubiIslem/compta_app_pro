import {Button,Input, Typography, Layout, Row, Col , Form, Alert} from 'antd';
import React, {  Fragment, useState } from "react";
import {Link} from 'react-router-dom'
import axios from 'axios';
import './../index.less';
import { UserOutlined } from '@ant-design/icons';
import compta from'./../images/compta-1.svg';
import account from'./../images/compta-2.svg';

const { Title } = Typography;
const { Content} = Layout;
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL ='http://localhost:8000/api/v1'
const API_URL_PASSWORD = `${API_URL}/auth/password/reset`;

const Password = () => {
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const onFinish = (values:any) => {
    axios.post(`${API_URL_PASSWORD}/`, {
      email : values.email,
    })
    .then(response => {
      console.log(response)
      setSuccess(response.data.detail)

    }).catch(error => {
      setError(true)
    });
  };

  return (
     <Layout className="layout" style={{  backgroundColor : '#FAFBFC',  height: '100vh' }}>
        <Title level={2} style={{ color: '#0747a6' , padding: '10px 25px', textAlign:'center'}}>InnERP</Title>
        <img src={compta} className="ill-1"/>
        <img src={account} className="ill-2"/>
        <Content className ="site-layout-content" style={{ padding: '50px 20px 150px 20px', maxHeight:'400px',marginTop: 0}}>
          <div className="steps-content">
            <Title level={3} style={{ textAlign:'center'}}>Réinitialiser votre mot de passe </Title>
            <p style={{ textAlign:'center'}}>Saisissez votre numéro de téléphone ou votre  <br/> adresse e-mail de récupération</p>
            </div>
            <Form
                onFinish = {onFinish}
                >
               {(!success) ? <Fragment>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: 'Entrez votre adresse e-mail de récupération!',
                      },
                    ]}
                  >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Entrez votre E-mail ici" />
                  </Form.Item>
                  {(error) ? <Alert style={{ marginTop:'25px'}} message={error} type="error" /> : ''}
                  <Button type="primary" htmlType="submit">
                    Valider
                  </Button>
                </Fragment> : <Alert style={{ marginTop:'25px'}} message={success} type="success" />}
                <Row>
                  <Col span={12} style={{ marginTop:'25px', textAlign: 'left' }}><Link to='/' type="link">Connexion a un compte existant</Link></Col>
                  <Col span={12} style={{ marginTop:'25px', textAlign: 'right' }}><Link to='/register' type="link">Créer un compte</Link></Col>
                </Row>
            </Form> 
          </Content>
      </Layout> 
  );
  
}
export default Password;