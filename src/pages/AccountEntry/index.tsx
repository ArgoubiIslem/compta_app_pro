import React, { Component, useContext, useEffect, useState, useRef } from 'react';
import { Table, Form, Card, Modal, Button, Space, Typography, Input, Alert, Drawer, Select } from 'antd';
import axios from 'axios'
import JwtContextProvider, { JwtContext } from '../../provider/JwtContextProvider';
const { Title } = Typography;
//j'ai pas encore ajouté ajouter un fichier .env
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL ='http://localhost:8000/api/v1'
const API_URL_TRANSACTIONS = `${API_URL}/transactions`
const { Option } = Select;

interface props{
  item : {
    id?:number,
    name:string,
    ficalyear :{value:string},
    journal :{value:string},
    category :{value:string},
    date :string,
    label :string,
    document :{value:string},

  }
}

const AccountEntry : React.FC <props> = () => {
  const [alert, setAlert] = useState([{}]);
  const status  = useContext(JwtContext);
  const token  = status.jwtAccess;
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  
  const Edit: React.FC <props> = (props) => {
    const [visible, setVisible] = useState(false)
    const [ficalyear, setFicalyear] = useState(props.item.ficalyear)
    const [journal, setJournal] = useState(props.item.journal)
    const [category, setCategory] = useState(props.item.category)
    const [date, setDate] = useState(props.item.date)
    const [label, setLabel] = useState(props.item.label)
    const [document, setDocument] = useState(props.item.document)
    const status  = useContext(JwtContext);
    const token  = status.jwtAccess;

    const GetFicalyears = () => {
      const [ficalyears, setFicalyears] = useState([]);
        
      const onchangedom= (e:any) => {
        setFicalyear(e)
      }

      useEffect (() => {
      axios.get(`${API_URL}/fiscalyears/`)
        .then(response => {
          setFicalyears(response.data.results);
        }) 
      }, [])

      let optionItems = ficalyears.map((ficalyear:any) => 
        <Option value={ficalyear.id} key={ficalyear.id}> {ficalyear.year}</Option>
      );

      return ( 
        <Form.Item
        name="ficalyear"
        label="fiscal year :"
        >
        <Select onChange={onchangedom} labelInValue defaultValue={{key : props.item.ficalyear}}>
          {optionItems}
        </Select> 
        </Form.Item>

      )
    }
    const GetJournal = () => {
      const [journals, setJournals] = useState([]);
        
      const onchangedom= (e:any) => {
        setJournal(e);
      }

      useEffect (() => {
      axios.get(`${API_URL}/journals/`)
        .then(response => {
          setJournals(response.data.results);
        }) 
      } , [])

      let optionItems = journals.map((journal:any) => 
        <Option value={journal.id} key={journal.id}> {journal.name}</Option>
      );

      return ( 
        <Form.Item
        name="journals"
        label="Journals :"
        >
          <Select onChange={onchangedom} labelInValue defaultValue={{key : props.item.journal}}>
            {optionItems}
          </Select> 
        </Form.Item>

      )
    }
    const GetCategories = () => {
      const [categories, setCategories] = useState([]);
        
      const onchangedom= (e:any) => {
        setCategory(e)
      }

      useEffect (() => {
      axios.get(`${API_URL}/transactioncategories/`)
        .then(response => {
          setCategories(response.data.results);
        }) 
      } , [])

      let optionItems = categories.map((category:any) => 
        <Option value={category.id} key={category.id}> {category.name}</Option>
      );

      return ( 
        <Form.Item
        name="categories"
        label="Categories :"
        >
          <Select onChange={onchangedom} labelInValue defaultValue={{key : props.item.category}}>
            {optionItems}
          </Select> 
        </Form.Item>

      )
    }
    const GetDocuments = () => {
      const [documents, setDocuments] = useState([]);
      const onchangedom= (e:any) => {
        setDocument(e)
        console.log(document)

      }
      useEffect (() => {
      axios.get(`${API_URL}/documents/`)
        .then(response => {
          setDocuments(response.data.results);
        }) 
      } , [])

      let optionItems = documents.map((document:any) => 
        <Option value={document.id} key={document.id}> {document.name}</Option>
      );

      return ( 
        <Form.Item
        name="documents"
        label="Documents :"
        >
          <Select onChange={onchangedom} labelInValue defaultValue={{key : props.item.document}}>
            {optionItems}
          </Select>
        </Form.Item> 
      )
    }

/*---------------------------------------------*/
    const showDrawer = () => {
      setVisible(true);
    };
  
    const onClose = () => {
      setVisible(false);
    };
  
    const handleCancel = () => {
      setVisible(false)
    };

    const onFinishEdit = (values:any) => {
      const options :any= {
        url: `${API_URL_TRANSACTIONS}/${props.item.id}/`,
        method: 'PATCH', 
        data: {
          ficalyear : ficalyear.value,
          journal : journal.value,
          category : category.value,
          date : date,
          label : label,
          document : document.value,
          },
          headers: { Authorization: `Bearer ${token}` }
      };
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
        <GetFicalyears />
        <GetJournal />
        <GetCategories />
        <Form.Item
          name="date"
          label="Date"
          initialValue= {props.item.date}
          onChange = {(v:any) => setDate(v.target.value)}

          rules={[
            {
              required: true,
              message: 'Entrez le date!',
            },
          ]}
        >
          <Input placeholder="date"/>
        </Form.Item>
        <Form.Item
          name="label"
          label="Label"
          initialValue= {props.item.label}
          onChange = {(v:any) => setLabel(v.target.value)}

          rules={[
            {
              required: true,
              message: 'Entrez le label!',
            },
          ]}
        >
          <Input placeholder="label"/>
        </Form.Item>
        <GetDocuments />

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
  const Delete: React.FC <props>= (props) => {
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
      axios.delete(`${API_URL_TRANSACTIONS}/${props.item.id}`, config)
      .then(response => {
        console.log(response)
        setVisible(false)
        setAlert(['delete', 'la transaction']);

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
  const Add :React.FC  = () => {
    const [visible, setVisible] = useState(false)
    const status  = useContext(JwtContext);
    const token  = status.jwtAccess;
    const [ficalyear, setFicalyear] = useState('');
    const [journal, setJournal] = useState('');
    const [category, setCategory] = useState('');
    const [document, setDocument] = useState('');
  
    const GetFicalyears = () => {
      const [ficalyears, setFicalyears] = useState([]);
        
      const onchangedom= (e:any) => {
        setFicalyear(e)
        console.log(ficalyear)
      }
  
      useEffect (() => {
      axios.get(`${API_URL}/fiscalyears/`)
        .then(response => {
          setFicalyears(response.data.results);
        }) 
      }, [])
  
      let optionItems = ficalyears.map((ficalyear:any) => 
        <Option value={ficalyear.id} key={ficalyear.id}> {ficalyear.year}</Option>
      );
  
      return ( 
        <Form.Item
        name="ficalyear"
        label="fiscal year :"
        >
  
        <Select onChange={onchangedom} labelInValue defaultValue={{ key: 2 }}>
          {optionItems}
        </Select> 
        </Form.Item>
    
      )
    }
    const GetJournal = () => {
      const [journals, setJournals] = useState([]);
        
      const onchangedom= e => {
        setJournal(e)
      }
  
      useEffect (() => {
      axios.get(`${API_URL}/journals/`)
        .then(response => {
          setJournals(response.data.results);
        }) 
      } , [])
  
      let optionItems = journals.map((journal:any) => 
        <Option value={journal.id} key={journal.id}> {journal.name}</Option>
      );
  
      return ( 
        <Form.Item
        name="journals"
        label="Journals :"
        >
          <Select onChange={onchangedom} labelInValue defaultValue={{ key: 2 }}>
            {optionItems}
          </Select> 
        </Form.Item>
   
      )
    }
    const GetCategories = () => {
      const [categories, setCategories] = useState([]);
        
      const onchangedom= e => {
        setCategory(e)
      }
  
      useEffect (() => {
      axios.get(`${API_URL}/transactioncategories/`)
        .then(response => {
          setCategories(response.data.results);
        }) 
      } , [])
  
      let optionItems = categories.map((category:any) => 
        <Option value={category.id} key={category.id}> {category.name}</Option>
      );
  
      return ( 
        <Form.Item
        name="categories"
        label="Categories :"
        >
          <Select onChange={onchangedom} labelInValue defaultValue={{ key: 1 }}>
            {optionItems}
          </Select> 
        </Form.Item>
    
      )
    }
    const GetDocuments = () => {
      const [documents, setDocuments] = useState([]);
      const onchangedom= e => {
        setDocument(e)
        console.log(document)
  
      }
      useEffect (() => {
      axios.get(`${API_URL}/documents/`)
        .then(response => {
          setDocuments(response.data.results);
        }) 
      } , [])
  
      let optionItems = documents.map((document:any) => 
        <Option value={document.id} key={document.id}> {document.name}</Option>
      );
  
      return ( 
        <Form.Item
        name="documents"
        label="Documents :"
        >
          <Select onChange={onchangedom} labelInValue defaultValue={{ key: 1 }}>
            {optionItems}
          </Select>
        </Form.Item> 
      )
    }
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
      console.log(values)
      axios.post(`${API_URL_TRANSACTIONS}/`, {
        ficalyear : ficalyear.value,
        journal : journal.value,
        category : category.value,
        date : values.date,
        label : values.label,
        document : document.value,
      },config)
      .then(response => {
        console.log(response)
        setVisible(false)
        setAlert(['add', values.name]);
  
      }).catch(error => {
        console.log(error.response)
      });
    }
    return (
        <div>
          <Button style={{float:'right'}} type="primary" onClick={showDrawer}>
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
              <GetFicalyears />
              <GetJournal />
              <GetCategories />
              <Form.Item
                name="date"
                label="date : "

                rules={[
                  {
                    required: true,
                    message: 'Entrez le date!',
                  },
                ]}
              >
                <Input placeholder="date"/>
              </Form.Item>
              <Form.Item
                name="label"
                label="label : "

                rules={[
                  {
                    required: true,
                    message: 'Entrez le label!',
                  },
                ]}
              >
                <Input placeholder="label"/>
              </Form.Item>
              <GetDocuments />

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
      title: 'ficalyear',
      dataIndex: 'ficalyear',
      key: 'ficalyear',
    },
    {
      title: 'journal',
      dataIndex: 'journal',
      key: 'journal',
    },
    {
      title: 'category',
      dataIndex: 'category',
      key: 'category',
    },{
      title: 'date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'label',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'document',
      dataIndex: 'document',
      key: 'document',
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
    axios.get(`${API_URL_TRANSACTIONS}/`, config)
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
      {(alert[0] === 'add') ?  <Alert message={`Ecriture a été créé avec succès`} type="success" closable/> :''}
      {(alert[0] === 'edit') ? <Alert message={`Ecriture  a été mis à jour avec succès`} type="warning" closable/>:''}
      {(alert[0] === 'delete') ? <Alert message={`Ecriture  a été supprimé avec succès`} type="error" closable/>:''}
      <Add/>
      <Get/>
    </Card>
    </JwtContextProvider>
  )
  
}
 
export default AccountEntry;