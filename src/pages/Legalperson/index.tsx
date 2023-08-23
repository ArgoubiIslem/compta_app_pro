
import React, {useContext, useEffect, useState,useRef} from 'react';
import {useParams} from 'react-router-dom';
import { useRequest } from 'umi';
import './style.less'
import {
    Table,
    Form,
    Card,
    Button,
    Space,
    Typography,
    Input,
    Alert,
    Drawer,
    Spin,
    Row,
    Col, Modal,
  Divider


} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import "../Theme/style-table.less"
import axios from 'axios'
import JwtContextProvider, {JwtContext} from "../../provider/JwtContextProvider";
//const {Option} = Select;
const {Title} = Typography;
//j'ai pas encore ajouté ajouter un fichier .env
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL ='http://localhost:8000/api/v1'
const API_URL_LEGALPERSON = `${API_URL}/legalperson`
const API_URL_ACCOUNTS = `${API_URL}/accountTier`;
const API_URL_ACCOUNTCLASS = `${API_URL}/accountclasss`
const API_URL_ACCOUNTCHART = `${API_URL}/accountchats`
const API_URL_ACCOUNTTYPE = `${API_URL}/accounttypes`
const API_URL_ORGANISATION = `${API_URL}/organizations`
const PROVIDER ="fournisseur";
const CLIENT ="client";

interface props{
   item: {
      id?: number,
      first_name: string,
      last_name: string,
      adresss: string,
      phone_number: string,
      kind: string,
      name: string,
      account:
      {
        id?: number,
        name: string,
        organization: string,
        code: string,
        fiscal_year: string,

      }
   }

  }


const Legalperson: React.FC<props> = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('horizontal');

    const [alert, setAlert] = useState([{}])
    const [kind,setKind]=useState(0);
    const[isLoading,setIsLoading]=useState(true);
    let parts = window.location.href.split("/");
    let  legalpersonName =parts[parts.length - 1] ;

  const layout = {
    labelCol: { span: 4},
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

    const Add: React.FC = () => {
      const [parent, setParent] = useState<[{}]>([{}]);
        const [visible, setVisible] = useState(false)
        const[ achart,setAchart]=useState(0)
        const[ aclass,setAclass]=useState(0)
        const[ domain,setDomain]=useState(0)
        const[ atype,setAtype]=useState(0)
        const status = useContext(JwtContext);
        const token = status.jwtAccess;
        const fiscal=status.fiscal_year;
        const organization= status.organization
        const [errorMsg, setErrorMsg] = useState('');

        const inputRef: any = useRef(null);

        const validateInput = () => {

            const numeroCompte = String(inputRef.current.value).length <6;
            if (numeroCompte) {
                inputRef.current.value = (legalpersonName === `${CLIENT}` ? 411000 : 401000)
                inputRef.current.focus();
                return true
            }
            setErrorMsg('');
              return false;
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



        const config = {
            headers: {Authorization: `Bearer ${token}`},
          params: {
            page_size: 3000,
            fiscal_year:fiscal

          },
        };
        const config2 = {
            headers: {Authorization: `Bearer ${token}`},
        };
        const configAccountClass = {
            headers: {Authorization: `Bearer ${token}`},
          params: {
            code: 4,
          },
        };


      //----------------Get value parent of Client and Provider------------------------------------

      //-----------get value Parent of client---------------------------------
      var tableParentClient = parent.filter(e => e.code);
      var tableClient = tableParentClient.map(e => e);

      var parentClients = tableClient.filter(el => (el.code== 411),
      );
      const parentClient= parentClients[0]
      /*const parentClient = parentClients.map(e => e.parent).slice(1);

      var valueParentClient = [...new Set(parentClient)].toString();*/



      //-----------get value Parent of Provider
      var tableParentProvider = parent.filter(e => e.code);
      var tableProvider = tableParentProvider.map(e => e);

      var parentProviders = tableProvider.filter(el => (el.code== 401),
      );
      const parentProvider=parentProviders[0]
     /* const parentProvider = parentProviders.map(e => e.parent).slice(1);

      var valueParentProvider= [...new Set(parentProvider)].toString();*/


       useEffect(() => {
        axios.get(`${API_URL_ORGANISATION}/${status.organization}`,config2)
        .then(response => {
            setDomain(response.data.domain);
            axios.get(`${API_URL_ACCOUNTCHART}`,
            {
              headers: {Authorization: `Bearer ${token}`},
              params: {
                domain: response.data.domain,
              },
            }
            )
            .then(res => {
                setAchart(res.data.results[0].id);
                console.log("acharttesssst",achart)
            }).catch(error => {
            console.log(error.response);
          });
        }).catch(error => {
        console.log(error.response);
      });






      axios.get(`${API_URL_ACCOUNTTYPE}`,config2)
      .then(response => {
          setAtype(response.data.results[0].id);


      }).catch(error => {
      console.log(error.response);
    });
        axios.get(`${API_URL_ACCOUNTCLASS}`, configAccountClass)
        .then(response => {
            setAclass( response.data.results[0].id);

        }).catch(error => {
        console.log(error.response);
      });
        axios.get(`${API_URL_ACCOUNTS}`, config)
          .then(response => {
            setParent(response.data.results);
          }).catch(error => {
          console.log(error.response);
        });
      }, [parent.length]);




        const GetKind = () => {


                return(
                    <Form.Item name="kind" initialValue={legalpersonName ===`${CLIENT}`? 1: 0} style={{margin:"0px"}}>
                        {/*<p>{legalpersonName ==='client'? 1: 0}</p>*/}
                    </Form.Item>
                    )

            }


        const onFinish = (values: { kind: any; first_name: any; last_name: any; adresss: any; phone_number: any; code: string; name: string; })=> {
          console.log(values.kind)
          if(values.code.length<6||values.kind==1&& parseInt(values.code.slice(0, 3))!=411){

            setErrorMsg("Verifiez le code ! ")
          }
          else if(values.code.length<6||values.kind==0&& parseInt(values.code.slice(0, 3))!=401){

            setErrorMsg("Verifiez le code ! ")
          }
          else{
            axios.post(`${API_URL_LEGALPERSON}/`,{
              kind: values.kind,
              first_name: values.first_name,
              last_name: values.last_name,
              adresss: values.adresss,
              phone_number: values.phone_number,
              account: {
                  code: values.code,
                  name: values.name,
                  parent: legalpersonName===`${CLIENT}`? parentClient.id : parentProvider.id,
                  achart: achart,
                  aclass: aclass,
                  atype:  atype,
                  anature: "ACTIVE",
                  active: true,
                  fiscal_year : parseInt(fiscal),
                  organization: parseInt(organization),
                  credit_amount: 0,
                  debit_amount: 0,
                  tax_percentage: 0
              },


          }, config)
              .then(response => {
                  console.log(response)
                  setVisible(false)
                  setAlert(['add', values.name]);


              }).catch(error => {
              console.log(error.response)

              setErrorMsg("Numero du Compte " + values.code +" est existe déja.")
          });

          console.log(values)
          }

        }



        return (
            <>

              <Button style={{ float: 'right' }} type="primary" type="primary" onClick={showDrawer}>
                Ajouter
              </Button>

              <Drawer
                placement="right"
                 width="100%"
                onClose={onClose}
                visible={visible}
                closable={true}
              >

                <Form  {...layout} onFinish={onFinish} hideRequiredMark className="styleform" >
                  <div style={{
                    position: 'absolute',
                    zIndex: '1', width: '99%', backgroundColor: 'white',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '0px',
                      height: '30px',
                    }}>
                      <Form.Item name="title"
                                 style={{fontSize: '20px',width: '100%', paddingLeft: '20px' }}
                      >
                        <p>{legalpersonName === `${PROVIDER}` ? 'Ajouter ' + `${PROVIDER}` : 'Ajouter ' + `${CLIENT}`}</p>

                      </Form.Item>
                    </div>
                   <Divider/>
                   </div>


                    <Form.Item name="code"
                               label="N° du Compte: "
                               initialValue={legalpersonName === `${CLIENT}` ? 411 : 401}
                               style={{ paddingTop: '110px' }}
                    >
                      <input maxLength={6} ref={inputRef} style={{ width: '100%' }} />
                    </Form.Item>

                                <Form.Item
                                    name="name"
                                    label="Intitule: "
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Entrez l\'intitule',
                                        },
                                    ]}

                                >
                                    <Input onClick={validateInput} />
                                </Form.Item>
                                <GetKind />


                        <Form.Item >
                            <h2 style={{textDecoration:'underline',textAlign:'start',color:'blue',marginBottom:'20px',marginLeft:"50px"}}>
                                {legalpersonName === `${PROVIDER}` ? "Coordonnées " +`${PROVIDER}`: "Coordonnées "+`${CLIENT}`}
                            </h2>
                        </Form.Item>

                        <Form.Item
                                   name="first_name"
                            label="Nom : "
                            rules={[{ required: true }]}

                        >
                            <Input />
                        </Form.Item>
                      <Form.Item
                        name="last_name"
                        label="Prénom : "
                        rules={[{ required: true }]}
                      >
                        <Input/>
                      </Form.Item>
                          <Form.Item
                                    name="phone_number"
                                    label="Téléphone : "
                                    rules={[{ required: true }]}
                                >
                                    <Input type="number"/>
                                </Form.Item>



                        <Form.Item
                            name="adresss"
                            label="Adresse : "
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>


                                <Form.Item
                                    label="CP/Ville"
                                    style={{marginBottom: 0}}
                                >
                                    <Form.Item
                                        name="cp"
                                        style={{ display: 'inline-block', width: 'calc(20% - 8px)' ,marginRight: '8px' }}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name="ville"
                                        style={{ display: 'inline-block', width: 'calc(80% - 8px)'}}
                                    >
                                        <Input/>
                                    </Form.Item>
                                </Form.Item>

                                <Form.Item

                                    name="pays"
                                    label="Pays:"
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    label="Email : "

                                >
                                    <Input/>
                                </Form.Item>


                                <Form.Item
                                    name="siret"
                                    label="N° Siret: "

                                >
                                    <Input />
                                </Form.Item>
                                {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
                    <Form.Item {...tailLayout}>
                    <Button key="back" onClick={handleCancel}>
                           Retour
                       </Button>
                        <Button htmlType="submit" type="primary" >
                            Enregistrer
                        </Button>

                    </Form.Item>

                    </Form>

                </Drawer>

            </>
        );
    }

    const Edit: React.FC<props> = (props) => {
        const [visible, setVisible] = useState(false)
        const [kind, setKind] = useState(props.item.kind)
        const [first_name, setFirstname] = useState(props.item.first_name)
        const [last_name, setLastname] = useState(props.item.last_name)
        const [adresss, setAdresss] = useState(props.item.adresss)
        const [phone_number, setPhonenumber] = useState(props.item.phone_number)
        const [code, setCode] = useState(props.item.account.code)
        const [name, setName] = useState(props.item.account.name)
        const [fiscal_year, setFiscal_year] = useState(props.item.account.fiscal_year)
        const [organization, setOrganization] = useState(props.item.account.organization)
      const [parent, setParent] = useState(props.item.account.parent)
      const [accountId, setAccountId] = useState(props.item.account.id)
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

        const onFinishEdit = (values: { first_name: any; last_name: any; adresss: any; phone_number: any; code: any; name: any; }) => {

          const options: any = {
                url: `${API_URL_LEGALPERSON}/${props.item.id}/`,
                method: 'PATCH',
                data: {
                    kind:kind,
                    first_name:values.first_name,
                    last_name:values.last_name,
                    adresss:values.adresss,
                    phone_number:values.phone_number,
                    account: {
                        id:accountId,
                        code: values.code,
                        name: values.name,
                        parent:parent,
                        fiscal_year: fiscal_year,
                        organization: organization
                    }
                    },
                headers: { Authorization: `Bearer ${token}` }
            };
            axios(options)
                .then(response =>{
                    setAlert(['edit', props.item.account.name]);
                    setVisible(false)

                })
                .catch(error => {
                    console.log(error.response)
                    setVisible(true)
                })
        };




        return (
            <>
                <Button style={{marginTop: 0, width: 'auto', backgroundColor: '#faad14', border: 0 ,color: 'white'}}  onClick={showDrawer}>
                    Edit
                </Button>

                <Drawer
                  placement="right"
                  width="100%"
                  onClose={onClose}
                  visible={visible}
                >
                    <Form {...layout}  onFinish={onFinishEdit} hideRequiredMark className="styleform"  >

                      <div style={{  position: 'absolute',
                        zIndex: '1',  width: '99%', backgroundColor: 'white', padding: '0px'}}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          height: "30px",
                        }}>
                          <Form.Item name="title"
                                     style={{ fontSize: "20px",width: '100%', paddingLeft: '20px'}}
                          >
                            <p>{legalpersonName === `${PROVIDER}` ? 'Editer ' + `${PROVIDER}` : 'Editer ' + `${CLIENT}`}</p>

                          </Form.Item>

                        </div>
                        <Divider/>
                      </div>


                                    <Form.Item
                                        name="code"
                                        label="N° du Compte: "
                                        initialValue={props.item.account.code}
                                        onChange = {(v:any) => setCode(v.target.value)}
                                        style={{ paddingTop: '90px' }}
                                    >
                                        <Input maxLength={6}/>
                                    </Form.Item>

                                    <Form.Item
                                        name="name"
                                        label="Intitule: "
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Entrez l\'intitule',
                                            },
                                        ]}
                                        initialValue={props.item.account.name}
                                        onChange = {(v:any) => setName(v.target.value)}
                                    >
                                        <Input/>
                                    </Form.Item>



                        <Form.Item>
                            <h2 style={{textDecoration:'underline',textAlign:'start',color:'blue',marginBottom:'20px',marginLeft:"50px"}}>
                                {legalpersonName === `${PROVIDER}`? "Coordonnées "+`${PROVIDER}` : "Coordonnées "+`${CLIENT}`}
                            </h2>
                        </Form.Item>


                      <Form.Item

                        name="first_name"
                        label="Nom : "
                        initialValue={props.item.first_name}
                        onChange={(v: any) => setFirstname(v.target.value)}
                        rules={[
                          {
                              required: true,

                          },
                      ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="last_name"
                        label="Prénom : "
                        initialValue={props.item.last_name}
                        onChange={(v: any) => setLastname(v.target.value)}
                        rules={[
                          {
                              required: true,

                          },
                      ]}
                     >

                        <Input />
                      </Form.Item>


                      <Form.Item

                        name="phone_number"
                        label="Téléphone : "
                        initialValue={props.item.phone_number}
                        onChange={(v: any) => setPhonenumber(v.target.value)}
                        rules={[
                          {
                              required: true,

                          },
                      ]}
                      >
                        <Input type="number"/>
                      </Form.Item>



                                    <Form.Item
                                               name="adresss"
                                               label="Adresse : "
                                               initialValue= {props.item.adresss}
                                               onChange = {(v:any) => setAdresss(v.target.value)}
                                               rules={[
                                                {
                                                    required: true,

                                                },
                                            ]}
                                    >
                                        <Input />
                                    </Form.Item>




                                    <Form.Item
                                               label="CP/Ville"
                                               style={{marginBottom: 0}}
                                    >
                                        <Form.Item
                                            name="cp"
                                            style={{ display: 'inline-block', width: 'calc(20% - 8px)' ,marginRight: '8px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name="ville"
                                            style={{ display: 'inline-block', width: 'calc(80% - 8px)'}}
                                        >
                                            <Input/>
                                        </Form.Item>
                                    </Form.Item>



                                    <Form.Item

                                        name="pays"
                                        label="Pays:"
                                    >
                                        <Input/>
                                    </Form.Item>


                                    <Form.Item
                                               name="email"
                                               label="Email : "
                                    >
                                        <Input/>
                                    </Form.Item>




                                     <Form.Item

                                        name="siret"
                                        label="N° Siret: "
                                    >
                                        <Input />
                                    </Form.Item>


                        <Form.Item {...tailLayout }>
                        <Button key="back" onClick={handleCancel}>
                           Retour
                       </Button>
                            <Button htmlType="submit" type="primary"  >
                                Enregistrer
                            </Button>
                        </Form.Item>

                    </Form>

                </Drawer>

                </>
    )

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

        const handleOk = (values: any) => {
            axios.delete(`${API_URL_LEGALPERSON}/${props.item.id}`, config)
                .then(response => {
                    console.log(response)
                    setVisible(false)
                    setAlert(['delete', props.item.account.name]);

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
                    title={legalpersonName === 'fournisseur' ? "Supprimer Fournisseur" : "Supprimer Client"}
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

    const Get: React.FC = () => {

        const [data, setData] = useState([])
        const status = useContext(JwtContext);
        const token = status.jwtAccess;
        const config = {
            headers: {Authorization: `Bearer ${token}`},
          params: {
            page_size: 1000,
            fiscal_year: status.fiscal_year,
            organization: status.organization

          }
        };
        const columns = [

            {
                title: 'Numero du Compte',
              render: ( text,record )=> <span data-title="Numero du Compte">{record.account.code}</span>
            },

            {
                title: 'Intitulé',
              render:( text,record )=> <span data-title="Intitulé">{record.account.name}</span>
            },
            {
                title: 'Prénom',
                dataIndex: 'first_name',
              render: text => <span data-title="First name">{text}</span>
            },
            {
                title: 'Nom',
                dataIndex: 'last_name',
              render: text => <span data-title="Last name">{text}</span>

            },
            {
                title: 'Adresse',
                dataIndex: 'adresss',
              render: text => <span data-title="Adresss">{text}</span>

            },
            {
                title: 'Téléphone',
                dataIndex: 'phone_number',
              render: text => <span data-title="Phone number">{text}</span>

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


        useEffect(() => {


            axios.get(`${API_URL_LEGALPERSON}/`,config)
                    .then(response => {
                        setData(response.data.results);

                        setKind(
                            legalpersonName ===`${CLIENT}`? 1: 0)
                            setIsLoading(false)
                    }).catch(error => {
                      console.log(error)
                });
            },
            [alert,data.length])
            let dataFiltrer = data.filter((fil: any) => (
               fil.kind.includes(kind))
            )

            return (

                <Table loading={isLoading} style={{marginTop: 75, }} rowKey="id" bordered columns={columns} dataSource={dataFiltrer}/>

            )

    }


    return (
        <JwtContextProvider>
        <Card>

            <Title level={2}>{legalpersonName ===`${PROVIDER}` ? `${PROVIDER}`.charAt(0).toUpperCase()+`${PROVIDER}`.substr(1) : `${CLIENT}`.charAt(0).toUpperCase()+`${CLIENT}`.substr(1)}
            </Title>
            {(alert[0] === 'add') ?
                <Alert message={`${alert[1]} a été créé avec succès`} type="success" closable/> : ''}
            {(alert[0] === 'exist') ?
                <Alert message={`${alert[1]} est déja existe`} type="error" closable/> : ''}
                {(alert[0] === 'edit') ?
                <Alert message={`${alert[1]}  a été mis à jour avec succès`} type="warning" closable/> : ''}
            {(alert[0] === 'delete') ? <Alert message={`${alert[1]}  a été supprimé avec succès`} type="error" closable/>:''}
            <Add/>
            <Get/>
        </Card>
        </JwtContextProvider>

    )
}
export default Legalperson
