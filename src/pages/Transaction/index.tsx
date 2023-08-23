import React, { useContext, useEffect, useState } from 'react';
import JwtContextProvider, { JwtContext } from "../../provider/JwtContextProvider";
import { Card, Divider,Spin, Table, Typography, Button, Form, DatePicker, Select, Input,Tooltip,Alert} from "antd";
import axios from "axios";
import moment from 'moment';
import './index.less'
import { useLocation } from "react-router-dom";

const { TextArea } = Input;
const {RangePicker} = DatePicker
const {Title} = Typography;
const API_URL = 'http://localhost:8000/api/v1';
const API_URL_TRANSACTION = `${API_URL}/transactions`
const API_URL_FISCALYEARS = `${API_URL}/fiscalyears`;
const { Option } = Select;

interface IState {
    journale: string;
    label: string;
    status: string;
    startDate: string;
    endDate: string;
    checkFilter: boolean;
    startDateEcriture: string;
    endDateEcriture: string;
    top: string;
    bottom: string;
    loading: boolean;
    journal: string;
    due_date: string;
}
const Transaction: React.FC = () => {
    const location = useLocation();



   if(!location.state) {
       location.state = location.pathname.substring( location.pathname.lastIndexOf('/') +1 , location.pathname.length)

   }

    const Get: React.FC = () => {
        const [fiscalyear, setFiscalyear] = useState<[{}]>([{}]);
        const [label, setLabel] = useState();
        const [alert, setAlert] = useState([{}])
        const [transactionStatus,setTransactionStatus] = useState(false)

        let msg: string;
        let inactif: boolean;
        if (fiscalyear.archived==true && fiscalyear.open==false ) {
        inactif=true
        msg="L'année fiscale "+fiscalyear.year+" est déjà archivée ";
        }
        else if(transactionStatus==true)
        {
          inactif=true;
          msg="Transaction déja validé"
        }
        else{
        inactif=false
        msg="";}
        useEffect(() => {
            axios.get(`${API_URL_FISCALYEARS}/${status.fiscal_year}`, config)
              .then(response => {
                setFiscalyear(response.data);
                console.log(response)
              }).catch(error => {
                console.log(error)
              });
          },
            [alert]);
//************************************************** */
        const optionItemsStatus= [
          {value: 'Brouillon', label: 'Brouillon'},
          {value: 'Valide', label: 'Valide'}
        ]

        const status  = useContext(JwtContext);
        const token  = status.jwtAccess;
        const [data, setData] = useState<[{}]>(  [

            {
                date: '',
                transaction:
                {status:''},
                journal_name:'',
                due_date:'',
                debit_amount: '',
                credit_amount: '',
                label : '',
                account: ''

            }
        ]);
        const [transaction, setTransaction] = useState<any>([])

        const [state, setState] = useState<IState>({
            journale: "",
            label:"",
            status: "",
            startDate: "",
            endDate: "",
            checkFilter: false,
            startDateEcriture: "",
            endDateEcriture: "",
            top: 'topRight',
            bottom: 'bottomLeft',
            loading:true,
            journal : "",
            due_date:""
        })



        const [TransactionItems, setTransactionItems] = useState<any>([])

       const changeLabel =  (e: any) => {
        state.label = e

        }

        const onFinishEdit = (id: any,values: any , champs: any) => {

          const index = TransactionItems.findIndex((index: any) => index.id == id)


            if( champs == "debit_amount")
            TransactionItems[index].debit_amount = values;
             else if(champs == "credit_amount")
             TransactionItems[index].credit_amount = values;
             else if(champs=="dt" && values != null)
             TransactionItems[index].date = values;
             else if(champs == "account")
             TransactionItems[index].account = values;
             else if(champs == "label"){
             TransactionItems[index].label = values;
             setLabel(values);

            }

          };
          const save = () => {
          const options = {
            url: `${ API_URL_TRANSACTION}/${transaction.id}/`,
            method: 'patch',
                data: {
                label : state.label ,
                ficalyear: transaction.ficalyear,
                id: transaction.id,
                status : state.status,
                journal: transaction.journal.id,
                date: transaction.date,
                due_date: state.due_date,
                transactionitem_set: TransactionItems },
              headers: { Authorization: `Bearer ${token}` }
          };
          axios(options)
          .then(response =>{
            console.log("réponse", response)

           setAlert(['add', transaction.id]);
            })
          .catch(error => {
            console.log(error)
              console.log("edited fail", error.response.data.message)
              setAlert(['fail', error.response.data.message]);
          })
        };

        const onChangeStatus = (e: any) => {
            state.status = e
        }

        const onChangeDate = (dates: any) => {
         const d= new Date(dates)
          if (d) {
            d.setHours((-1 * d.getTimezoneOffset()) / 60);
          }

          state.due_date=d;


      };

     /*   const onChange = (dates: any,dateStrings: any) => {
            const [start, end] = dateStrings;
            console.log(start,"start")
            state.startDate = start
            state.endDate = end
        };

        const onChangeDate = (dates: any,dateStrings: any) => {
            const [debut, fin] = dateStrings;
            state.startDateEcriture = debut;
            state.endDateEcriture = fin;

        };*/

     /* let datesMin = "1900-01-01T24:24:66:666"
        let dateMax = "3020-01-01T24:24:66:666"
        let minDates = "1900-01-01T24:24:66:666";
        let maxDates = "3020-01-01T24:24:66:666";
        if (state.startDate) datesMin = state.startDate;
        if (state.endDate) dateMax = state.endDate;
        if (state.startDateEcriture) minDates = state.startDateEcriture;
        if (state.endDateEcriture) maxDates = state.endDateEcriture;

        const datafilter = data.filter((event: any) =>
            (event.due_date >= datesMin &&
                event.due_date <= dateMax)
            &&
            (event.date >= minDates &&
                event.date <= maxDates)
            &&
            event.transaction.status.includes(state.statuse)
            &&
            event.journal_name.includes(state.journale)


        )*/

       /**Afficher list des transactions items */
        const dateFormat = 'YYYY/MM/DD';
        const columns = [
            {
                title: 'Date d\'écriture',
                dataIndex: "date",
                render: (dt: any, record: any) => <DatePicker disabled={true} onChange={(event: any) => onFinishEdit(record.id, event ? moment(event._d).add(1, 'days').format() : null, "dt")} defaultValue={moment(dt, dateFormat)} format={dateFormat} />,
                key: 'date'
            },
            {
                title: 'N°compte',
                render: ((record: any) => <Select disabled={true} onChange={event => onFinishEdit(record.id, event, "account")} defaultValue={record.account.code}/>),
                key: 'key'
            },
            {
                title: 'Libellé',
                render : ((record: any)  => <TextArea rows={5} disabled={inactif} onChange={ event => onFinishEdit(record.id, event.target.value,"label" )}  defaultValue={record.label} /> ),
                key: 'label'

            },
            {
                title: 'Montant débit',
                key: 'debit_amount',
                render: ((record: any) => <Input  onChange={event => onFinishEdit(record.id, event.target.value, "debit_amount")} defaultValue={record.debit_amount} disabled={record.credit_amount > 0 || inactif} />),
            },
            {
                title: 'Montant crédit',
                key: 'credit_amount',
                render: ((record: any) => <Input onChange={event => onFinishEdit(record.id, event.target.value, "credit_amount")} defaultValue={record.credit_amount} disabled={record.debit_amount > 0 || inactif} />),
            },

            /*{
                title: 'Code Mode Paiement',
                render: (record => <Input defaultValue={''} /> ),
            },
            {
                title: 'Code du Chéquier',
                render: (record => <Input defaultValue={''} /> ),
            },*/



            /*{
                title:'Pointage',
                render: (record => <Input defaultValue={''} /> ),
            },

            {
                title: 'Code analytique',
                render: (record => <Input defaultValue={''} /> ),
            },

            {
                title: 'Code lettrage',
                render: (record => <Input defaultValue={''} /> ),
            },

            {
                title:'Intitulé compte',
                render: (record => <Input defaultValue={''} /> ),
            },*/
        ];
        const config = {
            headers: {
            Authorization: `Bearer ${token}`,
            },
            params: {
                transaction__ficalyear: status.fiscal_year,
                transaction : location.state
            }
        }
        useEffect(() => {
            axios.get(`${API_URL_TRANSACTION}/${location.state}`, config)
                   .then(response => {
                       state.journal = response.data.journal;
                       state.label=transaction.label;
                       state.due_date=transaction.due_date;
                       state.status=transaction.status;

                       setTransaction(response.data);
                       setTransactionItems(response.data.transactionitem_set)
                       state.loading=false;

                       if(response.data.status=='Valide')
                       {
                        setTransactionStatus(true)
                       }
                      console.log("transactionStatus aaaaaaaa",transactionStatus)

                   }).catch();
        }, [TransactionItems.length, state.loading])

        return (
          <>
           {state.loading ? <Spin size="default" />:
              <>

  <Divider />
           {(alert[0] === 'add') ?
          <Alert message={`la transaction N° ${alert[1]} a été modifié avec succès`} type="success" showIcon closable/> : ''}
                  {(alert[0] === 'other') ? <Alert message={`${alert[1]}`}  type="error" closable /> : ''}
                  {(alert[0] === 'fail') ?
          <Alert message={`${alert[1]}`} type="error" showIcon closable/> : ''}
                  {(alert[0] === 'other') ? <Alert message={`${alert[1]}`}  type="error" closable /> : ''}
                  { inactif ? <Alert message={"Impossible de mettre à jour cette transaction"} description={msg}
                        type="error"  showIcon closable /> : " "}
                  <br />
                  <Form
                      name="basic"
                      disabled={inactif}
                      style={{ display: "flex", justifyContent: " space-between", paddingBottom: "0px" }}
                  >

<Form.Item style={{ flexDirection: "column", width: "250px" }}
                          label="Date d'écriture:"
                      >
                          <DatePicker
                           disabled={true}
                              style={{ flexDirection: "column", width: "250px" }}
                              defaultValue={moment(transaction.date, 'YYYY/MM/DD')} format={'YYYY/MM/DD'}

                          />
                      </Form.Item>




                    {
                     <Form.Item label="Journal:" style={{ flexDirection: "column", height: "39px" }}>
                          <Select value={transaction.journal.code}
                              style={{ width: '140px' }}
                             disabled={true}
                          />

                      </Form.Item>
                    }

                      <Form.Item style={{ flexDirection: "column", width: "250px" }}
                          label="Date d'échéance:"
                      >

                            <DatePicker
                          disabled={inactif}
                          style={{ flexDirection: "column", width: "250px" }}
                          defaultValue={moment(transaction.due_date, 'YYYY/MM/DD')} format={'YYYY/MM/DD'}
                          disabledDate={d => !d || d.isAfter(`${new Date(transaction.due_date).getFullYear()}-12-31`) || d.isSameOrBefore(`${new Date(transaction.due_date).getFullYear()-1}-12-31`) }
                          onChange={(date) => onChangeDate(date)}
                          />
                      </Form.Item>

                      <Form.Item label="Status" style={{ flexDirection: "column" }}>
                          <Select
                              style={{ width: '140px' }}
                              key="statuse"
                              onChange={onChangeStatus}
                              options={optionItemsStatus}
                              defaultValue={transaction.status}
                              disabled={transactionStatus}
                              />
                      </Form.Item>
                  </Form>
                  {/* <Tooltip title={msg} color='red' key='red' > */}
                  <Form
                      style={{ display: "flex", justifyContent: " space-between", paddingBottom: "0px" }}>
                      <Form.Item label="Le libellé de l'écriture" style={{ flexDirection: "column", width: '100%' }}>
                      <TextArea disabled={inactif} onChange={event => changeLabel(event.target.value)} defaultValue={transaction.label} >anis</TextArea>
                      </Form.Item>
                  </Form>
                  < Table style={{ marginTop: 20 }}
                      pagination={{ position: [state.bottom] }}
                      bordered columns={columns} dataSource={TransactionItems}
                      loading={state.loading}
                  />

                <Tooltip title={msg} color='red' key='red' placement="topLeft" >
                  <Button onClick={() => save()} style={{ width: '125px', position: 'relative', top: '-45px', left: '90%' }} type="primary" htmlType="submit" disabled={inactif}> Sauvegarder </Button>
              </Tooltip>
              {/* </Tooltip> */}
              </>}
              </>
        )


    }

    return (
        <JwtContextProvider>
        <Card>
            <Title level={2}>Détails de la transaction</Title>
            <Get/>
        </Card>
        </JwtContextProvider>

    )
}
export default Transaction
