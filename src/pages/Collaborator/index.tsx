import React, {  useContext, useEffect, useState, useRef } from 'react';
import { Table, Form, Card, Modal, Button, Space, Typography, Input, Alert, Drawer, Select } from 'antd';
import './style.less'
import axios from 'axios'
import '../Theme/style-table.less'
import JwtContextProvider, { JwtContext } from '../../provider/JwtContextProvider';

const { Title } = Typography;
//j'ai pas encore ajouté ajouter un fichier .env
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL = 'http://localhost:8000/api/v1'
const API_URL_COLLABORATEURS = `${API_URL}/collaborators`
const API_URL_USERS = `${API_URL}/users`
const API_URL_ORGANISATIONOFFER=`${API_URL}/organisationOffer`
const API_URL_OFFER = `${API_URL}/offer`
interface props {
  item: {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    address: string,
    organization: string

  }
}

const Collaborator: React.FC<props> = () => {

  const [alert, setAlert] = useState([{}])
  const [count, setCount] = useState(0)

  const Edit: React.FC<props> = (props) => {
    const [visible, setVisible] = useState(false)
    const [first_name, setFirstName] = useState(props.item.first_name)
    const [last_name, setLastName] = useState(props.item.last_name)
    const [email, setEmail] = useState(props.item.email)
    const [phone_number, setPhoneNumber] = useState(props.item.phone_number)
    const [address, setAdress] = useState(props.item.address)
    const [errorMsg, setErrorMsg] = useState('');
    const [phoneErrorMsg, setPhoneErrorMsg] = useState('');

    const status = useContext(JwtContext);
    const token = status.jwtAccess;
    const showDrawer = () => {
      setVisible(true);
    };

    const onClose = () => {
      setVisible(false);
    };

    const handleCancel = () => {
      setVisible(false)
    };



    const options: any = {
      url: `${API_URL_USERS}/${props.item.id}/`,
      method: 'PATCH',
      data: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_number: phone_number,
        address: address,
        // organization:organization,
      },
      headers: { Authorization: `Bearer ${token}` }

    };

    const onFinishEdit: () => void = () => {
      axios(options)
        .then((response) => {
          console.log('patch ok')
          console.log(response)
          setAlert(['edit', props.item.first_name]);

        })
        .catch(error => {
          console.log('patch error')
          console.log(error.response)
          // setErrorMsg("Cet email existe déjà.")
          setErrorMsg(error.response.data.email)
          setPhoneErrorMsg(error.response.data.phone_number)
        })
      setVisible(false)
    };

    return (
      <div>
        <Button style={{ marginTop: 0, width: 'auto', backgroundColor: '#faad14', border: 0 }} type="primary" onClick={showDrawer}>
          Editer
        </Button>
        <Drawer
          title="Modifier un collaborateur"
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
          width="100%"
        >
          <Form
            name="control-ref"
            onFinish={onFinishEdit}
          >
            <Form.Item
              initialValue={props.item.first_name}
              onChange={(v: any) => setFirstName(v.target.value)
              }
              name="first_name"
              label="First name : "
              rules={[
                {
                  required: true,
                  message: 'Entrez le prénom du collaborateur',
                },
                { whitespace: true },
                { min: 3 }
              ]}
              hasFeedback
            >
              <Input placeholder='First name' />
            </Form.Item>
            <br />
            <Form.Item
              initialValue={props.item.last_name}
              name="last_name"
              label="Last name : "
              onChange={(v: any) => setLastName(v.target.value)}

              rules={[
                {
                  required: true,
                  message: 'Entrez le nom du collaborateur',
                },
                { whitespace: true },
                { min: 3 }
              ]}
              hasFeedback
            >
              <Input placeholder="name" />
            </Form.Item>
            <Form.Item
              initialValue={props.item.email}
              name="email"
              label="Email : "
              onChange={(v: any) => setEmail(v.target.value)}

              rules={[
                {
                  required: true,
                  message: 'Entrez l email du collaborateur',
                },
                { type: "email", message: 'Le format de l email saisi est invalide' },

              ]}
              hasFeedback
            >
              <Input placeholder='Email' />
            </Form.Item>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

            <Form.Item
              initialValue={props.item.phone_number}
              name="phone_number"
              label="Phone number : "
              onChange={(v: any) => setPhoneNumber(v.target.value)}

              rules={[
                {
                  required: true,
                  message: 'Entrez le téléphone du collaborateur',
                },
                { whitespace: true },
                { min: 8 }
              ]}
              hasFeedback
            >
              <Input placeholder='phone number' />
            </Form.Item>
            {phoneErrorMsg && <p style={{ color: 'red' }}>{phoneErrorMsg}</p>}

            <Form.Item
              initialValue={props.item.address}
              name="address"
              label="address : "
              onChange={(v: any) => setAdress(v.target.value)}

              rules={[
                {
                  required: true,
                  message: 'Entrez l adresse du collaborateur',
                },
                { whitespace: true },
                { min: 3 }
              ]}
              hasFeedback
            >
              <Input placeholder='address' />
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
  const Delete: React.FC<props> = (props) => {
    const [visible, setVisible] = useState(false)
    const status = useContext(JwtContext);
    const token = status.jwtAccess;
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

    const handleOk = (values: any) => {
      axios.delete(`${API_URL_COLLABORATEURS}/${props.item.id}`, config)
        .then(response => {
          console.log(response)
          setVisible(false)
          setAlert(['delete', props.item.first_name]);

        }).catch(error => {
          console.log(error)
          console.log(config)
        });
    }
    return (
      <div>
        <Button style={{ marginTop: 0, width: 'auto', border: 0 }} type="primary" danger onClick={showModal}>
          Supprimer
        </Button>
        <Modal
          title="Supprime un collaborateur"
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
          Etes-vous sûr que vous voulez supprimer {props.item.name} ?
        </Modal>
      </div>
    );
  }
  const Add: React.FC = () => {
    const [visible, setVisible] = useState(false)
    const status = useContext(JwtContext);
    const token = status.jwtAccess;
    const [errorMsg, setErrorMsg] = useState('');
    const [phoneErrorMsg, setPhoneErrorMsg] = useState('');
    const [offer, setOffer] = useState("");

    const organisation = status.organization
    const configOffer = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        organisation: organisation,
        offertype:"Compta"
      },
    };

    useEffect(() => {

      axios.get(`${API_URL_ORGANISATIONOFFER}/`, configOffer)
      .then(response => {
        axios.get(`${API_URL_OFFER}/${response.data[0].offer}`)
        .then(response2 => {
         setOffer(response2.data.code)
        })
        .catch(error => {
          console.log(error)
        })

      })
      .catch(error => {
        console.log(error);
      })

    }, []);
    const showDrawer = () => {
      setVisible(true);
    };

    const onClose = () => {
      setVisible(true);
    };

    const handleCancel = () => {
      setVisible(false)
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    //---------------------------------------------------------------------------
    const onFinish = (values: any) => {
      axios.post(`${API_URL_COLLABORATEURS}/`, {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone_number: values.phone_number,
        address: values.address,
        organization: status.organization,
      }, config)
        .then(response => {
          console.log(response)
          setVisible(false)
          setAlert(['add', values.first_name]);

        }).catch(error => {
          // setAlert(['email_alert', error.response.data.email]);
          console.log("email error",error.response.data.email)
          console.log("phone error",error.response.data.phone_number)
          console.log(error.message)
          console.log(config)
          // setErrorMsg("Cet email existe déjà.")
          setErrorMsg(error.response.data.email)
          setPhoneErrorMsg(error.response.data.phone_number)

        });
    }
    console.log("aaaaaaaaaaaaaaaa",offer)
    return (
      <div>
        {offer!="Compta Expert Comptable"&& offer!=""?

          <>
       <Alert message={`Améliorer votre offre pour ajouter des collaborateurs`} type="error" />

          </>  :
          offer=="Compta Expert Comptable"?
      <Button style={{ float: 'right' }} type="primary" onClick={showDrawer}>
          Ajouter
        </Button>:<></>
      }

        <Drawer
          title="Ajouter un collaborateur"
          closable={true}
          maskClosable ={false}
          placement="right"
          width="100%"
          onClose={onClose}
          visible={visible}
        >
          <Form
            onFinish={onFinish}
            onFinishFailed={(values) => {
              console.log("erreur:", values.email);
            }}
          >
            <Form.Item
              name="first_name"
              label="First name : "
              rules={[
                {
                  required: true,
                  message: 'Entrez le prénom ',
                },
                { whitespace: true },
                { min: 3 }
              ]}
              hasFeedback

            >
              <Input placeholder="prénom" />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Last name : "
              rules={[
                {
                  required: true,
                  message: 'Entrez le nom du collaborateur',
                },
                { whitespace: true },
                { min: 3 }
              ]}
              hasFeedback
            >
              <Input placeholder="nom" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email : "

              rules={[
                {
                  required: true,
                  message: 'Entrez l email du collaborateur',
                },

                 { type: "email", message: 'Le format de l email saisi est invalide' },

              ]}
              hasFeedback
            >
              <Input placeholder="email" />
            </Form.Item>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            <Form.Item
              name="phone_number"
              label="Téléphone : "

              rules={[
                {
                  required: true,
                  message: 'Entrez le téléphone du collaborateur',
                },
                { whitespace: true },
                { min: 8 }
              ]}
              hasFeedback
            >
              <Input placeholder="téléphone" />
            </Form.Item>
            {phoneErrorMsg && <p style={{ color: 'red' }}>{phoneErrorMsg}</p>}
            <Form.Item
              name="address"
              label="Adresse : "

              rules={[
                {
                  required: true,
                  message: 'Entrez l adresse du collaborateur',
                },
                { whitespace: true },
                { min: 3 }
              ]}
              hasFeedback
            >
              <Input placeholder="adresse" />
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
    const status = useContext(JwtContext);
    const token = status.jwtAccess;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    console.log(status)

    const columns: any = [
      {
        title: '#',
        dataIndex: 'id',
        key: 'id',
        defaultSortOrder: 'ascend',
        sorter: (a: any, b: any) => a.id - b.id,
        render: text => <span data-title="#">{text}</span>
      },
      {
        title: 'First name',
        dataIndex: 'first_name',
        key: 'first_name',
        render: text => <span data-title="first_name">{text}</span>
      },
      {
        title: 'Last name',
        dataIndex: 'last_name',
        key: 'last_name',
        render: text => <span data-title="last_name">{text}</span>
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: text => <span data-title="email">{text}</span>
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        render: text => <span data-title="address">{text}</span>
      },

      {
        title: 'Phone',
        dataIndex: 'phone_number',
        key: 'phone_number',
        render: text => <span data-title="phone_number">{text}</span>
      },
      {
        title: 'Actions',
        dataIndex: 'action',
        render: (text, record) => (
          <span data-title="Actions">
            <Space className="positionButton">
              <Delete item={record} />
              <Edit item={record} />
            </Space>
          </span>
        ),
      },
    ];
    useEffect(() => {
      console.log(config)
      axios.get(`${API_URL_COLLABORATEURS}/?organization=${status.organization}`, config)
        .then(response => {
          setData(response.data.results);
          console.log('collaborators:', response.data.count);
          setCount(response.data.count)
          console.log(response);
        }).catch(error => { });
    }, [count]);

    return (
      <Table style={{ marginTop: 75 }} rowKey="id" bordered columns={columns} dataSource={data} />


    )
  }

  return (
    <JwtContextProvider>
      <Card>
        <Title level={2}>Collaborateurs</Title>

        {(alert[0] === 'add') ? <Alert message={`${alert[1]} a été créé avec succès`} type="success" closable /> : ''}
        {(alert[0] === 'edit') ? <Alert message={`${alert[1]}  a été mis à jour avec succès`} type="warning" closable /> : ''}
        {(alert[0] === 'delete') ? <Alert message={`${alert[1]}  a été supprimé avec succès`} type="error" closable /> : ''}
        {(alert[0] === 'upgrade') ? <Alert message={`upgrade`} type="error" closable /> : ''}
        {/* {(alert[0] === 'email_alert') ? <Alert message={`${alert[1]}  `} type="error" closable /> : ''} */}
        <Add />
        <Get />
      </Card>
    </JwtContextProvider>
  )

}

export default Collaborator
