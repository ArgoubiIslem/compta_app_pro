import React, {  useContext, useEffect, useState } from 'react';
import {Table, Select, Form, Card, Modal, Drawer, Button, Space, Typography, Input, Alert} from 'antd';
import axios from 'axios'
import JwtContextProvider, { JwtContext } from '../../provider/JwtContextProvider';
import './style.less'
import '../Theme/style-table.less'
import {SearchOutlined} from "@ant-design/icons";
const { Option } = Select;

const { Title } = Typography;
//j'ai pas encore ajouté ajouter un fichier .env
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL ='http://localhost:8000/api/v1'
const API_URL_ORGANIZATIONS = `${API_URL}/organizations`
const API_URL_DOMAINS = `${API_URL}/domains`
const API_URL_OFFER = `${API_URL}/offer`
const API_URL_TAXSYSTEMS = `${API_URL}/taxsystems`;
const API_URL_LEGALSTATUS = `${API_URL}/legalstatus`
const API_URL_ORGANISATIONOFFER=`${API_URL}/organisationOffer`


interface props{
  item: {
    id: number,
    display_name: string,
    legal_name: string,
    adress: string,
    phone_number: string,
    email: string,
    domain: string,
    owner: string,
    taxsystem: string,
  }
}

interface IState {
 domaine: string,
  propriete: string,
  show1: boolean,
  show2: boolean,
  tax: string,
  offer: string,
  legalStatus: string,

}

const EditerOrganisation: React.FC <props> =() => {
  const [alert, setAlert] = useState([{}])
  const [state,setState]=useState<IState>({
    show1: false,
    show2:false
  })

  const token =  window.localStorage.getItem('jwtAccess');
  const [taxsystem, settaxsystem] = useState([])
  const [legalStatus,setLegalStatus]=useState([])
  const [domains, setDomains] = useState([])
  const [offers, setOffers] = useState([])
  const config = {
    headers: { Authorization: `Bearer ${token}`}
  };

  useEffect(() => {
    axios.get(`${API_URL_TAXSYSTEMS}/`, config)
      .then(response => {
        settaxsystem(response.data);
      }).catch(error => {
        console.log(error)
      });
      axios.get(`${API_URL_DOMAINS}/`, config)
      .then(response => {
        setDomains(response.data.results);
        console.log(config)
      }).catch(error => {
        console.log(error)
      });

      axios.get(`${API_URL_LEGALSTATUS}`)
      .then(response => {
         setLegalStatus(response.data.results);

      }).catch(error => {
        console.log(error)
      });
      axios.get(`${API_URL_OFFER}/`)
      .then(response => {
        setOffers(response.data.results.filter((result: any) => result.module.code.includes("Compta")));
      console.log("Offers",offers);
      }).catch(error => {
        console.log(error)
      });
  }, [legalStatus.length,offers.length])

  const Edit: React.FC <props> = (props )=> {
    const [visible, setVisible] = useState(false)
    const [display_name, setdisplay_name] = useState(props.item.display_name)
    const [legal_name, set_legalname] = useState(props.item.legal_name)
    const [adresss, setadresss] = useState(props.item.adresss)
    const [phone_number, setphone_number] = useState(props.item.phone_number)
    const [email, setemail] = useState(props.item.email)
    const [domain, setdomain] = useState(props.item.domain)
    const [owner, setowner] = useState(props.item.owner)
    const [dataTax, setDataTax] = useState<[{}]>([{}])
    const [legalstatu,setLegalStatu]= useState(props.item.legalstatus)
    const [form] = Form.useForm();


    const status  = useContext(JwtContext);
    const token  = status.jwtAccess;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    const showDrawer = () => {
      setVisible(true);
    };
    const onClose = () => {
      setVisible(false);
    };

    const handleCancel = () => {
      setVisible(false)
    };



     //---get domain--------------------
    let optionItems = domains.map((domain:any) =>
      <Option value={domain.id} key={domain.id}> {domain.name}</Option>
    );

       //---get legal status--------------------
       let optionItems2 = legalStatus.map((legalstatus:any) =>
       <Option value={legalstatus.id} key={legalstatus.id}> {legalstatus.name}</Option>
     );

  //----------------get tax system--------------
      const listTax = taxsystem.map(e => <Option key={e.id} value={e.id}>{e.name}</Option>)


   //---------------------------------------------------------------

    const onFinishEdit = (values: {
      display_name: string; legal_name: string; adresss: string; phone_number: string; email: string; domain: string ; legalstatus: any,owner: any; taxsystem: any;
    }) => {
      const options: any = {
        url: `${API_URL_ORGANIZATIONS}/${props.item.id}/`,
        method: 'PATCH',

        data :{
          display_name: values.display_name,
          legal_name:values.legal_name,
          adresss: values.adresss,
          phone_number: values.phone_number,
          email: values.email,
          domain: values.domain,
          owner: owner,
          taxsystem: values.taxsystem,
          legalstatus: values.legalstatus

        },
        headers: { Authorization: `Bearer ${token}` }
      };
      axios(options)
      .then(response =>{
        console.log('patch ok')
        console.log(response)
        setAlert(['edit', values.display_name]);
        setState({...state,show2:true})
        setVisible(false)
        })
      .catch(error => {
          console.log('patch error')
          console.log(error.response)
      })

    };

      return (
        <div>
          <Button style={{marginTop : 0, width:'auto', backgroundColor:'#faad14', border:0}}  type="primary" onClick={showDrawer}>
            Editer
          </Button>
          <Drawer
        title="Mettre a jours l'organisation"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        maskClosable={false}
        width="100%"
      >

      <Form
        name="control-ref"
        onFinish={onFinishEdit}
        form={form}
      >
      <Form.Item
          initialValue= {props.item.display_name}
          onChange = {(v:React.ChangeEvent<HTMLInputElement>) => setdisplay_name(v.target.value)}
          name="display_name"
          label="Nom de l'organisation "

          rules={[
            {
              required: true,
              message: "Entrez le nom de l'organisation!",
            },
          ]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
         initialValue= {props.item.legal_name}
          name="legal_name"
          label="Nom légale de l'organisation"

          onChange = {(v:React.ChangeEvent<HTMLInputElement>) => set_legalname(v.target.value)}

          rules={[
            {
              required: true,
              message: "Entrez le nom légale de l'organisation!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          initialValue= {props.item.phone_number}
          onChange = {(v:React.ChangeEvent<HTMLInputElement>) => setphone_number(v.target.value)}
          name="phone_number"
          label= "Téléphone professionnel"

          rules={[
            {
              required: true,
              message: "Entrez le Téléphone professionnel",

            },
            {
              len: 8, // Validate exact length of 8 characters
              message: "Le numéro de téléphone doit contenir exactement 8 chiffres.",
            },
          ]}
        >
          <Input  type="number"/>
        </Form.Item>

        <Form.Item
         initialValue= {props.item.adresss}
          name="adresss"
          label="Adresse de l'organisation"

          onChange = {(v:any) => setadresss(v.target.adress)}

          rules={[
            {
              required: true,
              message: "Entrez l'adresse de votre organisation!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
         initialValue= {props.item.email}
          name="email"
          label="Email"

          onChange = {(v:React.ChangeEvent<HTMLInputElement>) => setemail(v.target.value)}

          rules={[
            {
              required: true,
              message: "Entre votre email",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
         initialValue= {props.item.legalstatus}
          name="legalstatus"
          label="Forme Juridique"
          onChange = {(v:React.ChangeEvent<HTMLInputElement>) => setLegalStatu(v.target.value)}
       rules={[
            {
              required: true,
              message: "Entrez la forme Juridique",
            },
          ]}
        >
          <Select placeholder="Forme Juridique">
            {optionItems2}
          </Select>
        </Form.Item>
        <Form.Item
         initialValue= {props.item.domain}
          name="domain"
          label="Domaine d'activités"
          onChange = {(v:React.ChangeEvent<HTMLInputElement>) => setdomain(v.target.value)}
       rules={[
            {
              required: true,
              message: "Entrez le domaine!",
            },
          ]}
        >
          <Select placeholder="Domain d'activités">
            {optionItems}
          </Select>
        </Form.Item>
        <Form.Item
          initialValue={props.item.taxsystem}
          name="taxsystem"
          label="Régime fiscal"
          onChange={(v: any) => settaxsystem(v.target.value)}
          rules={[
            {
              required: true,
              message: "Entrez le régime fiscal!",
            },
          ]}
          >
          <Select>
            {listTax}
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
  const Delete:  React.FC<props> = (props) => {
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

    const handleOk = (values: any) => {
      axios.delete(`${API_URL_ORGANIZATIONS}/${props.item.id}`,config)
      .then(response => {
        console.log(response)
        setVisible(false)
        setAlert(['delete', props.item.display_name]);


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
            title="Supprime une organisation"
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
            Etes-vous sûr que vous voulez supprimer {props.item.display_name}
          </Modal>
        </div>
      );

  }


  const Add: React.FC= () => {
    const [visible, setVisible] = useState(false)
    const context  = useContext(JwtContext);
    const [state,setState]=useState<IState>({
      domaine:'',
      propriete:'',
      tax: '',
      legalStatus: '',
      offer:""
    })
    const [form] = Form.useForm();
    const userId =context.user_id
    const [offer, setOffer] = useState("");

    const organisation = context.organization
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
      setVisible(false);
    };
    const handleCancel = () => {
      setVisible(false)
    };
    const onchangetax = (e: string) => {
      state.tax = e
    }

    const onchangeLegalStatus = (e: string) => {
      state.legalStatus = e
    }



    //---------------------get Domaines----------------------
      const optionItems = domains.map((domain: any) =>
        <Option value={domain.id} key={domain.id}>{domain.id} - {domain.name}</Option>
      );
      const onchangedom= (e: any) => {
       state.domaine =e
      }


      //---------------------get Offers----------------------

      const onChangeOffer = (e: string) => {
        state.offer = e
      }
      const GetOffers = () => {
        const optionOffers = offers.map((offer: any) =>
        <Option value={offer.id} key={offer.id}>{offer.id} - {offer.name}</Option>
      );
        return (
          <Form.Item
            name="offer"
            label="Offer"
            rules={[{ required: true }]}
          >
            <Select placeholder="Offer" onChange={onChangeOffer}>
              {optionOffers}
            </Select>
          </Form.Item>


        )
      }

    //-------------------get Tax System------------------------------------------
    const Gettaxsysteme = () => {
      const optionTax = taxsystem.map((taxSystem: any) =>
        <Option value={taxSystem.id} key={taxSystem.id}> {taxSystem.name}</Option>
      );
      return (
        <Form.Item
          name="taxsystem"
          label="Régime fiscal"
          rules={[{ required: true }]}
        >
          <Select placeholder="Régime fiscal" onChange={onchangetax}>
            {optionTax}
          </Select>
        </Form.Item>


      )
    }
    //---------------------------------------------------------------------------
  //-------------------get Legal Status------------------------------------------
  const GetLegalStatus = () => {
    const optionStatus = legalStatus.map((legalStat: any) =>
      <Option value={legalStat.id} key={legalStat.id}> {legalStat.name}</Option>
    );
    return (
      <Form.Item
        name="legalStatus"
        label="Forme Juridique"
        rules={[{ required: true }]}
      >
        <Select placeholder="Forme Juridique" onChange={onchangeLegalStatus}>
          {optionStatus}
        </Select>
      </Form.Item>


    )
  }
  //---------------------------------------------------------------------------


    const onFinish = (values: {
      display_name: string; legal_name: string; adresss: string; phone_number: string; email: string; domain: string
    })=>{
      axios.post(`${API_URL_ORGANIZATIONS}/`, {
      // const data= {
        display_name: values.display_name,
        legal_name: values.legal_name,
        adresss: values.adresss,
        phone_number: values.phone_number,
        email: values.email,
        domain: values.domain,
        owner: parseInt(userId),
        taxsystem: state.tax,
        legalstatus:state.legalStatus,
        offer:state.offer
      // }
      },config)
      .then(response => {
        console.log(response)
        setVisible(false)
      setState({...state,show1:true})
        setAlert(['post', values.display_name]);


      }).catch(error => {
        console.log(error.response)
        console.log(values)
        console.log(values.domain)


      });
//       setState({...state,show1:true})
//       setAlert(['post', values.display_name]);
// console.log(data)
    }

    return (
        <div>
       {offer!="Compta Expert Comptable"&& offer!=""?

<>
<Alert message={`Améliorer votre offre pour ajouter des organisation`} type="error" />

</>  :
offer=="Compta Expert Comptable"?
<Button style={{ float: 'right' }} type="primary" onClick={showDrawer}>
Ajouter
</Button>:<></>
}
          <Drawer
        title="Ajouter une organisation"
        placement="right"
        closable={true}
        onClose={onClose}
        visible={visible}
        width="100%"
      >
      <Form
        onFinish={onFinish}
        form={form}
      >
				<Form.Item
				name="display_name"
				label="Nom de l'organisation"
				 rules={[{ required: true }]}>
				  <Input />
				</Form.Item>
				<Form.Item
				name="legal_name"
				label="Nom légal de l'organisation"
				 rules={[{ required: true }]}>

				  <Input />
				</Form.Item>
				<Form.Item
        name="adresss"
        	label="Adresse de l'organisation"
				rules={[{ required: true }]}>
				  <Input />
				</Form.Item>
				<Form.Item
				name="phone_number"

				label="Téléphone professionnel"
				 rules={[{ required: true }]}>
				  <Input />
				</Form.Item>
				<Form.Item
				name="email"
				label="Email"
        rules={[{ required: true }]}>
				<Input />
        </Form.Item>
        <GetLegalStatus/>
        <Form.Item
          name="domain"
          label="Domaine d'activités"
          rules={[{ required: true }]}>
          <Select  placeholder="domaine d'activités" onChange={onchangedom}>
            {optionItems}
          </Select>
        </Form.Item>
        <Gettaxsysteme />
        <GetOffers/>

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
  const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState({
      select: '',
      searchedColumn: '',
    })
  const status  = useContext(JwtContext);
  const token  = status.jwtAccess;



  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page_size: 1000,
      owner:status.user_id
    }
  };
//--------------------------fitre organization---------------------
    const getColumnSearchProps = dataIndex => ({
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
        <div style={{padding: 8}}>
          <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{marginBottom: 8, display: 'block'}}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined/>}
              size="small"
              style={{width: 90}}
            >
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
              Reset
            </Button>

          </Space>
        </div>
      ),
      onFilter: (value, record) => record.display_name
          ? record.display_name.toString().toLowerCase().includes(value.toLowerCase())
          : '',

    })
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setState({
        select: selectedKeys[0],
        searchedColumn: dataIndex,
      });
    };

    const handleReset = clearFilters => {
      clearFilters();
      setState({searchText: ''});
    };
//--------------------------------------
  const columns = [

        {

          title: 'Nom',
          dataIndex: 'display_name',
          ...getColumnSearchProps('name')

        },
        {
          title: 'Nom Legal',
          dataIndex: 'legal_name',
          render: text => <span data-title="Legal name">{text}</span>
        },
        {
          title: 'Numéro de télepohone',
          dataIndex: 'phone_number',
          render: text => <span data-title="Numero de télepohone">{text}</span>
        },
        {
          title: 'Adresse',
          dataIndex: 'adresss',
          render: text => <span data-title="Address">{text}</span>
        },
        {
          title: 'Email',
          dataIndex: 'email',
          render: text => <span data-title="Email">{text}</span>
        },


         {
      title: 'Actions',
      dataIndex: 'action',
          render: (text, record) => (
            <span data-title="Actions">
          <Space className="positionButton">
            {/*<Delete item ={record}/>*/}
            <Edit item ={record}/>
          </Space>
          </span>
          ),
    },
  ];
  ;
  useEffect(() => {
    axios.get(`${API_URL_ORGANIZATIONS}`,config)
    .then(response => {
        setData(response.data.results);
        console.log("organisation: ",response.data.results);
        setIsLoading(false)
    }).catch(error => {
      console.log(error);
    })
  },[data.length,isLoading]);
  return(
    <Table style={{marginTop : 75}} rowKey="id" bordered columns={columns}  loading={isLoading} dataSource={data} />
  )
}


    return(
      <JwtContextProvider>
      <Card>
        {(alert[0] === 'post' && !state.show1)?
          <Alert message={`l'organisation ${alert[1]} a été créé avec succès`} type="success" onClose={setTimeout(()=>{
            setState({...state,show1: true})},5000)}  /> : ''}
        {(alert[0] === 'edit' && !state.show2)?
          <Alert message={`l'organisation ${alert[1]}  a été mis à jour avec succès`} type="warning" onClose={setTimeout(()=>{
            setState({...state,show2: true})},5000)}  /> : ''}
        <Title level={2}>Liste des Organisations </Title>
        <Add/>
        <Get/>
      </Card>
      </JwtContextProvider>
    )

    }
export default EditerOrganisation;
