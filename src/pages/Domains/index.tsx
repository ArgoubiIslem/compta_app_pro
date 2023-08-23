import React, { Component, useContext, useEffect, useState, useRef } from 'react';
import { Table, Form, Card, Modal, Button, Space, Typography, Input, Alert, Drawer } from 'antd';
import './style.less'
import axios from 'axios'
import JwtContextProvider, { JwtContext } from '../../provider/JwtContextProvider';
const { Title } = Typography;
//j'ai pas encore ajouté ajouter un fichier .env
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL ='http://localhost:8000/api/v1'
const API_URL_DOMAINS = `${API_URL}/domains`

interface props{
  item : {
    id:number,
    code : number,
    name :string
  }
}

const Domains: React.FC <props> = () => {
  const [alert, setAlert] = useState([{}])
  const Edit : React.FC <props>= (props) => {
    const [visible, setVisible] = useState(false)
    const [code, setCode] = useState(props.item.code)
    const [name, setName] = useState(props.item.name)
    const status  = useContext(JwtContext);
    const token  = status.jwtAccess;

    const showDrawer = () => {
      setVisible(true);
    };

    const onClose = () => {
      setVisible(false);
    };

    const handleCancel = () => {
      setVisible(false)
    };



    const options:any  = {
      url: `${API_URL_DOMAINS}/${props.item.id}/`,
      method: 'PATCH',
      data: {
          code: code,
          name: name
          },
          headers: { Authorization: `Bearer ${token}` }

      };

    const onFinishEdit = (values: any) => {
      axios(options)
      .then(response =>{
        console.log('patch ok')
        console.log(response)
        setAlert(['edit', props.item.name]);

        })
      .catch(error => {
          console.log('patch error')
          console.log(error.response)
      })
      setVisible(false)
    };

      return (
        <div>
          <Button style={{marginTop : 0, width:'auto', backgroundColor:'#faad14', border:0}}  type="primary" onClick={showDrawer}>
            Editer
          </Button>
          <Drawer
            title="Ajouter un domaine"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
          >
      <Form
        name="control-ref"
        onFinish={onFinishEdit}
      >
      <Form.Item
          initialValue= {props.item.code}
          onChange = {(v:any) => setCode(v.target.value)}
          name="code"
          rules={[
            {
              required: true,
              message: 'Entrez le code du domaine!',
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <br/>
        <Form.Item
         initialValue= {props.item.name}
          name="name"
          onChange = {(v:any) => setName(v.target.value)}

          rules={[
            {
              required: true,
              message: 'Entrez le nom du domaine!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Button key="back" onClick={handleCancel}>
          Retour
        </Button>,
        <Button htmlType="submit" type="primary">
          Valider
        </Button>
      </Form>
          </Drawer>
        </div>
      );

  }
  const Delete :React.FC <props> = (props) => {
    const [visible, setVisible] = useState(false)
    const status  = useContext(JwtContext);
    const token  = status.jwtAccess;
    const showModal = () => {
      console.log(props.item.id)
      setVisible(true)
    };
    const handleCancel = () => {
      setVisible(false)
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const handleOk = (values:any) => {
      axios.delete(`${API_URL_DOMAINS}/${props.item.id}`, config)
      .then(response => {
        console.log(response)
        setVisible(false)
        setAlert(['delete', props.item.name]);

      }).catch(error => {
        console.log(error)
        console.log(config)
      });
    }
      return (
        <div>
          <Button style={{marginTop : 0, width:'auto', border:0}} type="primary" danger onClick={showModal}>
            Supprimer
          </Button>
          <Modal
            title="Supprime un domaine"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Retour
              </Button>,
              <Button key="submit" type="primary" onClick={handleOk}>
                Submit
              </Button>,
            ]}
          >
            Etes-vous sûr que vous voulez supprimer {props.item.name}
          </Modal>
        </div>
      );
  }
  const Add = () => {
    const [visible, setVisible] = useState(false)
    const status  = useContext(JwtContext);
    const token  = status.jwtAccess;

    const showDrawer = () => {
      setVisible(true);
    };

    const onClose = () => {
      setVisible(false);
    };

    const handleCancel = () => {
      setVisible(false)
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const onFinish = (values:any) => {
      axios.post(`${API_URL_DOMAINS}/`, {
        code : values.code,
        name : values.name
      },config)
      .then(response => {
        console.log(response)
        setVisible(false)
        setAlert(['add', values.name]);

      }).catch(error => {
        console.log(error.response)
        console.log(config)
      });
    }
    return (
        <div>
          <Button style={{float:'right'}} type="primary" type="primary" onClick={showDrawer}>
            Ajouter
          </Button>
          <Drawer
            title="Ajouter un domaine"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
          >
           <Form
              onFinish={onFinish}
            >
            <Form.Item
                name="code"
                label="Code : "
                rules={[
                  {
                    required: true,
                    message: 'Entrez le code du domaine!',
                  },
                ]}

              >
              <Input placeholder="Code"/>
              </Form.Item>
              <Form.Item
                name="name"
                label="Name : "

                rules={[
                  {
                    required: true,
                    message: 'Entrez le nom du domaine!',
                  },
                ]}
              >
                <Input placeholder="Name"/>
              </Form.Item>
              <Button key="back" onClick={handleCancel}>
                Retour
              </Button>,
              <Button htmlType="submit" type="primary">
                Valider
              </Button>
            </Form>
          </Drawer>
        </div>
      );

  }
  const Get = () => {

  const [data, setData] = useState([])
  const status  = useContext(JwtContext);
  const token  = status.jwtAccess;
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      defaultSortOrder: 'ascend',
      sorter: (a:any, b:any) => a.id - b.id,

    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'age',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'age',
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      render: (text:any, record:any) => (
        <Space>
          <Delete item ={record}/>
          <Edit item ={record}/>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    console.log(config)
    axios.get(`${API_URL_DOMAINS}/`, config)
    .then(response => {
        setData(response.data.results);
    }).catch(error => {
    });
  },[alert]);

    return(
      <Table style={{marginTop : 75}} rowKey="id" bordered columns={columns} dataSource={data} />
    )
  }

  return(
    <JwtContextProvider>
    <Card>
      <Title level={2}>Domains</Title>
      {(alert[0] === 'add') ?  <Alert message={`${alert[1]} a été créé avec succès`} type="success" closable/> :''}
      {(alert[0] === 'edit') ? <Alert message={`${alert[1]}  a été mis à jour avec succès`} type="warning" closable/>:''}
      {(alert[0] === 'delete') ? <Alert message={`${alert[1]}  a été supprimé avec succès`} type="error" closable/>:''}
      <Add/>
      <Get/>
    </Card>
    </JwtContextProvider>

  )

}

export default Domains
