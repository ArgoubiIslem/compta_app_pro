import React, { useContext, useEffect, useState} from 'react';
import JwtContextProvider, { JwtContext } from '../../provider/JwtContextProvider';

import {
  Card,
  Divider,
  Typography,
  Button,
  Form,
  DatePicker,
  Select,
  Input,Spin,
  Radio, Alert, Tooltip,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../Theme/style-table.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
const { Title } = Typography;
const API_URL = 'http://localhost:8000/api/v1';
const API_URL_JOURNALS = `${API_URL}/journalsTransaction`;
const API_URL_FISCALYEARS = `${API_URL}/fiscalyears`;
const API_URL_TRANSACTIONS = `${API_URL}/transactions`
const API_URL_ORGANISATIONOFFER=`${API_URL}/organisationOffer`


interface IState {
  journale: string;
  nameJournale: string;
  compteFournisseur: string;
  nameFournisseur: string;
  date: string;
  year: string;
  echeance: string;
  fiscal_year: string;
  tva: number,
  totalTTC: number,
  totalht: number,
  totaltva: number,
  codeContre: string,
  nameContre: string,
  codeTva: string,
  nameTva: string,
  radio: string,
  due_date: string,
  isVisible: boolean
}

const AvoirFournisseur: React.FC = () => {

  const AddAvoir: React.FC = () => {
    const [data, setData] = useState<[{}]>([{}]);
    const [dataFou, setDataFou] = useState<[{}]>([{}]);
    const [fiscalyear, setFiscalyear] = useState<[{}]>([{}]);
    const [alert, setAlert] = useState([{}]);
    const [contres, setContre] = useState<[{}]>([{}]);
    const [compte, setCompte] = useState<[{}]>([{}]);
    const [offerEndDate, setOfferEndDate] = useState();
    const [state, setState] = useState<IState>({
      journale: 'HA',
      nameJournale: '',
      compteFournisseur: '',
      nameFournisseur: '',
      date: '',
      echeance: '',
      radio: 'Brouillon',
      tva: 20,
      totalTTC: 0,
      totalht: '',
      totaltva: '',
      date: '',
      due_date: '',
      codeContre: '',
      nameContre: '',
      codeTva: '',
      nameTva: '',
      isVisible: false
    });
    const account_Fournisseur = ["401", "404"]
    const account_compte = ["60", "61", "62"]
    const account_tva = ["4452", "4456"]
    const status = useContext(JwtContext);
    const token = status.jwtAccess;
    const fiscal = status.fiscal_year;
    const [isLoading, setIsLoading] = useState(true);
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

    //--------------------get journal-------------------------------


    const optionJournal = data.map((e: any) => <Option value={e.id} key={e.id}>{e.code}</Option>)
    const onChangeJournal = (el: any) => {
      state.journale = el;
      const journal=data.filter(e=>e.id==el)[0]
      form.setFieldsValue({name_journal: journal.name});
      form.setFieldsValue({account_fournisseur:""});
      form.setFieldsValue({name_fournisseur:""});
      form.setFieldsValue({credit_amount:""});
      form.setFieldsValue({due_date:""});
      form.setFieldsValue({date:""});
      form.setFieldsValue({acount_contrepartie:""});
      form.setFieldsValue({account_comptetva:""});
      form.setFieldsValue({namecontre:""});
      form.setFieldsValue({nameCompte:""});
      form.setFieldsValue({label:""});
      setDataFou(journal.accounts);
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
        journal_type:"HA"
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

    useEffect(() => {
      axios.get(`${API_URL_JOURNALS}/`, configJournal)
        .then(response => {
          if(data.length==0)
          {
            setIsLoading(false)
          }
          setData(response.data.results);
          setDataFou(response.data.results[0].accounts);
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
    //--------------------get fournisseur---------------------------
    const fournisseur = dataFou.filter((e) => e.code,);
    const tableCode = fournisseur.map(e => e);

    const list = tableCode.filter(item => ((item.code.toString().substr(0, 3) == account_Fournisseur[0]) ||
      (item.code.toString().substr(0, 3) == account_Fournisseur[1])));

    const afficheListe = list.map((el) => <Option key={el.id} value={el.id}>{el.code} - {el.name}</Option>);

    const onChangeFournissur = (el: any) => {
      state.compteFournisseur = el;

      const dataFournisseur = dataFou.filter((fil: any) => fil.id === state.compteFournisseur);

      state.nameFournisseur = dataFournisseur.map((e) => e.name);
      form.setFieldsValue({ name_fournisseur: state.nameFournisseur })

    };



    //--------------------get date and due date---------------------

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
      state.date=d;
    };
    const onChangeDueDate = (e: any) => {
      const d= new Date(e)
      if (d) {
        d.setHours((-1 * d.getTimezoneOffset()) / 60);
      }
      state.echeance=d;
    };



    useEffect(() => {
      axios.get(`${API_URL_FISCALYEARS}/${fiscal}`, config)
        .then(response => {
          setFiscalyear(response.data);
        }).catch(error => {
          console.log(error);
        });
    },
      [alert]);

    //--------------------get ttc and tva---------------------------

    const onchangeTva = (e: any) => {
      state.tva = e.value;
      const tvaVal = (e.value / 100);
      const tottva = (state.totalTTC / (1 + tvaVal)) * tvaVal;
      const totht = (state.totalTTC / (1 + tvaVal));
      form.setFieldsValue({ debit_amountt: tottva.toFixed(2) });
      form.setFieldsValue({ debit_amounts: totht.toFixed(2) });
      state.totalht = totht.toFixed(2);
      state.totaltva = tottva.toFixed(2);
    };

    const onChangeTotalTTC = (e: any) => {

      state.totalTTC = e.target.value;
      const tvaVal = (state.tva / 100);
      const tottva = (e.target.value / (1 + tvaVal)) * tvaVal;
      const totht = (e.target.value / (1 + tvaVal));
      form.setFieldsValue({ debit_amountt: tottva.toFixed(2) });
      form.setFieldsValue({ debit_amounts: totht.toFixed(2) });
      state.totalht = totht.toFixed(2);
      state.totaltva = tottva.toFixed(2);
    };
    //----------------------------------get contre partie--------------
    const tableContrePartie = contres.filter(e => e.code);
    const tableContre = tableContrePartie.map(e => e);

    const listeContre = tableContre.filter(el => (el.code.toString().substr(0, 2) == account_compte[0]) ||
      (el.code.toString().substr(0, 2) == account_compte[1]) ||
      (el.code.toString().substr(0, 2) == account_compte[2]),
    );
    const optionContre = listeContre.map(opt => <Option value={opt.id} key={opt.id}>{opt.code} - {opt.name}</Option>);


    const onChangeContre = (el: any) => {
      state.codeContre = el;
      const nameContrePartie = tableContrePartie.filter((fil: any) => fil.id === state.codeContre);
      state.nameContre = nameContrePartie.map((e) => e.name);
      form.setFieldsValue({ namecontre: state.nameContre })
    };


    //-----------------------------------get compte tva----------------
    const tableCompteTva = compte.filter(e => e.code);

    const tableCompte = tableCompteTva.map(e => e);

    const listeCompte = tableCompte.filter(el => ((el.code.toString().substr(0, 4) == account_tva[0]) ||
      el.code.toString().substr(0, 4) == account_tva[1]));

    const optionCompte = listeCompte.map(opt => <Option value={opt.id} key={opt.id}>{opt.code} - {opt.name}</Option>);


    const onChangeCompte = (el: any) => {
      state.codeTva = el;

      const nameCompte = compte.filter((fil: any) => fil.id === state.codeTva);
      state.nameTva = nameCompte.map((e) => e.name);
      form.setFieldsValue({ nameCompte: state.nameTva })

    };



    //-----------------------------------get status------------------
    const onChangeRadio = (e: any) => {
      state.radio = e.target.value;
    };


    const onFinish = (values: {
      status: any; ficalyear: string; id_journal: any; avoir: any; date: any; due_date: string; label: string;
      account_fournisseur: string; credit_amount: string; debit_amountt: string; debit_amounts: string;
      acount_contrepartie: string; account_comptetva: string;
    }) => {

      if(parseInt(values.credit_amount) <0 || parseInt(values.debit_amountt) <0){

        setAlert(['other', "Total TTC doit être positif"]);
      }
      else{


      axios.post(`${API_URL_TRANSACTIONS}/`, {
        organisation:organisation,
        status: state.radio,
        ficalyear: fiscal,
        journal: state.journale,
        category: values.avoir,
        date: state.date,
        due_date: state.echeance,
        label: values.label,
        transactionitem_set: [
          {
            account: values.account_fournisseur,
            credit_amount: '0.00',
            debit_amount: values.credit_amount,
            date:  state.date,
            due_date: state.echeance,
            label: values.label,
          },
          {
            account: values.acount_contrepartie,
            credit_amount: state.totalht.toString(),
            debit_amount: '0.00',
            date:  state.date,
            due_date: state.echeance,
            label: values.label,
          },
          {
            account: values.account_comptetva,
            credit_amount: state.totaltva.toString(),
            debit_amount: '0.00',
            date:  state.date,
            due_date: state.echeance,
            label: values.label,
          },
        ],

      }, config)
        .then(response => {
          console.log(response);
          setState({ ...state, isVisible: true })
          setAlert(['add', values.avoir]);
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
        <Title level={2}>Enregistrer un avoir sur facture fournisseur</Title>
        <Divider />
          {isLoading ? <Spin size="default" />:
        <div>




        {list.length == 0 && listeCompte.length == 0 ? <Alert message={`On peut pas enregistrer la facture `} description="Journal , fourniseur et comptes non trouvés" type="warning" closable
        showIcon  className="alertInput"/> : " "}
{ inactif ? <Alert message="L'opération demandée n’est pas possible!" description={msg}
         type="error"  showIcon closable /> : " "}


</div>}

{(alert[0] === 'add' && state.isVisible) ?
          <Alert message={`l'avoir a été créé avec succès`} type="success" showIcon onClose={setTimeout(() => {
            setState({ ...state, isVisible: false })
          }, 5000)} /> : ''}
        {(alert[0] === 'other') ? <Alert message={`${alert[1]} `} type="error" showIcon onClose={setTimeout(()=>{
            setState({...state,isVisible: false})},5000)} /> : ''}


      {/* <Tooltip title={msg} color='red' key='red' placement="top" >     */}
      <br />
        <Form
          {...formItemLayout}
          name="facture"
          onFinish={onFinish}
          scrollToFirstError
          form={form}
          initialValues={state.radio}>

          <Form.Item label="Journal" style={{ marginBottom: 0 }}>
            <Form.Item
              name="journal"
              style={{ display: 'inline-block' }}
              rules={[
                {
                  required: true,
                  message:"Le champ journal est obligatoire"
                },]}
              >
              <Select
                style={{ width: 260 }}
                onChange={onChangeJournal}
                placeholder="Journal"

                >
                {optionJournal}

              </Select>
            </Form.Item>

            <Form.Item
              name="name_journal"
              style={{ display: 'inline-block', marginLeft: '20px' }}>
              <Input className='inputTitle' disabled={inactif} />
            </Form.Item>
          </Form.Item>

          <Form.Item label="Fournisseur" style={{ marginBottom: 0 }}>
            <Form.Item
              name="account_fournisseur"
              style={{ display: 'inline-block' }}
              rules={[
                {
                  required: true,
                  message:"Le champ compte fournisseur est obligatoire"
                },]}
              >
              <Select disabled={inactif}
                style={{ width: 260 }}
                onChange={onChangeFournissur}
                placeholder="fournisseur"
                >
                {afficheListe}

              </Select>
            </Form.Item>
            <Form.Item
              name="name_fournisseur"
              style={{ display: 'inline-block', marginLeft: '20px' }}>
              <Input className='inputTitle' disabled={inactif} />
            </Form.Item>
          </Form.Item>
          {/*<Form.Item label="N°Avoir:" style={{ marginBottom: 0 }}>

            <Form.Item
              name="avoir"
              style={{ display: 'inline-block' }}>

              <Input style={{ width: 260 }} disabled={inactif} />
            </Form.Item>



            <Form.Item
              name="date"
              label="Date"
              style={{ display: 'inline-block' }}
              rules={[
                {
                  required: true,
                  message:"Le champ date est obligatoire"
                },]}
              >
              <DatePicker
                style={{ width: 260 }} format="DD-MM-YYYY" onChange={onChangeDate} defaultPickerValue={total} disabled={inactif} />
            </Form.Item>



            <Form.Item
              name="due_date"
              label="Date echéance"
              style={{ display: 'inline-block' }}
              rules={[
                {
                  required: true,
                  message:"Le champ date echéance est obligatoire"
                },]}
              >
              <DatePicker style={{ width: 260 }} format="DD-MM-YYYY" onChange={onChangeDueDate} defaultPickerValue={total} disabled={inactif} />
            </Form.Item>

          </Form.Item>
              */}


            <Form.Item
              name="date"
              label="Date"
              rules={[
                {
                  required: true,
                  message:"Le champ date est obligatoire"
                },]}
              >
              <DatePicker
                disabledDate={d => !d || d.isAfter(`${dateTotal}-12-31`) || d.isSameOrBefore(`${dateTotal-1}-12-31`) }
                style={{ width: 260 }} format="DD-MM-YYYY" onChange={onChangeDate} defaultPickerValue={total} disabled={inactif} />
            </Form.Item>
           <Form.Item
              name="due_date"
              label="Date echéance"
              rules={[
                {
                  required: true,
                  message:"Le champ date echéance est obligatoire"
                },]}
              >
              <DatePicker style={{ width: 260 }}
              disabledDate={d => !d || d.isAfter(`${dateTotal}-12-31`) || d.isSameOrBefore(`${dateTotal-1}-12-31`) }
               format="DD-MM-YYYY" onChange={onChangeDueDate} defaultPickerValue={total} disabled={inactif} />
            </Form.Item>

          <Form.Item
            name="credit_amount"
            label="Total TTC"
            rules={[
              {
                required: true,
              },]}
            >
            <Input type="number" style={{ width: 260 }} disabled={inactif} onChange={onChangeTotalTTC}
              defaultValue={0.00} value={state.totalTTC} />
          </Form.Item>
          <Form.Item
            name="tva"
            label="Taux TVA"
            >
            <Select style={{ width: 260 }}
              disabled={inactif}
              onChange={onchangeTva}
              labelInValue defaultValue={{ key: 20 }}
              value={{ key: state.tva }}>
              <Option value={5.5} key={5.5}> 5.5%</Option>
              <Option value={10} key={10}> 10%</Option>
              <Option value={20} key={20}> 20%</Option>
            </Select>

          </Form.Item>

          <Form.Item
            name="debit_amounts"
            label="Total HT"

            >
            <Input style={{ width: 260 }} type="text" value={state.totalht} disabled={true} />
          </Form.Item>

          <Form.Item
            name="debit_amountt"
            label="Total TVA"

            >
            <Input style={{ width: 260 }} type="text" disabled={true} />
          </Form.Item>

          <Form.Item label="Contre partie" style={{ marginBottom: 0 }}>

            <Form.Item
              name="acount_contrepartie"
              style={{ display: 'inline-block' }}
              rules={[
                {
                  required: true,
                  message:"Le champ contre partie est obligatoire"
                },]}
              >

              <Select disabled={inactif}
                style={{ width: '260px' }}
                onChange={onChangeContre}
                placeholder="contre partie "
                >
                {optionContre}
              </Select>
            </Form.Item>

            <Form.Item
              name="namecontre"
              style={{ display: 'inline-block', marginLeft: '20px' }}>
              <Input className='inputTitle' disabled={inactif} />
            </Form.Item>

          </Form.Item>

          <Form.Item label="Compte TVA" style={{ marginBottom: 0 }}>

            <Form.Item
              name="account_comptetva"
              style={{ display: 'inline-block' }}
              rules={[
                {
                  required: true,
                  message:"Le champ compte tva est obligatoire"
                },]}
              >
              <Select disabled={inactif}
                style={{ width: 260 }}
                onChange={onChangeCompte}
                placeholder="ompte tva"
                >
                {optionCompte}
              </Select>

            </Form.Item>
            <Form.Item
              name="nameCompte"
              style={{ display: 'inline-block', marginLeft: '20px' }}>
              <Input style={{ border: '0px', width: '500px' }} disabled={inactif} />
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
            <Input className='inputlibelle' disabled={inactif} />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Radio.Group disabled={inactif}
              onChange={onChangeRadio}
              defaultValue={state.radio}>
              <Radio value="Brouillon">Brouillard</Radio>
              <Radio value="Valide">Validation</Radio>
            </Radio.Group>
            <div style={{ display: 'inline-block' }}>

                <Tooltip title={msg} color='red' key='red'>
                {list.length == 0 && listeCompte.length == 0  ?
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
      <AddAvoir />
    </JwtContextProvider>
  )
}
export default AvoirFournisseur;
