import React from 'react';

import { Form, Input, Button, Checkbox } from 'antd';
const { TextArea } = Input;

function AppContact() {
  return (
    <div id="contact" className="block contactBlock">
      <div className="container-fluid">
        <div className="titleHolder">
          <h2>Contactez nos experts</h2>
          <p>Envoyez-nous un message ici</p>
        </div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="fullname"
            rules={[
              {
                required: true,
                message: 'Entrez votre nom et prénom !'
              }]
            }
          >
            <Input placeholder="Nom et prénom" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Entrez un E-mail valide!',
              },
              {
                required: true,
                message: 'Entrez votre E-mail!',
              },
            ]}
          >
            <Input placeholder="Email"/>
          </Form.Item>
          <Form.Item
            name="telephone"
          >
            <Input placeholder="Téléphone" />
          </Form.Item>
          <Form.Item
            name="subject"
          >
            <Input placeholder="Sujet" />
          </Form.Item>
          <Form.Item
            name="message"
          >
            <TextArea placeholder="Message" />
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              noStyle
              rules={[
                { validator:(_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement') },
              ]}
            >
              <Checkbox>I agree with terms and conditions.</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default AppContact;
