import {Button,Input, Typography, Layout, Row, Col , Form, Alert} from 'antd';
import React, {  Fragment, useState } from "react";
import {Link} from 'react-router-dom'
import axios from 'axios';
import './../../index.less';
import { LockOutlined } from '@ant-design/icons';
import compta from'./../../images/compta-1.svg';
import account from'./../../images/compta-2.svg';

const { Title } = Typography;
const { Content} = Layout;
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL ='http://localhost:8000/api/v1'
const API_URL_RESET = `${API_URL}/auth/password/reset/confirm`;

const Reset = () => {
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const onFinish = (values:any) => {
    const link = window.location.href
    // get the uid from link
    var startUid = link.indexOf("uid=") + 4;
    var endtUid = link.indexOf("token") - 1;
    const uid = link.slice(startUid, endtUid);

    // get the token from link
    var startToken = link.indexOf("token=") + 6;
    var endtToken = link.length - 1;
    const token = link.slice(startToken, endtToken);

    axios.post(`${API_URL_RESET}/`, {
      new_password1 : values.password,
      new_password2 : values.confirm,
      uid : uid,
      token: token
    })
    .then(response => {
      setSuccess(response.data.detail)
    }).catch(error => {
      console.log(error.response.data.new_password2)
      setError(error.response.data)    
    });
  };

  const errorList:{} = error
  const errorItems=[];
  for (const property in errorList) {
    for(let i = 0; i < errorList[property].length; i++){
      errorItems.push(errorList[property][i])
    }
  
  }

  const errorMessages = (errorItems.map(item =>{
    return(
        <Alert key ={item} type="error" message={item} showIcon banner />
    )
  }))

  return (
      <Layout className="layout" style={{  backgroundColor : '#FAFBFC',  height: '100vh' }}>
        <Title level={2} style={{ color: '#0747a6' , padding: '10px 25px', textAlign:'center'}}>InnERP</Title>
        <img src={compta} className="ill-1"/>
        <img src={account} className="ill-2"/>
        <Content className ="site-layout-content" style={{ padding: '50px 20px 150px 20px', maxHeight:'400px',marginTop: 0}}>
          <div className="steps-content">
            <Title level={3} style={{ textAlign:'center'}}>Changer mot de passe </Title>
            <p style={{ textAlign:'center'}}>Saisissez un nouveau mot de passe pour votre compte</p>
            </div>
              <Form
                onFinish = {onFinish}
                >
                 {(!success) ? <Fragment>
                <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: 'Entrez votre mot de passe !',
                          },
                        ]}
                        hasFeedback
                      >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Entrez votre mot de passe "/>
                      
                      </Form.Item>

                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                            required: true,
                            message: 'SVP confirmer votre mot de passe !',
                            },
                            ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                                }
                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                            }),
                        ]}
                        >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Confirmer votre mot de passe" />
                    </Form.Item>
                    {errorMessages}
                  <Button type="primary" htmlType="submit">
                    Valider
                  </Button>
                </Fragment>  : <Alert style={{ marginTop:'25px'}} message={success} type="success" />}
                <Row>
                  <Col span={12} style={{ marginTop:'25px', textAlign: 'left' }}><Link to='/user/login' type="link">Connexion a un compte existant</Link></Col>
                  <Col span={12} style={{ marginTop:'25px', textAlign: 'right' }}><Link to='/user/register' type="link">Créer un compte</Link></Col>
                </Row>
            </Form>
          </Content>
      </Layout>
  );
  
}
export default Reset;