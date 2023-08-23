import React, {useContext, useEffect, useState} from "react";
import JwtContextProvider, {JwtContext} from '../../provider/JwtContextProvider';
import {Alert, Typography, Button, Card, DatePicker, Divider, Form, Input, Radio, Select, Spin,Tooltip,} from "antd";
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
  fournisseur: string;
  date: string;
  compte: string;
  radio: string;
  loading: boolean
}


const Paiement: React.FC = () => {

  const AddPaiement: React.FC = () => {
    const [data, setData] = useState<[{}]>([{}]);
    const [dataFournisseur, setDataFournisseur] = useState<[{}]>([{}]);
    const [date, setDate] = useState<[{}]>([{}]);
    const [dataCompte, setDataCompte] = useState<[{}]>([{}]);
    const [fiscalyear, setFiscalyear] = useState<[{}]>([{}]);
    const[isLoading, setIsLoading]= useState(true)
    const [alert, setAlert] = useState([{}]);
    const [offerEndDate, setOfferEndDate] = useState();

    const [state, setState] = useState<IState>({
      journale: "BQ",
      fournisseur: '',
      date: '',
      compte: '',
      radio: 'Brouillon',
      loading: true,

    });

    const account_fournisseur = 401;
    const account_compte = 512
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

    //-----------------------------------get journal banque-----------------------------------------

    const optienJournals = data.map((e: any) => <Option value={e.id} key={e.id}>{e.code}</Option>)
    const onChangeJournalFournisseur = (value: any) => {
      state.journale = value;
      const journal=data.filter(e=>e.id==value)[0]
      setDataFournisseur(journal.accounts);
      console.log("name",journal.name)
      form.setFieldsValue({journale: journal.name});
      form.setFieldsValue({account_compteBancaire:""});
      form.setFieldsValue({compte:""});
      form.setFieldsValue({amount_ttc:""});
      form.setFieldsValue({fournisseur:""});
      form.setFieldsValue({date:""});
      form.setFieldsValue({account_fournisseur:""});
      form.setFieldsValue({label:""});

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
          setDataFournisseur(response.data.results[0].accounts);
          setIsLoading(false)
        }).catch(error => {
          console.log(error)
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

//-----------------------------------get Fournisseur----------------------------------------------
    const fournisseurs = dataFournisseur.filter((e) => e.code,);
    const codeFournisseur = fournisseurs.map(e => e);
    const listFournisseur = codeFournisseur.filter(item => item.code.toString().substr(0, 3) == account_fournisseur);

    const afficheListeFournisseur = listFournisseur.map((el) => <Option key={el.id}
                                                                      value={el.id}>{el.code} - {el.name}</Option>);

    const onChangeFournisseur = (el: any) => {
      state.fournisseur = el;
      let listNameFournisseur = dataFournisseur.filter((fil: any) => fil.id === state.fournisseur);
      state.fournisseur = listNameFournisseur.map((e) => e.name);
      form.setFieldsValue({fournisseur: state.fournisseur});
    };


//----------------------------------------------get value Date----------------------------------------------------
    const datePaiement = date.map(s => s).filter(e => e.id == fiscal && e.organization.id == organisation)

    var yearSelect = datePaiement.map(el => el.year);
    state.date = yearSelect.toString();
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

    const onChangeDate = (e: any) =>{
      state.date = e;
    };

    useEffect(() => {
      axios.get(`${API_URL_FISCALYEARS}/`, config)
        .then(response => {
          setDate(response.data.results);

        }).catch(error => {
          console.log(error);
      });

    }, [alert]);
    useEffect(() => {
      axios.get(`${API_URL_FISCALYEARS}/${fiscal}`, config)
        .then(response => {
          setFiscalyear(response.data);
          console.log(response)
        }).catch(error => {
          console.log(error)
        });
    },
      [alert]);

    //----------------------------------get compte -----------------------------------

    const comptePaiement = dataFournisseur.filter(e => e.code)
    const tableComptePaiement = comptePaiement.map(e => e);
    const listCompte = tableComptePaiement.filter(item => item.code.toString().substr(0, 3) == account_compte);
    const afficheListe = listCompte.map((el) => <Option key={el.id}
                                                      value={el.id}>{el.code} - {el.name}</Option>);

    const onChangeCompteBancaire = (el: any) => {
      state.compte = el
      const listcompeName = dataFournisseur.filter((fil: any) => fil.id === state.compte);
      state.compte = listcompeName.map((e) => e.name);
      form.setFieldsValue({compte: state.compte});
    }
    //-----------------------------get radio---------------------------
    const  onChangeRadio = (e: any) => {

      state.radio = e.target.value

    }
    //--------------------------------------------------


    const onFinish = (values: {
      status: any, fiscalyear: string, journal: any, category: any,
      date: any, label: string, account_fournisseur: string, account_compteBancaire: string,
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
            account: values.account_fournisseur,
            credit_amount: '0.00',
            debit_amount: values.amount_ttc,
            date: (values.date).toISOString(),
            due_date: (values.date).toISOString(),
            label: values.label,
          },
          {
            account: values.account_compteBancaire,
            credit_amount: values.amount_ttc,
            debit_amount: '0.00',
            date: (values.date).toISOString(),
            due_date: (values.date).toISOString(),
            label: values.label,
          }
        ],

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
    }

    return (

      <Card>

        <Title level={2}>Enregistrer un paiement (Journal de Banque)</Title>
        <Divider/>
        {isLoading ? <Spin size="default" />:
        <div>
             {listFournisseur.length == 0 || listCompte.length ==0 ?
            <Alert message={`On peut pas enregistrer un paiement (Journal de BQ)`} type="warning" closable
                   className="alertInput"/> : " "}
                     { inactif ? <Alert message="L'opération demandée n’est pas possible!" description={msg}
         type="error"  showIcon closable /> : " "}
        </div>}
        {(alert[0] === 'add') ?
          <Alert message={`Paiement a été créé avec succès`} type="success" closable
                 className="alertInput"/> : " "}

        <div>

         {(alert[0] === 'other') ? <Alert message={`${alert[1]} `} type="error"  onClose={setTimeout(()=>{
            setState({...state,isVisible: false})},5000)} /> : ''}
        </div>

        {customColors.map(color => (
         <Tooltip title={msg} color={color} key={color} placement="top" >
           <br />


          <Form
            {...formItemLayout}
            name="paiement"
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
                  onChange={onChangeJournalFournisseur}
                  placeholder="Journal"
                  style={{width: 260}}


                >
                  {optienJournals}
                </Select>
              </Form.Item>

              <Form.Item
                name="journale"
                style={{display: 'inline-block', marginLeft: '20px'}}>
                <Input  disabled={inactif} className='inputTitle'/>
              </Form.Item>
            </Form.Item>


            <Form.Item label="Fournisseur" style={{marginBottom: 0}}>

              <Form.Item
                name="account_fournisseur"
                style={{display: 'inline-block'}}
                rules={[
                  {
                    required: true,
                    message:"Le champ conmpte fournisseur est obligatoire"
                  },]}
              >
                <Select
                  disabled={inactif}
                  style={{width: 260}}
                  onChange={onChangeFournisseur}
                >
                  {afficheListeFournisseur}
                </Select>
              </Form.Item>
              <Form.Item
                name="fournisseur"
                style={{display: 'inline-block', marginLeft: '20px'}}>
                <Input  disabled={inactif} className='inputTitle'/>
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="Date Paiement"
              name="date"
              rules={[
                {
                  required: true,
                },]}
              >
              <DatePicker  disabled={inactif}
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
              <Input  disabled={inactif} type="number" style={{width: 260}}/>
            </Form.Item>

          {/*
          <Form.Item
              name="category"
              label="N° pièce"
              rules={[
                {
                  required: true,

                },]}
              >
              <Input  disabled={inactif} type="text" style={{width: 260}}/>
            </Form.Item>
          */}

            <Form.Item
              label="Compte bancaire à débiter"
              style={{marginBottom: 0}}

              >

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
                  disabled={inactif}
                  style={{width: 260}}
                  onChange={onChangeCompteBancaire}
                >
                  {afficheListe}
                </Select>
              </Form.Item>
              <Form.Item
                name="compte"
                style={{display: 'inline-block', marginLeft: '20px'}}>
                <Input  disabled={inactif} className='inputTitle'/>
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
              <Input  disabled={inactif} className='inputlibelle'/>
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
            >
              <Radio.Group
                disabled={inactif}
                defaultValue="Brouillon"
                onChange={onChangeRadio}
              >
                <Radio value="Brouillon">Brouillard</Radio>
                <Radio value="Valide">Validation</Radio>
              </Radio.Group>
              <div style={{display: 'inline-block'}}>
                 <Tooltip title={msg} color={color} key={color}>
                 {listFournisseur.length == 0 || listCompte.length ==0?
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
      <AddPaiement/>
    </JwtContextProvider>
  )

}
export default Paiement;
