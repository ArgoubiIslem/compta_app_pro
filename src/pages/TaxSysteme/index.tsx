import React, { Component, useContext, useEffect, useState, useRef } from 'react';
import { Table, Form, Card,Select, Modal, Button, Space, Typography, Input, Alert, Drawer } from 'antd';
import './style.less'
import axios from 'axios'
import '../Theme/style-table.less'
import JwtContextProvider, { JwtContext } from '../../provider/JwtContextProvider';
import SelectOrg from '@/components/SelectOrg';
const { Title } = Typography;
//j'ai pas encore ajouté ajouter un fichier .env
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL ='http://localhost:8000/api/v1'
const API_URL_taxsystems = `${API_URL}/taxsystems`
const API_URL_ORGANIZATIONS = `${API_URL}/organizations`

interface props{
  item : {
    id:number,
    code : number,
    name :string
  }
}


const TaxSysteme: React.FC <props> = () => {

  const [alert, setAlert ] = useState([{}])

  const Edit: React.FC<props> = ( ) => {


    const status  = useContext(JwtContext);
    const token  = status.jwtAccess;
    const [allTax,setAllTax]=useState([])
    const [newTax,setNewTax]=useState(0)

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
     useEffect(() => {

      axios.get(`${API_URL_taxsystems}/`, config)
      .then(response => {
        setAllTax(response.data);
      }).catch(error => {});

    },[allTax.length]);

    const handleChange = event => {
      setNewTax(event)
    };

    const editTax= event =>{
      const options: any = {
        url: `${API_URL_ORGANIZATIONS}/${window.localStorage.getItem('organization')}/`,
        method: 'PATCH',
        data :{
          taxsystem:newTax,
        },
        headers: { Authorization: `Bearer ${token}` }
      };
      axios(options)
      .then(response =>{
        console.log('patch ok')
        console.log(response)
        setAlert(['edit']);
        })
      .catch(error => {
          console.log('patch error')
          console.log(error.response)
      })

    };



      return (
        <div>
          <Title level={5} style={{ marginTop:30  }}>Changer Régime fiscal</Title>
         <div>

      <Select placeholder="Régime fiscal"
            style={{ marginTop: "20px" ,border: "1px ",width: 500}}
            onChange={handleChange}
            >
            {allTax.map((item,indice) =>{
            return(<Option key={item.id+indice}value={item.id}>{item.name}</Option>)
            })}</Select>
         <Button style={{marginTop : 0,marginLeft:20, width:'auto', backgroundColor:'#faad14', border:0}}  type="primary"onClick={editTax} >
            Editer
          </Button>
         </div>


        </div>
      );

  }
  const Delete: React.FC<props> = (props) => {
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

    const handleOk = (values : any) => {
      axios.delete(`${API_URL_taxsystems}/${props.item.id}`, config)
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
            title="Supprime un Régime fiscal"
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
  const Add: React.FC = () => {
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

    const onFinish = (values: any) => {
      axios.post(`${API_URL_taxsystems}/`, {
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
          <Button style={{float:'right'}} type="primary"  onClick={showDrawer}>
            Ajouter
          </Button>
          <Drawer
            title="Ajouter un Régime fiscal"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width="100%"
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
                    message: 'Entrez le code du Régime fiscal!',
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
                    message: 'Entrez le nom du Régime fiscal!',
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
  const Get: React.FC = () => {
  const [data, setData] = useState([])
  const status  = useContext(JwtContext);
  const token  = status.jwtAccess;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      organization:window.localStorage.getItem('organization'),

    }
  };
  const columns: any = [


    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: text => <span data-title="Code">{text}</span>
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      render: text => <span data-title="Name">{text}</span>
    },

  ];
  useEffect(() => {
    console.log(config)
    axios.get(`${API_URL_taxsystems}/`, config)
    .then(response => {
        setData(response.data);
        console.log("response",response.data);
    }).catch(error => {});
  },[alert]);

    return(
      <Table style={{marginTop : 30 ,width :"70%" }} rowKey="id" bordered columns={columns} dataSource={data} />
    )
  }

  return(
    <JwtContextProvider>
    <Card style={{height:600}}>
      <Title level={2}>Votre Régime fiscal</Title>
      {(alert[0] === 'add') ?  <Alert message={`${alert[1]} a été créé avec succès`} type="success" closable/> :''}
      {(alert[0] === 'edit') ? <Alert message={` Régime a été mis à jour avec succès`} type="warning" closable/>:''}
      {(alert[0] === 'delete') ? <Alert message={`${alert[1]}  a été supprimé avec succès`} type="error" closable/>:''}
      <Get/>
      <Edit/>
    </Card>
    </JwtContextProvider>
  )

}

export default TaxSysteme
