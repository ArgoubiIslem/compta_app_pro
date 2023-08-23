import React, {useContext, useEffect, useState,} from 'react';
import JwtContextProvider, {JwtContext} from '../../provider/JwtContextProvider';

import {
  Card,
  Divider,
  Typography,
  Button,
  Form,
  DatePicker,
  Select,
  Input,Spin,
  Radio, Alert,Tooltip
} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import axios from 'axios';
import '../Theme/style-table.less';
import moment from 'moment';
import 'moment/locale/zh-cn';


const {Title} = Typography;
const API_URL = 'http://localhost:8000/api/v1';
const API_URL_JOURNALS = `${API_URL}/journalsTransaction`;
const API_URL_FISCALYEARS = `${API_URL}/fiscalyears`;
const API_URL_ORGANISATIONOFFER=`${API_URL}/organisationOffer`
const API_URL_TRANSACTIONS = `${API_URL}/transactions`

interface IState {
  journale: string;
  nameJournale: string;
  compteClient: string;
  nameClient: string;
  dateClient: string;
  echeanceClient: string;
  fiscal_year: string;
  tva: number,
  totalTTC: number,
  totalht: number,
  totaltva: number,
  codeContrePartie: string,
  nameContrePartie: string,
  codeTvaClient: string,
  nameTvaClient: string,
  radio: string,
  date: string,
  due_date: string,
  isVisible: boolean
}

const FactureClient: React.FC = () => {


  const AddFactureClient: React.FC = () => {
    const [data, setData] = useState<[{}]>([{}]);
    const [dataClient, setDataClient] = useState<[{}]>([{}]);
    const [fiscalyear, setFiscalyear] = useState<[{}]>([{}]);
    const [contres, setContre] = useState<[{}]>([{}]);
    const [compte, setCompte] = useState<[{}]>([{}]);
    const [alert, setAlert] = useState([{}]);
    const [offerEndDate, setOfferEndDate] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState<IState>({
      journale: 'VT',
      nameJournale: '',
      compteClient: "",
      nameClient: "",
      dateClient: '',
      echeanceClient: '',
      tva: 20,
      totalTTC: 0,
      codeContrePartie: "",
      nameContrePartie: "",
      codeTvaClient: "",
      nameTvaClient: "",
      radio: 'Brouillon',
      totalht: '',
      totaltva: '',
      date: '',
      due_date: '',
      isVisible: false
    });
    // const account_compte=[{code:"701"},{code:"706"},{code:"707"},{code:"708"}]
    const account_compte=["701","706","707","708"]
    const account_client = 411;
    const account_tva =4431
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
    //----------------------------get Journal-------------

    const optienJournale = data.map((e: any) => <Option value={e.id} key={e.id}>{e.code}</Option>)



    const onChangeJournal = (value: any) => {
      state.journale = value;
      const journal=data.filter(e=>e.id==value)[0]
      form.setFieldsValue({nameJournale: journal.name});
      form.setFieldsValue({account_client:""});
      form.setFieldsValue({name_account_client:""});
      form.setFieldsValue({credit_amount:""});
      form.setFieldsValue({due_date:""});
      form.setFieldsValue({date:""});
      form.setFieldsValue({acount_contrepartieClient:""});
      form.setFieldsValue({account_comptetvaClient:""});
      form.setFieldsValue({name_compte_tva:""});
      form.setFieldsValue({name_contre_partie:""});
      form.setFieldsValue({debit_amountt:""});
      form.setFieldsValue({debit_amounts:""});
      form.setFieldsValue({label:""});
      setDataClient(journal.accounts);
      setContre(journal.accounts);
      setCompte(journal.accounts);

    };

    const configJournal = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page_size: 3000,
        fiscalyear: fiscal,
        organization: organisation,
        journal_type:"VT"
      },

    };
    useEffect(() => {
       axios.get(`${API_URL_JOURNALS}/`, configJournal)
        .then(response => {
          if(data.length==0)
          {
            setIsLoading(false)
          }
          setData(response.data.results);
          setDataClient(response.data.results[0].accounts);
          setContre(response.data.results[0].accounts);
          setCompte(response.data.results[0].accounts);
          setIsLoading(false)
        }).catch(error => {
          console.log(error);
      });
      axios.get(`${API_URL_ORGANISATIONOFFER}/`, configOffer)
      .then(response => {
        setOfferEndDate(response.data[0].endDate)
      })
      .catch(error => {
        console.log(error);
      })
    }, [data.length]);
    //-----------------------------get client--------------------


    const client = dataClient.filter((e) => e.code);
    const tableCode = client.map(e => e);

    const list = tableCode.filter(item => ((item.code.toString().substr(0, 3) == account_client)));
    const afficheListe = list.map((el) => <Option key={el.id} value={el.id}>{el.code} - {el.name}</Option>);

    const onChangeClient = (el: any) => {
      state.compteClient = el;
      const listName = dataClient.filter((fil: any) => fil.id === state.compteClient);
      state.nameClient = listName.map((e) => e.name);
      form.setFieldsValue({name_account_client: state.nameClient});

    };


    //----------------- get date et due date------------------------

    const year = fiscalyear.year?.toString()||"";
    let msg: string;
    let inactif: boolean;
    if (fiscalyear.archived==true && fiscalyear.open==false ) {
    inactif=true
    msg="l'année fiscale "+year+" est déjà archivée ";
    }
    else if(new Date(offerEndDate)<new Date()){
      inactif=true
      msg="Votre offre a expiré ";
    }
    else{
    inactif=false
    msg="";}
    const dateTotal = year;
    const total = dateTotal? moment(dateTotal) :moment();

    const onChangeDate = (e: any) => {
      const d= new Date(e)
      if (d) {
        d.setHours((-1 * d.getTimezoneOffset()) / 60);
      }
      state.dateClient=d;
    };
    const onChangeDueDate = (e: any) => {

      const d= new Date(e)
      if (d) {
        d.setHours((-1 * d.getTimezoneOffset()) / 60);
      }
      state.echeanceClient=d;
    };


      useEffect(() => {
        axios.get(`${API_URL_FISCALYEARS}/${fiscal}`, config)
          .then(response => {
            setFiscalyear(response.data);
            console.log(response)
          }).catch(error => {
            console.log(error);
          });
      },
        [alert]);

//------------------------------get value tva and ttc--------------------------------------

    const onchangeTva = (e: any) => {
      state.tva = e.value;
      const tvaVal = (e.value / 100);
      const tottva = (state.totalTTC / (1 + tvaVal)) * tvaVal;
      const totht = (state.totalTTC / (1 + tvaVal));
      form.setFieldsValue({debit_amountt: tottva.toFixed(2)});
      form.setFieldsValue({debit_amounts: totht.toFixed(2)});
      state.totalht = totht.toFixed(2);
      state.totaltva = tottva.toFixed(2);
    };

    const onChangeTotalTTC = (e: any) => {

      state.totalTTC = e.target.value
      const tvaVal = (state.tva / 100);
      const tottva = (e.target.value / (1 + tvaVal)) * tvaVal;
      const totht = (e.target.value / (1 + tvaVal));
      form.setFieldsValue({debit_amountt: tottva.toFixed(2)});
      form.setFieldsValue({debit_amounts: totht.toFixed(2)});
      state.totalht = totht.toFixed(2);
      state.totaltva = tottva.toFixed(2);
    };

//----------------------------------- get value contre partie-------------------

    const tableContrePartie = contres.filter(e => e.code);
    const tableContre = tableContrePartie.map(e => e);
    const contrepartis = tableContre.filter((el,i) => el.code.toString().substr(0, 3) == account_compte[0] ||
      el.code.toString().substr(0, 3) == account_compte[1]||
      el.code.toString().substr(0, 3) == account_compte[2]||
      el.code.toString().substr(0, 3) == account_compte[3])


    const optionContre = contrepartis.map(opt => <Option value={opt.id} key={opt.id}>{opt.code} - {opt.name}</Option>);


    const onChangeContreClient = (el: any) => {
      state.codeContrePartie = el;
      // setState({ codeContre: state.codeContrePartie });
      const nameContrePartie = contrepartis.filter((fil: any) => fil.id === state.codeContrePartie);
      state.nameContrePartie = nameContrePartie.map((e) => e.name);
      form.setFieldsValue({name_contre_partie: state.nameContrePartie});
    };



    //------------------get value compte tva---------------------
    const tableCompteTva = compte.filter(e => e.code);

    const tableCompte = tableCompteTva.map(e => e);

    const listeCompte = tableCompte.filter(el => (el.code.toString().substr(0, 4) == account_tva));
    console.log(listeCompte)
    const optionCompte = listeCompte.map(opt => <Option value={opt.id} key={opt.id}>{opt.code} - {opt.name}</Option>);


    const onChangeCompteClient = (el: any) => {
      state.codeTvaClient = el;
      const nameCompte = compte.filter((fil: any) => fil.id === state.codeTvaClient);
      state.nameTvaClient = nameCompte.map((e) => e.name);
      form.setFieldsValue({name_compte_tva: state.nameTvaClient});

    };




    //-----------------------get value status------------------------

    const onChangeRadio = (e: any) => {
      state.radio = e.target.value;
    };


    const onFinish = (values: {
      status: any; ficalyear: string; journal: any; categery: any; date: any; due_date: string; label: string;
      account_client: string; credit_amount: string; debit_amountt: string; debit_amounts: string;
      acount_contrepartieClient: string; account_comptetvaClient: string;
    }) => {

      if(parseInt(values.credit_amount) <0 || parseInt(values.debit_amountt) <0){

        setAlert(['other', "Total TTC doit être positif"]);
      }
      else{


      axios.post(`${API_URL_TRANSACTIONS}/`, {
      // const data = {
        organisation:organisation,
        status: state.radio,
        ficalyear: fiscal,
        journal: state.journale,
        category: values.categery,
        date: state.dateClient,
        due_date: state.echeanceClient,
        label: values.label,
        transactionitem_set: [
          {
            account: values.account_client,
            credit_amount: '0.00',
            debit_amount: values.credit_amount,
            date: state.dateClient,
            due_date: state.echeanceClient,
            label: values.label,
          },
          {
            account: values.acount_contrepartieClient,
            credit_amount: values.debit_amounts,
            debit_amount: '0.00',
            date: state.dateClient,
            due_date: state.echeanceClient,
            label: values.label,
          },
          {
            account: values.account_comptetvaClient,
            credit_amount: values.debit_amountt,
            debit_amount: '0.00',
            date: state.dateClient,
            due_date: state.echeanceClient,
            label: values.label,
          },
        ],

      }, config)
        .then(response => {
          console.log(response);
          setState({...state, isVisible: true})
          setAlert(['add', values.categery]);
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

    return (


      <Card>
         <Title level={2}>Enregistrer facture client</Title>
        <Divider/>
          {isLoading ? <Spin size="default" />:
        <div>
            {list.length==0 || listeCompte.length==0 ? <Alert message={`On peut pas enregistrer la facture `} description="Journal , client et comptes non trouvés" type="warning" closable
        showIcon  className="alertInput"/> : " "}
          { inactif ? <Alert message="L'opération demandée n’est pas possible!" description={msg}
         type="error"  showIcon closable /> : " "}


  </div>
        }

{(alert[0] === 'add' && state.isVisible) ?
          <Alert message={`la facture a été créer avec succès`} type="success" onClose={setTimeout(()=>{
            setState({...state,isVisible: false})},5000)}/> : ''}
        {(alert[0] === 'other') ? <Alert message={`${alert[1]} `} type="error"  onClose={setTimeout(()=>{
            setState({...state,isVisible: false})},5000)} /> : ''}

      {/* <Tooltip title={msg} color='red'key='red'>  */}
      <br />
        <Form
          {...formItemLayout}
          name="facture"
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
                placeholder="journal"
                style={{width: 260}}
                onChange={onChangeJournal}>
                {optienJournale}
              </Select>
            </Form.Item>
            <Form.Item
              name="nameJournale"
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
                  message:"Le champ compte client est obligatoire"
                },]}

            >
              <Select disabled={inactif}
                style={{width: 260}}
                onChange={onChangeClient}
                placeholder="client"
              >
                {afficheListe}
              </Select>

            </Form.Item>
            <Form.Item
              name="name_account_client"
              style={{display: 'inline-block', marginLeft: '20px'}}
            >
              <Input disabled={inactif} className='inputTitle'/>
            </Form.Item>
          </Form.Item>

          <Form.Item
              name="date"
              label="Date Facture"
              rules={[
                {
                  required: true,
                  message:"Le champ date facture est obligatoire"
                },]}
              >
              <DatePicker disabled={inactif}
                disabledDate={d => !d || d.isAfter(`${dateTotal}-12-31`) || d.isSameOrBefore(`${dateTotal-1}-12-31`) }
                style={{width: 260}} format="DD-MM-YYYY" onChange={onChangeDate} defaultPickerValue={total}/>
            </Form.Item>

          <Form.Item
              name="due_date"
              label="Date Echéance"
              rules={[
                {
                  required: true,
                  message:"Le champ date echéance est obligatoire"
                },]}
              >
              <DatePicker disabled={inactif} style={{width: 260}}
               disabledDate={d => !d || d.isAfter(`${dateTotal}-12-31`) || d.isSameOrBefore(`${dateTotal-1}-12-31`) }
              format="DD-MM-YYYY" onChange={onChangeDueDate} defaultPickerValue={total}/>
          </Form.Item>




          <Form.Item
            name="credit_amount"
            label="Total TTC"
            rules={[
              {
                required: true,

              },]}
          >
            <Input disabled={inactif} type="number" style={{width: 260}} onChange={onChangeTotalTTC} defaultValue={0.00}
                   value={state.totalTTC}/>
          </Form.Item>
          <Form.Item
            name="tva"
            label="Taux TVA"

          >
            <Select disabled={inactif} style={{width: 260}}
                    onChange={onchangeTva}
                    labelInValue defaultValue={{key: 20}}
                    value={{key: state.tva}}>
              <Option value={5.5} key={5.5}> 5.5%</Option>
              <Option value={10} key={10}> 10%</Option>
              <Option value={20} key={20}> 20%</Option>
            </Select>

          </Form.Item>
          <Form.Item
            name="debit_amounts"
            label="Total HT"

          >
            <Input disabled={true} className='inputlibelle' style={{width: 260}} value={state.totalht}/>
          </Form.Item>
          <Form.Item
            name="debit_amountt"
            label="Total TVA"

          >
            <Input disabled={true} className='inputlibelle' style={{width: 260}}/>
          </Form.Item>

          <Form.Item label="Contre partie" style={{marginBottom: 0}}>

            <Form.Item
              name="acount_contrepartieClient"
              style={{display: 'inline-block'}}
              rules={[
                {
                  required: true,
                  message:"Le champ contre partie est obligatoire"
                },]}
            >
              <Select disabled={inactif} style={{width: '260px'}}
                      onChange={onChangeContreClient}
                      placeholder="contre partie"
              >
                {optionContre}
              </Select>

            </Form.Item>
            <Form.Item
              name="name_contre_partie"

              style={{display: 'inline-block', marginLeft: '20px'}}
            >
              <Input disabled={inactif} className='inputTitle'/>
            </Form.Item>

          </Form.Item>

          <Form.Item label="Compte TVA" style={{marginBottom: 0}}>

            <Form.Item
              name="account_comptetvaClient"
              style={{display: 'inline-block'}}
              rules={[
                {
                  required: true,
                  message:"Le champ compte tva est obligatoire"
                },]}
            >
              <Select disabled={inactif} style={{width: 260}}
                      onChange={onChangeCompteClient}
                      placeholder="ompte tva"
              >
                {optionCompte}
              </Select>

            </Form.Item>
            <Form.Item
              name="name_compte_tva"

              style={{display: 'inline-block', marginLeft: '20px'}}
            >
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

          <Form.Item name="status" label="Status">
            <Radio.Group
              disabled={inactif}
              onChange={onChangeRadio}
              defaultValue="Brouillon">
              <Radio value="Brouillon">Brouillard</Radio>
              <Radio value="Valide">Validation</Radio>
            </Radio.Group>
            <div style={{display: 'inline-block'}}>
              <Tooltip title={msg}  color='red'key='red'>
              {list.length == 0 || listeCompte.length == 0 ?
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
        {/* </Tooltip> */}




      </Card>

    );
  };

  return (
    <JwtContextProvider>
      <AddFactureClient/>
    </JwtContextProvider>
  )
}
export default FactureClient;
