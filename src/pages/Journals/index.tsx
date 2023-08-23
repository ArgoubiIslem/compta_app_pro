import React, {useContext, useEffect, useState} from "react";
import JwtContextProvider, {JwtContext} from '../../provider/JwtContextProvider';
import {
  Card,
  Divider,
  Typography,
  Button,
  Alert,
  Table,
  Space,
  Form,
  Drawer,
  Select,
  Input,Modal,
} from 'antd';

import axios from 'axios';
import '../Theme/style-table.less';

const API_URL = 'http://localhost:8000/api/v1';
const API_URL_JOURNALS = `${API_URL}/journals`;
const API_URL_JOURNALTYPE = `${API_URL}/journalType`;
const API_URL_PLANCOMPTABLE = `${API_URL}/accountingPlan`
const {Title} = Typography;

interface IState {
  loading: boolean;
  visible: boolean;
  journale: string;
  organisations: string;
  fiscals: string;
  isVisible: boolean
}

const Journals: React.FC = () => {
  const [alert, setAlert] = useState([{}]);
  // const [isVisible, setIsVisible] = useState(true);
  const [state,setState]=useState<IState>({
    isVisible:true
  });
  const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 16},
  };
  const [dataAccount,setDataAccount]=useState([])
  const [journalTypes,setJournalTypes]=useState([])
  const config2 = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtAccess')}`,
    },
    params: {

      fiscal_year: localStorage.getItem('fiscal_year'),

    },
  };

  const config3 = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtAccess')}`,
    },

  };
  useEffect(() => {
    const fetch=async () => {

     await axios.get(`${API_URL_PLANCOMPTABLE}/`, config2)
      .then(response => {
        setDataAccount(response.data)
      }).catch(error => {
        console.log(error)
    });

    await axios.get(`${API_URL_JOURNALTYPE}/`,config3)
    .then(response2 => {
      setJournalTypes(response2.data);
      console.log("aaaaaaa",response2.data)
    }).catch(error => {
      console.log(error);
    });

    }
 fetch()
  },[dataAccount.length])




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

    const handleOk = () => {
        axios.delete(`${API_URL_JOURNALS}/${props.item.id}`, config)
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
                title={"Supprimer journal"}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Retour
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Confirmer
                    </Button>,
                ]}
            >
                Etes-vous sûr que vous voulez supprimer {props.item.name}
            </Modal>

        </div>
    );
}


const Edit: React.FC<props> = (props) => {

  console.log("props",props.item);
  const [state, setState] = useState<IState>({
    visible: false,
    journale: '',
    organisations: '',
    fiscals: '',
    loading:true,
    isVisible:false
  })
  const status = useContext(JwtContext);
  const token = status.jwtAccess;
  const fiscal = status.fiscal_year;
  const organisation = status.organization;
  const [form] = Form.useForm();

  const [selectedType,setSelectedType]=useState({})
  const [errorMsg, setErrorMsg] = useState('');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page_size: 3000,
      fiscalyear: fiscal,
      organization: organisation
    },
  };


  const showDrawer = () => {
    setState({visible: true});
  };

  const onClose = () => {
    setState({visible: false,});
  };
  const handleCancel = () => {
    setState({visible: false,});
};
//---------------------------get journals-------------


  const optien = journalTypes.map((e, i) => <Option value={e.id} key={i}>{e.name}</Option>)

  const   onChangeJournal =async (value: any) => {
    state.journale = value;
    setState({...state, journale: state.journale})
    await setSelectedType(journalTypes.filter(e=>e.id==state.journale)[0])
  };






//--------------------------get account------------------

//------account pour journale Achat-------------

  let accountHa = dataAccount.filter(el => (el.code?.toString().substr(0, 2) == 21||"") ||
    (el.code?.toString().substr(0, 2) == 60||"") ||
    (el.code?.toString().substr(0, 2) == 61||"") ||
    (el.code?.toString().substr(0, 2) == 62||"") ||
    (el.code?.toString().substr(0, 3) == 401||"") ||
    (el.code?.toString().substr(0, 3) == 404||"") ||
    (el.code?.toString().substr(0, 4) == 4452||"") ||
    (el.code?.toString().substr(0, 4) == 4456||""))

  const valueAccount = accountHa.map((el) => <Option key={el.id}
                                                   value={el.id}>{el.aclass} -- {el.code} - {el.name}</Option>)

//------------account journale vente-------------

  var accountVt = dataAccount.filter(el => (el.code?.toString().substr(0, 3) == 707||"") ||
    (el.code?.toString().substr(0, 3) == 709 ||"") ||
    (el.code?.toString().substr(0, 3)== 411||"" )||
    (el.code?.toString().substr(0, 4) == 4431||"")
  )
  var valueAccountVt = accountVt.map((el) => <Option key={el.id}
                                                     value={el.id}>{el.aclass} -- {el.code} - {el.name}</Option>)

  //------------account journale caisse-------------

  var accountCa = dataAccount.filter(el => el.code?.toString().substr(0, 2) == 53||"")
  var valueAccountCa = accountCa.map((el) => <Option key={el.id}
                                                     value={el.id}>{el.aclass} -- {el.code} - {el.name}</Option>)

  //------------account journale bqnaue-------------

  const accountBank = dataAccount.filter(el => (el.code?.toString().substr(0, 3)== 512||"" )||
  (el.code?.toString().substr(0, 3)== 411||"" )||
  (el.code?.toString().substr(0, 3)== 401||"" ))
  const valueAccountBank = accountBank.map((el) => <Option key={el.id}
                                                         value={el.id}>{el.aclass} -- {el.code} - {el.name}</Option>)

  //---------------------tout account--------------------

  const valueToutAccount = dataAccount.map((el) => <Option key={el.id}
                                                         value={el.id}>{el.aclass} -- {el.code} - {el.name}</Option>)
  const handleChange = () => {
    setState({...state, journale: state.journale})
  }
  useEffect(() => {

  }, [alert]);

//------------------------------------

  const onFinish = (values: {
    code: string, name: string,  account: string
  }) => {
    axios.patch(`${API_URL_JOURNALS}/${props.item.id}/`, {
      journal_type: state.journale,
      code: values.code,
      name: values.name.toString(),
      organization: organisation,
      fiscalyear: fiscal,
      accounts: values.account,
      label: null
      // }
    }, config)
      .then(response => {
        console.log(response);
        if (!values.code)
          setState({...state, visible: false})
        setAlert(['edit', values.name.toString()]);
        form.resetFields()
      }).catch(error => {
      console.log(error.response);
      setErrorMsg("Code " + values.code +" est existe déja.")

    });
  }

  return (
    <>
      <Button style={{ marginTop: 0, backgroundColor: '#faad14', border: 0 }} type="primary" onClick={showDrawer}>
        Editer
      </Button>
      <Drawer
        title={ `Editer le journal ${props.item.name}`}
        width="100%"
        visible={state.visible}
        onClose={onClose}
      >
        <Form layout="vertical" hideRequiredMark
              className="styleforms"
              {...layout}
              form={form}
              onFinish={onFinish}
       >
          <Form.Item
            name="journal_type"
            label="Type journal"
            rules={[
              {
                required: true,
              },]}
          >
            <Select onChange={onChangeJournal}>
              {optien}
            </Select>
          </Form.Item>
          <Form.Item
            name="code"
            label="Code journal"
            rules={[
              {
                required: true,

              },]}
              initialValue= {props.item.code}
          >
            <Input style={{width: '100%'}}/>
          </Form.Item>
          <Form.Item
            name="name"
            label="Nom journal"
            rules={[
              {
                required: true,

              },]}
              initialValue= {props.item.name}

          >
            <Input style={{width: '100%'}}/>
          </Form.Item>




          <Form.Item
            name="account"
            label="Comptes"
            rules={[
              {
                required: true,
                message:"Il faut sélectionne un compte au minimum"
              },]}


          >
            <Select mode="multiple"
             style={{width: '100%'}} onChange={handleChange}>
              {selectedType.code == "HA" ? valueAccount :
                selectedType.code  == "VT" ? valueAccountVt
                  : selectedType.code  == "CA" ? valueAccountCa :
                  selectedType.code  == "BQ" ? valueAccountBank
                      : valueToutAccount}
            </Select>
          </Form.Item>
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
          <Form.Item style={{marginTop:30}}>
          <Button key="back" onClick={handleCancel}>
        Retour
      </Button>,
            <Button htmlType="submit" type="primary">
              Enregistrer
            </Button>
          </Form.Item>

        </Form>
      </Drawer>
    </>
  )
}

  const GetJournals: React.FC = () => {
    const [data, setData] = useState<[{}]>([{}]);
    const [isLoading,setIsLoading]=useState(true)
    const status = useContext(JwtContext);
    const token = status.jwtAccess;
    const fiscal = status.fiscal_year;
    const organisation = status.organization;
    const [searchedText,setSearchedText]=useState("");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page_size: 3000,
        fiscalyear: fiscal,
        organization: organisation
      },
    };

    const arrayOrganisation: [] = [];
    const filtreOrganisation = data.filter((e) => e.organization).map(i => arrayOrganisation.push(i.organization.display_name))
    let nameOrganisation = [...new Set(arrayOrganisation)]

    const columns = [

      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        filteredValue:[searchedText],
        onFilter:(value,record)=>{
          return String(record.name).toLowerCase().includes(value.toLowerCase())||
          String(record.code).toLowerCase().includes(value.toLowerCase())
        },
        render: text => <span data-title="Code">{text}</span>

      },
      {
        title: 'Nom',
        dataIndex: 'name',
        key: 'name',
        render: text => <span data-title="Name">{text}</span>

      },

      {
        title: 'Type',
        dataIndex: 'journal_type',
        key: 'journal_type',
        render: (text,record) => (<span data-title="Type">{record.journal_type?.name}</span>),
      },
      {
        title: 'Actions',
        dataIndex: 'action',
        render: (text, record) => (
          <span data-title="Actions">
         {
         <Space className="positionButton">
             <Edit item ={record}/>
             <Delete item ={record}/>
          </Space>
         }
          </span>

        ),
      },
    ];

    useEffect(() => {
     const GetJournal=() => {
      axios.get(`${API_URL_JOURNALS}/`, config)
      .then(response => {
      setIsLoading(false)
        setData(response.data.results);
      }).catch(error => {
        console.log(error);
    });
     }
      GetJournal()

    }, [data.length]);

    return (

      <>
         <Input.Search placeholder='rechercher .....'
          style={{width:"20%", marginBottom:"5px"}}
          onSearch={(value)=>
          setSearchedText(value)
          }
          onChange={(e)=>setSearchedText(e.target.value)}
          />
             <Table style={{marginTop: 75,}} rowKey="id" bordered columns={columns}
             dataSource={data}
             loading={isLoading}
      />
      </>



    )

  }

  const AddJournals: React.FC = () => {


    const [state, setState] = useState<IState>({
      visible: false,
      journale: '',
      organisations: '',
      fiscals: '',
      loading:true,
      isVisible:false
    })
    const status = useContext(JwtContext);
    const token = status.jwtAccess;
    const fiscal = status.fiscal_year;
    const organisation = status.organization;
    const [form] = Form.useForm();
    const [selectedType,setSelectedType]=useState({})
    const [errorMsg, setErrorMsg] = useState('');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page_size: 3000,
        fiscalyear: fiscal,
        organization: organisation
      },
    };
    const config2 = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {

        fiscal_year: fiscal,

      },
    };

    const showDrawer = () => {
      setState({visible: true});
    };

    const onClose = () => {
      setState({visible: false,});
    };
    const handleCancel = () => {
      setState({visible: false,});
  };
//---------------------------get journals-------------


    const optien = journalTypes.map((e, i) => <Option value={e.id} key={i}>{e.name}</Option>)

    const   onChangeJournal =async (value: any) => {
      state.journale = value;
      setState({...state, journale: state.journale})
      await setSelectedType(journalTypes.filter(e=>e.id==state.journale)[0])
    };







//--------------------------get account------------------

//------account pour journale Achat-------------

    let accountHa = dataAccount.filter(el => (el.code?.toString().substr(0, 2) == 21||"") ||
      (el.code?.toString().substr(0, 2) == 60||"") ||
      (el.code?.toString().substr(0, 2) == 61||"") ||
      (el.code?.toString().substr(0, 2) == 62||"") ||
      (el.code?.toString().substr(0, 3) == 401||"") ||
      (el.code?.toString().substr(0, 3) == 404||"") ||
      (el.code?.toString().substr(0, 4) == 4452||"") ||
      (el.code?.toString().substr(0, 4) == 4456||""))

    const valueAccount = accountHa.map((el) => <Option key={el.id}
                                                     value={el.id}>{el.aclass} -- {el.code} - {el.name}</Option>)

//------------account journale vente-------------

    var accountVt = dataAccount.filter(el => (el.code?.toString().substr(0, 3) == 707||"") ||
      (el.code?.toString().substr(0, 3) == 709 ||"") ||
      (el.code?.toString().substr(0, 3)== 411||"" )||
      (el.code?.toString().substr(0, 4) == 4431||"")
    )
    var valueAccountVt = accountVt.map((el) => <Option key={el.id}
                                                       value={el.id}>{el.aclass} -- {el.code} - {el.name}</Option>)

    //------------account journale caisse-------------

    var accountCa = dataAccount.filter(el => el.code?.toString().substr(0, 2) == 53||"")
    var valueAccountCa = accountCa.map((el) => <Option key={el.id}
                                                       value={el.id}>{el.aclass} -- {el.code} - {el.name}</Option>)

    //------------account journale bqnaue-------------

    const accountBank = dataAccount.filter(el => (el.code?.toString().substr(0, 3)== 512||"" )||
    (el.code?.toString().substr(0, 3)== 411||"" )||
    (el.code?.toString().substr(0, 3)== 401||"" ))
    const valueAccountBank = accountBank.map((el) => <Option key={el.id}
                                                           value={el.id}>{el.aclass} -- {el.code} - {el.name}</Option>)

    //---------------------tout account--------------------

    const valueToutAccount = dataAccount.map((el) => <Option key={el.id}
                                                           value={el.id}>{el.aclass} -- {el.code} - {el.name}</Option>)

    const handleChange = () => {
      setState({...state, journale: state.journale})
    }

//------------------------------------

    const onFinish = (values: {
      code: string, name: string,  account: string
    }) => {
      axios.post(`${API_URL_JOURNALS}/`, {
        journal_type: state.journale,
        code: values.code,
        name: values.name.toString(),
        organization: organisation,
        fiscalyear: fiscal,
        accounts: values.account,
        label: null
        // }
      }, config)
        .then(response => {
          console.log(response);
          if (!values.code)
            setState({...state, visible: false})
          setAlert(['add', values.name.toString()]);
          form.resetFields()
        }).catch(error => {
        console.log(error.response);
        setErrorMsg("Code " + values.code +" est existe déja.")

      });
    }





    return (
      <>
        <Button style={{float: 'right'}} type="primary" onClick={showDrawer}>
          Ajouter
        </Button>
        <Drawer
          title="Ajouter un journal"
          width="100%"
          visible={state.visible}
          onClose={onClose}


        >

          <Form layout="vertical" hideRequiredMark
                className="styleforms"
                {...layout}
                form={form}
                onFinish={onFinish}
         >
            <Form.Item
              name="journal_type"
              label="Type journal"
              rules={[
                {
                  required: true,
                },]}
            >
              <Select onChange={onChangeJournal}>
                {optien}
              </Select>
            </Form.Item>
            <Form.Item
              name="code"
              label="Code journal"
              rules={[
                {
                  required: true,

                },]}

            >
              <Input style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item
              name="name"
              label="Nom journal"
              rules={[
                {
                  required: true,

                },]}
            >
              <Input style={{width: '100%'}}/>
            </Form.Item>




            <Form.Item
              name="account"
              label="Comptes"
              rules={[
                {
                  required: true,
                  message:"Il faut sélectionne un compte au minimum"
                },]}
            >
              <Select mode="multiple" style={{width: '100%'}} onChange={handleChange}>
                {selectedType.code == "HA" ? valueAccount :
                  selectedType.code  == "VT" ? valueAccountVt
                    : selectedType.code  == "CA" ? valueAccountCa :
                    selectedType.code  == "BQ" ? valueAccountBank
                        : valueToutAccount}
              </Select>
            </Form.Item>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            <Form.Item style={{marginTop:30}}>
            <Button key="back" onClick={handleCancel}>
          Retour
        </Button>,
              <Button htmlType="submit" type="primary">
                Enregistrer
              </Button>
            </Form.Item>

          </Form>
        </Drawer>
      </>
    )
  }

  return (
    <JwtContextProvider>
      <Card>
        <Title level={2}>Liste des journaux</Title>
        <Divider/>
        {(alert[0] === 'add'&& state.isVisible) ?
          <Alert style={{marginBottom:20}} message={`le journal ${alert[1]} a été créé avec succès`} type="success"  closable /> :''}
        {(alert[0] === 'edit'&& state.isVisible) ?
          <Alert style={{marginBottom:20}} message={`le journal ${alert[1]} a été mis à jour avec succès`} type="success"  closable /> :''}
         {(alert[0] === 'delete'&& state.isVisible) ?
          <Alert style={{marginBottom:20}} message={`le journal ${alert[1]} a été supprimé avec succès`} type="success"  closable /> :''}
        <AddJournals/>
        <GetJournals/>
      </Card>
    </JwtContextProvider>
  )
}
export default Journals
