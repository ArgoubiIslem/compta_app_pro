import React, {useContext, useEffect, useState} from "react";
import JwtContextProvider, {JwtContext} from '../../provider/JwtContextProvider';
import {
  Card,
  Divider,
  Typography,
  Button,
  Form,
  DatePicker,
  Select,
  Input,
  Spin,
  Radio, Alert,Tooltip,
} from 'antd';
import {SaveOutlined} from "@ant-design/icons";
import axios from 'axios';
import '../Theme/style-table.less';
import moment from 'moment';
import 'moment/locale/zh-cn';


const customColors = ['red'];
const {Title} = Typography;

const API_URL = 'http://localhost:8000/api/v1';
const API_URL_JOURNALS = `${API_URL}/journalsTransaction`;
const API_URL_FISCALYEARS = `${API_URL}/fiscalyears`;
const API_URL_TRANSACTIONS = `${API_URL}/transactions`;
const API_URL_ORGANISATIONOFFER=`${API_URL}/organisationOffer`


interface IState {
  journale: string,
  nameJournale: string;
  client: string;
  date: string;
  compte: string;
  radio: string;
}

const Encaissement: React.FC = () => {

  const AddEncaissement: React.FC = () => {
    const [data, setData] = useState<[{}]>([{}]);
    const [dataClient, setDataClient] = useState<[{}]>([{}]);
    const [dataDate, setDataDate] = useState<[{}]>([{}]);
    const [dataCompte, setDataCompte] = useState<[{}]>([{}]);
    const [fiscalyear, setFiscalyear] = useState<[{}]>([{}]);
    const [offerEndDate, setOfferEndDate] = useState();
    const [isLoading, setIsLoading]= useState(true)
    const [alert, setAlert] = useState([{}]);
    const [state, setState] = useState<IState>({
      journale: "BQ",
      nameJournale: '',
      client: '',
      date: '',
      compte: '',
      radio: 'Brouillon',
    });
    const account_client = 411;
    const account_compte = 512;
    const status = useContext(JwtContext);
    const token = status.jwtAccess;
    const fiscal = status.fiscal_year;
    const organisation = status.organization
    const [form] = Form.useForm();
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
    const configJournal = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page_size: 3000,
        fiscalyear: fiscal,
        organization: organisation,
        journal_type:"BQ"
      },
    };

    const configOffer = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        organisation: organisation,
        offertype:"Compta"
      },
    };

    const formItemLayout = {
      labelCol: {
        xs: {
          span: 8,
        },
        sm: {
          span: 4,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 16,
        },
      },
    };


    //-----------------------get journal---------------------------


    const optien = data.map((e: any) => <Option value={e.id} key={e.id}>{e.code}</Option>)
    const onChangeJournal = (value: any) => {
      state.journale = value;
      const journal=data.filter(e=>e.id==value)[0]
      setDataCompte(journal.accounts);
      setDataClient(journal.accounts);
      form.setFieldsValue({client: ''});
      form.setFieldsValue({account_client: ''});
      form.setFieldsValue({date: ''});
      form.setFieldsValue({amount_ttc: ''});
      form.setFieldsValue({account_compteBancaire: ''});
      form.setFieldsValue({label: ''});
      form.setFieldsValue({journale: journal.name});
    };

    useEffect(() => {
      axios.get(`${API_URL_JOURNALS}/`, configJournal)
        .then(response => {
          if(data.length==0)
          {
            setIsLoading(false)
          }
          setData(response.data.results);
          setState({...state,journale:response.data.results[0].id})
          setDataCompte(response.data.results[0].accounts);
          setDataClient(response.data.results[0].accounts);
          setIsLoading(false)
        }).catch(error => {
          console.log(error);
          setIsLoading(false)
      });
      axios.get(`${API_URL_ORGANISATIONOFFER}/`, configOffer)
      .then(response => {
        setOfferEndDate(response.data[0].endDate)
      })
      .catch(error => {
        console.log(error);
      })


    }, [data.length]);

    //-----------------------------get Client---------------------------
    const client = dataClient.filter((e) => e.code,);
    const tableCode = client.map(e => e);
    const list = tableCode.filter(item => item.code.toString().substr(0, 3) == account_client);

    const afficheListeClient = list.map((el) => <Option key={el.id} value={el.id}>{el.code} - {el.name}</Option>);

    const onChangeClient = (el: any) => {
      state.client = el;
      let listName = dataClient.filter((fil: any) => fil.id === state.client);
      state.client = listName.map((e) => e.name);
      form.setFieldsValue({client: state.client});
    };


    //-----------------------------get value Date---------------------------
    const dateEncaissement = dataDate.map(s => s).filter(e => e.id == fiscal && e.organization.id == organisation)

    const yearDate = dateEncaissement.map(el => el.year);
    state.date = yearDate.toString();

    let msg: string;
    let inactif: boolean;
    if (fiscalyear.archived==true && fiscalyear.open==false ) {
    inactif=true
    msg="l'année fiscale "+state.date+" est déjà archivée ";
    }
    else if(new Date(offerEndDate)<new Date()){
      inactif=true
      msg="Votre offre a expiré ";
    }
    else{
    inactif=false
    msg="";}

    const dateTotal = state.date;
    const total = dateTotal? moment(dateTotal) :moment();

    const onChangeDate = (e: any) => {
      state.date = e;
    };

    useEffect(() => {
      axios.get(`${API_URL_FISCALYEARS}/`, config)
        .then(response => {
          setDataDate(response.data.results);
        }).catch(error => {
          console.log(error);
      });

    }, [alert]);
    useEffect(() => {
      axios.get(`${API_URL_FISCALYEARS}/${fiscal}`, config)
        .then(response => {
          setFiscalyear(response.data);

        }).catch(error => {
          console.log(error)
        });
    },
      [alert]);
//-----------------------------get compte bancaire---------------------------
    const listeCompte = dataCompte.filter(e => e.code)
    const tableCompte = listeCompte.map(e => e);
    const listCompteBancaire = tableCompte.filter(item => item.code.toString().substr(0, 3) == account_compte);
    const afficheListeCompte = listCompteBancaire.map((el) => <Option key={el.id}
                                                                    value={el.id}>{el.code} - {el.name}</Option>);

    const onChangeCompte = (el: any) => {
      state.compte = el
      let listcompeName = dataCompte.filter((fil: any) => fil.id === state.compte);
      state.compte = listcompeName.map((e) => e.name);
      form.setFieldsValue({compte: state.compte});
    }


//-----------------------------get radio---------------------------
    const onChangeRadio = (e: any) => {
      state.radio = e.target.value
    }
    //------------------------------

    const onFinish = (values: {
      status: any, fiscalyear: string, journal: any, category: any,
      date: any, label: string, account_client: string, account_compteBancaire: string,
      amount_ttc: string, client: string, compte: string
    }) => {
      if(parseInt(values.amount_ttc) <0 ){

        setAlert(['other', "Montant réglé TTC doit être positif"]);
      }
      else{
       axios.post(`${API_URL_TRANSACTIONS}/`, {
        organisation:organisation,
        status: state.radio,
        ficalyear: fiscal,
        journal: state.journale,
        category: values.category,
        date: (values.date).toISOString(),
        due_date: (values.date).toISOString(),
        label: values.label,
        transactionitem_set: [
          {
            account: values.account_client,
            credit_amount: values.amount_ttc,
            debit_amount: '0.00',
            date: (values.date).toISOString(),
            due_date: (values.date).toISOString(),
            label: values.label,
          },
          {
            account: values.account_compteBancaire,
            credit_amount: '0.00',
            debit_amount: values.amount_ttc,
            date: (values.date).toISOString(),
            due_date: (values.date).toISOString(),
            label: values.label,
          }
        ]
      }, config)
        .then(response => {
          console.log(response);
          setAlert(['add', values.category]);
          form.resetFields()

      }).catch(function (error) {
          if (error.response) {
            setAlert(['other', error.response.data.message]);
            console.log(error.response.data.message);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
          console.log(error.config);
        })
      }

    };

console.log("list",list)
console.log("listCompteBancaire",listCompteBancaire)
    return (
      <Card>
        <Title level={2}>Enregistrer un encaissement (Journal de Banque)</Title>
        <Divider/>
        {isLoading ? <Spin size="default" />:

          <div>
      {list.length ==0 || listCompteBancaire.length == 0 ?
         <Alert message={`On peut pas enregistrer un encaissement (Journal de BQ)`} type="warning" closable
         className="alertInput"/> : " "}
            {(alert[0] === 'add') ?
          <Alert message={`Encaissement a été créer avec succès`} type="success" closable
                 className="alertInput"/> : " "}
                   { inactif ? <Alert message="L'opération demandée n’est pas possible!" description={msg}
         type="error"  showIcon closable /> : " "}

          {(alert[0] === 'other') ? <Alert message={`${alert[1]} `} type="error"  onClose={setTimeout(()=>{
            setState({...state,isVisible: false})},5000)} /> : ''}
         </div>
        }

          {customColors.map(color => (
         <Tooltip title={msg} color={color} key={color} placement="top" >
         <br />
        <Form
          {...formItemLayout}
          name="encaisement"
          onFinish={onFinish}
          scrollToFirstError
          form={form}
          initialValues={state.radio}
        >

          <Form.Item label="Journale" style={{marginBottom: 0}}>

            <Form.Item
              name="journal"
              style={{display: 'inline-block'}}
              rules={[
                {
                  required: true,
                  message:"Le champ journal est obligatoire"
                },]}

            >
              <Select
                placeholder="Journal"
                onChange={onChangeJournal}
                style={{width: 260}}

              >
                {optien}
              </Select>
            </Form.Item>

            <Form.Item
              name="journale"
              style={{display: 'inline-block', marginLeft: '20px'}}
              >
              <Input disabled={inactif} className='inputTitle'/>
            </Form.Item>
          </Form.Item>


          <Form.Item label="Client" style={{marginBottom: 0}}>

            <Form.Item
              name="account_client"
              style={{display: 'inline-block'}}
              rules={[
                {
                  required: true,
                  message:"Le champ conmpte client est obligatoire"
                },]}

            >
              <Select
                disabled={inactif}
                style={{width: 260}}
                onChange={onChangeClient}

              >
                {afficheListeClient}
              </Select>
            </Form.Item>
            <Form.Item
              name="client"
              style={{display: 'inline-block', marginLeft: '20px'}}>
              <Input disabled={inactif} className='inputTitle'/>
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Date Encaissement"
            name="date"
            rules={[
              {
                required: true,
              },]}
            >
            <DatePicker disabled={inactif}
          disabledDate={d => !d || d.isAfter(`${dateTotal}-12-31`) || d.isSameOrBefore(`${dateTotal-1}-12-31`) }
            style={{width: 260}} format="DD-MM-YYYY" onChange={onChangeDate} defaultPickerValue={total}/>
          </Form.Item>

          <Form.Item
            name="amount_ttc"
            label="Montant réglé TTC"
            rules={[
              {
                required: true,
              },]}
            >
            <Input disabled={inactif} type="number" style={{width: 260}}/>
          </Form.Item>

        {/*
         <Form.Item
            name="category"
            label="N° pièce"
            rules={[
              {
                required: true,

              },]}>
            <Input disabled={inactif} type="number" style={{width: 260}}/>
          </Form.Item>

        */}
          <Form.Item
            label="Compte bancaire à débiter"
            style={{marginBottom: 0}}>

            <Form.Item
              style={{display: 'inline-block'}}
              name="account_compteBancaire"
              rules={[
                {
                  required: true,
                  message:"Le champ compte bancaire est obligatoire"
                },]}
            >
              <Select
                disabled={inactif} style={{width: 260}}
                onChange={onChangeCompte}
              >
                {afficheListeCompte}
              </Select>
            </Form.Item>
            <Form.Item
              name="compte"
              style={{display: 'inline-block', marginLeft: '20px'}}>
              <Input disabled={inactif} className='inputTitle'/>
            </Form.Item>
          </Form.Item>

          <Form.Item
            name="label"
            label="Libellé"
            rules={[
              {
                required: true,
              },]}
            >
            <Input disabled={inactif} className='inputlibelle'/>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
          >
            <Radio.Group
              disabled={inactif}
              onChange={onChangeRadio}
              defaultValue="Brouillon"
            >
              <Radio value="Brouillon">Brouillard</Radio>
              <Radio value="Valide">Validation</Radio>
            </Radio.Group>
            <div style={{display: 'inline-block'}}>
              <Tooltip title={msg} color={color} key={color}>
              {list.length == 0 || listCompteBancaire.length == 0  ?
            <Button htmlType="submit" type="primary" style={{display: 'flex'}} disabled>
                    Enregistrer<SaveOutlined/>
                  </Button>:
                  <Button htmlType="submit" type="primary" style={{display: 'flex'}} disabled={inactif}>
                    Enregistrer<SaveOutlined/>
                  </Button>}
                </Tooltip>
            </div>
          </Form.Item>
        </Form>
        </Tooltip>
      ))}
      </Card>
    )
  }
  return (
    <JwtContextProvider>
      <AddEncaissement/>
    </JwtContextProvider>
  )
}
export default Encaissement;
