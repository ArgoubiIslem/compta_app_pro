import React, {  useContext, useEffect, useState } from 'react';
import { Table, Spin, Card,  Typography, Tree, Button, Form, Drawer, Input,Modal, Space, InputNumber, Alert, Select  } from 'antd';
import { PlusOutlined} from '@ant-design/icons';

import axios from 'axios';
import './style.less';
import JwtContextProvider, { JwtContext } from '../../provider/JwtContextProvider';
import '../Theme/style-table.less'
import { verbose } from 'jest.config';
const { Title } = Typography;
//j'ai pas encore ajouté ajouter un fichier .env
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL ='http://localhost:8000/api/v1'
const API_URL_ACCOUNTS = `${API_URL}/accounts`
const API_URL_PLANCOMPTABLE = `${API_URL}/accountingPlan`
const API_URL_RECURSIVESACCOUNTS = `${API_URL}/recursiveaccounts`
const { Option } = Select;
interface props{
  item: {
    id: number,
    code: number,
    name: string,
    anature: {value: string},
    atype: {value: string},
  }
}
interface IparentStat{
    id: string,
    achart: string,
    code: string,
    aclass: string,
    atype: string,
    name: string,
    fiscal_year: string,
    organization: string,
    tax_percentage: string,
    test: boolean
}


const AccountChart: React.FC <props>= () => {

  const parentStatInit: IparentStat ={
    id:'',
    achart : '',
    code:'',
    aclass :'',
    atype : '',
    name :'',
    fiscal_year : '',
    organization :'',
    tax_percentage :'',
    test:false
  }
  const [alert, setAlert] = useState([{}]);
  const [parent, setParent] = useState('null');
  const [ok, setOk] = useState('');
  const [parentStat, setParentStat] = useState(parentStatInit);
  const [datas, setDatas] = useState([])
  const [data, setData] = useState([]);
  const [loading,setLoading] = useState(true)
  const [config, setConfig] = useState({
    headers: { Authorization: `Bearer ${window.localStorage.getItem('jwtAccess')}` },
    params : {
      page_size: 2000,
      fiscal_year:localStorage.getItem('fiscal_year'),
    }
  });
  useEffect(() => {
    axios.get(`${API_URL_PLANCOMPTABLE}/`, config)
    .then(response => {
        setData(response.data);
        setOk('ok');
        console.log(response)
        setLoading(false)

    }).catch(error => {
      console.log(error)
    })
  },[data.length]);

  const GetTree: React.FC = () => {

    const [alert, setAlert] = useState([{}]);

    const status  = useContext(JwtContext);
    const token  = status.jwtAccess;
    const[loading,setLoading] =useState(true);
    const [config, setConfig] = useState({
      headers: { Authorization: `Bearer ${token}` },
      params : {
        page_size: 2000,
        fiscal_year:status.fiscal_year
      }
    });


    const configs = {
      headers: { Authorization: `Bearer ${token}` },
      params : {
        page_size: 10,
        fiscal_year:status.fiscal_year,
        organization: status.organization,
        level:0
      }
    };
    useEffect(() => {

      axios.get(`${API_URL_RECURSIVESACCOUNTS}/`, configs)
      .then(response => {
        setDatas(response.data.results);
        setLoading(false)
      })

  },[alert]);



  const onSelect = (selectedKeys: any, selected: any) => {

    setParent(selectedKeys[0]);
    const conf = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.get(`${API_URL_ACCOUNTS}/${selectedKeys[0]}`, conf)
    .then(response => {
      setParentStat(response.data);
    }).catch(error => {console.log(error)});


  };

  const dig = () => {
    let dataForTree = [];

    for (let i = 0; i < datas.length; i += 1) {
      dataForTree.push(datas[i]);
     }
    return dataForTree;
  }
  const treeData = dig()

return(
  <>

  <Tree draggable
  blockNode treeData={treeData} onSelect={onSelect} defaultSelectedKeys={['null']}/>
</>)
}


  const Add: React.FC = () => {
    const [visible, setVisible] = useState(false)
    const status  = useContext(JwtContext);
    const token  = status.jwtAccess;
    const [errors, setErrors] = useState([])
    const [compteParentId,setCompteParentId]=useState({})
    const [form] = Form.useForm();
    const  [errorMsg,setErrorMsg] = useState("")

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
      const conf = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios.get(`${API_URL_ACCOUNTS}/${compteParentId}`, conf)
      .then(response => {
        const data = response.data
        axios.post(`${API_URL_ACCOUNTS}/`, {
          code : parseInt(data.code + values.code),
          name : values.name,
          parent: data.id,
          achart: data.achart,
          aclass: data.aclass,
          atype: data.atype,
          anature: 'ACTIVE',
          active: true,
          fiscal_year: data.fiscal_year,
          organization: data.organization,
          credit_amount: '0',
          debit_amount: '0',
          tax_percentage: data.tax_percentage

        },config)
        .then(response2 => {
          setVisible(false)
          setAlert(['add', values.name]);
          setOk('ok');
          setVisible(false)
          setParentStat(parentStatInit);
          setParent('null')
          })
        .catch(error => {
          setErrors(error.response.data)
          setErrorMsg("Verifiez le code ! ")
          setVisible(true)
        });


      }).catch(error => {console.log(error)});


    }
    const errorList: any[] = errors
    const errorItems: any=[];
    for (const property in errorList) {
      for(let i = 0; i < errorList[property].length; i++){
        errorItems.push(errorList[property][i])
      }

    }

    const errorMessages = (errorItems.map((item:any) =>{
      return(
          <Alert key ={item} type="error" message={item} showIcon banner />
      )
    }))
    const GetComptes = () => {
    const optionItems = data.map((compte: any) =>
    <Option value={compte.code} key={compte.id}>{compte.code}-{compte.name}</Option>

  );
  return (
    <Form.Item
    name="parent"
    label="Compte parent"
    rules={[  {
      required: true,

    },]}
    >
    <Select  labelInValue
    onChange={(e: any)=>{
      setCompteParentId(e.key)
     form.setFieldsValue({codeparent:e.value});
    }
    }
    >
      {optionItems}
    </Select>
    </Form.Item>

  )
  }


    return (
        <div>


          <>

          <Button style={{float:'right', display:'flex'}} type="primary" onClick={showDrawer}><PlusOutlined />Ajouter un compte</Button>
          <Drawer
            title="Ajouter un compte"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width="100%"

          >
          <Form
              onFinish={onFinish}
              form={form}
            >
              <GetComptes/>
              <p><span style={{color:'red'}}>* </span>Code :</p>
                <Form.Item
                    name="codeparent"
                    style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
                >
                  <Input disabled={true}/>
                </Form.Item>
                <span
                  style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}
                >
                  -
                </span>
                <Form.Item
                    name="code"

                  rules={[
                    {
                      required: true,
                      message: 'Entrez le N° du compte!',
                  },
                  ]}
                   style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
                >
                  <InputNumber  maxLength = {6} type="number" max={999999}/>
                </Form.Item>


              <Form.Item
                name="name"
                label="Intitulé : "

                rules={[
                  {
                    required: true,
                    message: 'Entrez l\'intitulé du compte!',
                  },
                ]}
              >
                <Input placeholder="Name"/>

              </Form.Item>
              {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
              <Button key="back" onClick={handleCancel}>
                Retour
              </Button>,
              <Button htmlType="submit" type="primary">
                Valider
              </Button>

            </Form>
          </Drawer></>
        </div>
      );

  }

  const Get: React.FC  = () => {

    const [del, setDel] = useState([]);
    const [searchedText,setSearchedText]=useState("");
    const status  = useContext(JwtContext);
    const token  = status.jwtAccess;
    const [data, setData] = useState([]);
    const [loading,setLoading] = useState(true)
    const [config, setConfig] = useState({
      headers: { Authorization: `Bearer ${window.localStorage.getItem('jwtAccess')}` },
      params : {
        page_size: 2000,
        fiscal_year:localStorage.getItem('fiscal_year'),
      }
    });


    const columns = [
      {
        title: 'N° du compte',
        dataIndex: 'code',
        key: 'code',
        filteredValue:[searchedText],
        onFilter:(value,record)=>{
          return String(record.name).toLowerCase().includes(value.toLowerCase())||
          String(record.code).includes(value)
        },

        sorter: (a: any, b: any) => a.id - b.id,
        render: (id, record) => <span data-title="N° du compte">{/*<a href={`/transactionitems/account=${record.id}`}></a>*/}{id}</span>,


      },
      {
        title: 'Intitulé',
        dataIndex: 'name',
        key: 'name',
        render: (id, record) =><span data-title="Intitulé">{/*  <a href={`/transactionitems/account=${record.id}`}></a>*/}{id}</span>,

      },


      {
        title: 'Actions',
        dataIndex: 'action',
        render: (text, record) => (
          <span data-title="Actions">
          <Space className="positionButton">
            <Delete item ={record}/>
            <Edit item ={record}/>

          </Space>
          </span>
        ),
      },
    ];


    const digs = () => {
      let both:any[] = [];

      for (let i = 0; i < data.length; i += 1) {
        if(data[i].level != 0)
        both.push(data[i]);
      }
      return both;
    }
    useEffect(() => {
      axios.get(`${API_URL_PLANCOMPTABLE}/`, config)
      .then(response => {
          setData(response.data);
          setOk('ok');
          console.log(response)
          setLoading(false)

      }).catch(error => {
        console.log(error)
      })
    },[data.length]);
    const tableData = digs()
    return(
      <>

       {loading ? <Spin size="default" />:
        <>
          <Input.Search placeholder='rechercher .....'
          style={{width:"20%", marginBottom:"20px"}}
          onSearch={(value)=>
          setSearchedText(value)
          }
          onChange={(e)=>setSearchedText(e.target.value)}
          />
        <Table rowKey="id" bordered pagination={{ pageSize: 50 }} columns={columns} dataSource={tableData}
        loading={loading}
      />
      </>
      }
      </>
    )
  }

  const Delete: React.FC <props> = (props) => {
    const [visible, setVisible] = useState(false)
    const status  = useContext(JwtContext);
    const token  = status.jwtAccess;
    const showModal = () => {
      setVisible(true)
    };
    const handleCancel = () => {
      setVisible(false)
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const handleOk = (values:any) => {
      axios.delete(`${API_URL_ACCOUNTS}/${props.item.id}`, config)
      .then(response => {
        setVisible(false)
        setAlert(['delete', props.item.name]);
        setOk('ok');

      }).catch(error => {
        console.error(error);
      });
    }
      return (
        <div>
          <Button style={{marginTop : 0,padding:5, width:'auto', border:0, display:'flex'} } type="primary" danger onClick={showModal}>
            <span style={{ padding:0, margin:0 ,display:"flex"} } >Supprimer</span>
          </Button>
          <Modal
            title="Supprime un compte"
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


  const Edit: React.FC <props> = (props) => {
    const [visible, setVisible] = useState(false)
    const [errors, setErrors] = useState([])
    const [atype, setAtype] = useState(props.item.atype)
    const [name, setName] = useState(props.item.name)
    const [code, setCode] = useState(props.item.code)
    const [anature, setAnature] = useState(props.item.anature)
    const status  = useContext(JwtContext);
    const token  = status.jwtAccess;

    const GetAtypes = () => {
      const [atypes, setAtypes] = useState([]);

      const onchangeAtype= (e: any) => {
        setAtype(e)
      }

     const config={
        headers: { Authorization: `Bearer ${token}` },
      };

      useEffect (() => {
      axios.get(`${API_URL}/accounttypes/`, config)
        .then(response => {
          setAtypes(response.data.results);
        }).catch(error => {
            console.log(error)
        })
      }, [atypes.length])

      let optionItems = atypes.map((atype: any) =>
        <Option value={atype.id} key={atype.id}> {atype.name}</Option>

      );
      return (
        <Form.Item
        name="atype"
        label="Type de compte :"
        rules={[  {
          required: true,

        },]}
        >
        <Select onChange={onchangeAtype} labelInValue defaultValue={{key : props.item.atype}}>
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
    const onchangenature = (e: any) => {
      setAnature(e)
    }

    const onFinishEdit = (values: any) => {
      const options: any = {
        url: `${API_URL_ACCOUNTS}/${props.item.id}/`,
        method: 'PATCH',
        data: {
          name : values.name,
          code : values.code,
          anature : anature.value,
          atype : atype.value,
          },
          headers: { Authorization: `Bearer ${token}` }
      };
      axios(options)
      .then(response =>{
        setAlert(['edit', props.item.name]);
        setOk('ok');
        setVisible(false)

        })
      .catch(error => {
        setErrors(error.response.data)
        setVisible(true)
      })
    };
    const errorList: any[] = errors
    const errorItems: any[]=[];
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
        <div>
          <Button style={{marginTop : 0, width:'auto', backgroundColor:'#faad14', border:0, display:'flex'}}  type="primary" onClick={showDrawer}>
          <span style={{ padding:0, margin:0 ,display:"flex"} } > Editer</span>
          </Button>
          <Drawer
            title="Mettre à jour un Compte"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width="100%"
          >
            {errorMessages}

          <Form
            name="control-ref"
            onFinish={onFinishEdit}
          >

            <Form.Item
                name="name"
                label="Intitulé : "
                initialValue= {props.item.name}
                rules={[  {
                  required: true,
                  message: 'Entrez l\'intitulé du compte!',
                },]}
                onChange = {(v: any) => setName(v.target.value)}
                defaultValue={parentStat.code} value={parentStat.code}
            >
              <Input  defaultValue={parentStat.code} value={parentStat.code} />
            </Form.Item>

            <Form.Item
              name="code"
              initialValue= {props.item.code}
              label="Code : "
              onChange = {(v: any) => setCode(v.target.value)}
              rules={[
                {
                  required: true,
                  message: 'Entrez le N° du compte!',
              },
              ]}

            >
              <InputNumber style={{width:'100%' }} maxLength = {6} type="number" max={999999}/>
            </Form.Item>



            <GetAtypes />


            <Form.Item
              name="anature"
              label="Nature de compte :"
              >
              <Select placeholder='Nature' onChange={onchangenature}  labelInValue defaultValue={{key : props.item.anature}}>
              <Option value={"ACTIVE"} key={"ACTIVE"}> ACTIVE</Option>
              <Option value={"PASSIVE"} key={"PASSIVE"}> PASSIVE </Option>
              <Option value={"PRODUCT"} key={"PRODUCT"}> PRODUCT </Option>
              <Option value={"EXPENSE"} key={"EXPENSE"}> EXPENSE </Option>
              </Select>
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

  return(
    <JwtContextProvider>
    <Card>
      <Title level={2}>Plan comptable</Title>
      {(alert[0] === 'add') ?  <Alert message={`${alert[1]} a été créé avec succès`} style={{marginBottom : 10}} class="alert-account" type="success" closable/> :''}
      {(alert[0] === 'edit') ? <Alert message={`${alert[1]}  a été mis à jour avec succès`} style={{marginBottom : 10}} class="alert-account" type="warning" closable/>:''}
      {(alert[0] === 'delete') ? <Alert message={`${alert[1]}  a été supprimé avec succès`} style={{marginBottom : 10}} class="alert-account" type="error" closable/>:''}

      <Add/>
      <div style={{marginTop : 75}}>
           {/*<GetTree/>*/}
           <Get/>
       </div>
    </Card>
    </JwtContextProvider>
  )

}

export default AccountChart
