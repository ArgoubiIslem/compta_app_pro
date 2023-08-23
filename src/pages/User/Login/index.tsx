import { Button, Input, Typography, Layout, Row, Col, Form, Alert } from 'antd';
import React, { useContext, useState,useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as jwt_decode from 'jwt-decode';
import './../index.less';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import compta from './../images/compta-1.svg';
import account from './../images/compta-2.svg';
import { JwtContext } from '../../../provider/JwtContextProvider';
import { getPageQuery } from '@/utils/utils';
const { Title } = Typography;
const { Content } = Layout;
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL = 'http://localhost:8000/api/v1'
const API_URL_LOGIN = `${API_URL}/jwt/token`
const API_URL_ARGUMENT = `${API_URL}/arguments`

interface ValInt {
  email: string,
  password: string
}
let auth: boolean = false;
export const Login: React.FC = () => {
  const jwtoken = useContext(JwtContext);
  const [error, setError] = useState(jwtoken.isAuthenticated)
  const [jwt, setJwt] = useState(jwtoken)
  


  function successAuth() {
    jwtoken.changeAuth();
    auth = true;

  }
  
 
  function back(){
    window.location.href='/accueil'
    
  }
  console.log(auth);

  const onFinish: (val: ValInt) => void = (values: ValInt) => {
    axios.post(`${API_URL_LOGIN}/`, {
      email: values.email,
      password: values.password
    })
      .then(response => {
        console.log(response.data)
        jwt.jwtAccess = response.data.access
        jwt.jwtRefresh = response.data.refresh
        window.localStorage.setItem('jwtAccess', jwt.jwtAccess);
        window.localStorage.setItem('jwtRefresh', jwt.jwtRefresh);

        // window.location.href='/welcome'

        successAuth();

        if (auth) {
          let decoded = jwt_decode(jwt.jwtAccess)
          const config = {
            headers: { Authorization: `Bearer ${jwt.jwtAccess}` }
          };
          console.log(decoded, 'decoded')
          axios.get(`${API_URL_ARGUMENT}/?user=${decoded.user_id}`, config)
            .then(response => {
              // console.log(response.data.results[0])
              const result = response.data.results && response.data.results[0]

              window.localStorage.setItem('argument', result.id)
              window.localStorage.setItem('organization', result.organization.id)
              window.localStorage.setItem('fiscal_year', result.fiscal_year.id)
              window.localStorage.setItem('user_id', decoded.user_id)
              console.log(window.localStorage)
              window.location.href = '/welcome'
              process.env.MODULE="RH";
            }).catch(error1 => {
              console.log(error1)
            })
        };
      }).catch(error2 => {
        console.log(error2)
        setError(true)
      });


  };
 
 


  return (
    (auth === false) ? <Layout className="layout" style={{ backgroundColor: '#FAFBFC', height: '100vh' }}>

      <Title level={2} style={{ color: '#0747a6', padding: '10px 25px', textAlign: 'center' }}>InnERP</Title>
      <img src={compta} className="ill-1" alt='Compta-1' />
      <img src={account} className="ill-2" alt='Compta-2' />
      <Content className="site-layout-content" style={{ padding: '50px 20px 150px 20px', maxHeight: '450px', marginTop: 0 }}>
        <div className="steps-content">
          <Title level={3} style={{ textAlign: 'center' }}>Connectez-vous</Title>
          <p style={{ textAlign: 'center' }}>Pour accéder a votre compte</p>
        </div>
        <Form
          name="normal_login"
          className="login-form steps-action"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            value="ok"
            rules={[
              {
                required: true,
                message: 'Entrez votre email!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email!" />
          </Form.Item>


          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Entrez votre mot de passe!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          {(error === true) ? <Alert style={{ marginTop: '25px' }} message="Nom d'utilisateur ou Mot de passe incorrect" type="error" /> : ''}

          <Button type="primary" htmlType="submit">
            Continuer
          </Button>

          <Row>
            <Col span={12} style={{ marginTop: '25px', textAlign: 'left' }}><Link to='/user/forgot-password' type="link">Mot de passe oublié ?</Link></Col>
            <Col span={12} style={{ marginTop: '25px', textAlign: 'right' }}><Link onClick={back} type="link">Créer un compte</Link></Col>
          </Row>
        </Form>
      </Content>
    </Layout> : <div></div>

  );
};


export default Login;
