import React, {useContext, useEffect, useState} from 'react';
import './style.less'
import JwtContextProvider, {JwtContext} from "../../provider/JwtContextProvider";
import {Card, Divider, Table, Typography,  Tag, Form, DatePicker, Select, Input,} from "antd";

import axios from "axios";
import moment from 'moment';
import '../Theme/style-table.less'
import { Link } from 'umi';

const {RangePicker} = DatePicker
const {Title} = Typography;
//j'ai pas encore ajouté ajouter un fichier .env
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL ='http://localhost:8000/api/v1'
const API_URL_TRANSACTIONITEMS = `${API_URL}/transactionitems`
const {Option} = Select;

interface  IState{
    journale: string;
    statuse: string;
    startDate: string;
    endDate: string;
    checkFilter: boolean;
    startDateEcriture: string;
    endDateEcriture: string;
    top: string;
    bottom: string;
    loading: boolean;
}

const EcritureComptable: React.FC = () => {


    const Get: React.FC = () => {
        const [data, setData] = useState<[{}]>(  [

            {
                date: '',
                transaction:
                {status:''},
                journal_name:'',
                due_date:''

            }
        ]);
      const [form] = Form.useForm();
      const [formLayout, setFormLayout] = useState('horizontal');
        const [selectedRowKeys, setselectedRowKeys] = useState([]);
        const [state, setState] = useState<IState>({
            journale: "",
            statuse: "",
            startDate: "",
            endDate: "",
            checkFilter: false,
            startDateEcriture: "",
            endDateEcriture: "",
            top: 'topRight',
            bottom: 'bottomRight',
            loading:true,


        })
        const status  = useContext(JwtContext);
        const token  = status.jwtAccess;
 //Add Search Input
 const [searchedText , setSerchedText]=useState("")
      const formItemLayout =  formLayout === 'horizontal'
        ? {
          labelCol: { span: 6},
          wrapperCol: { span: 14 },
        }
        : null;

        const arrayJournal: []  = [];
        const optJ = data.map((myData: any) => {
            arrayJournal.push(myData.journal_name)
        });
        const unique = [...new Set(arrayJournal)]

        const journalOption =[]
        unique.map((e)=>{
          journalOption.push({
            text:e,
            value:e
          })
        })




     /*   const onChange = (dates: any,dateStrings: any) => {
            const [start, end] = dateStrings;

            state.startDate = start
            state.endDate = end
        };
        const onChangeDate = (dates: any,dateStrings: any) => {
            const [debut, fin] = dateStrings;

            state.startDateEcriture = debut;
            state.endDateEcriture = fin;

        };*/

        const onSelectChange = (selectedRowKeys: any) => {
            setselectedRowKeys(selectedRowKeys)
            console.log('selectedRowKeys changed: ' + selectedRowKeys);
        };
        const  showTotal=(total:any) =>{
            return <span className="totalTable">
                Total: {datafilter.length}
            </span> ;
        }

        const rowSelection = {
            selectedRowKeys,
            onChange: onSelectChange,
        };

        const hasSelected = selectedRowKeys.length > 0;

        let datesMin = "1900-01-01T24:24:66:666"
        let dateMax = "3020-01-01T24:24:66:666"
        let minDates = "1900-01-01T24:24:66:666";
        let maxDates = "3020-01-01T24:24:66:666";
        if (state.startDate) datesMin = state.startDate;
        if (state.endDate) dateMax = state.endDate;
        if (state.startDateEcriture) minDates = state.startDateEcriture;
        if (state.endDateEcriture) maxDates = state.endDateEcriture;

        const datafilter = data?.filter((event: any) =>

            (event.due_date >= datesMin &&
                event.due_date <= dateMax)
            &&
            (event.date >= minDates &&
                event.date <= maxDates)
            &&
            event.transaction.status.includes(state.statuse)
            &&
            event.journal_name.includes(state.journale)

        )

        const columns = [
          { title:"",
          key:"index",
          render:(value,record, index) =>
          (<Link to = {{
            pathname: `/saisie/transaction/${(record.transaction.id)}`,
            state: record.transaction.id ,
          }}><span> {index+1}</span></Link>)
        },



            {
                title: 'N°écriture',
                sorter: (a: any,b: any) => a.transaction.id-b.transaction.id,
                render: (record: any) => <span data-title="N°écriture"> {record.transaction.id}</span>
            },
            {
                title: 'Date d\'écriture',
                dataIndex: "date",
                sorter: (a: any,b: any) => moment(a.date).unix() - moment(b.date).unix(),
              render: (text,dt) => (
                <span data-title="Date d'écriture"> {moment(text).format("DD-MM-YYYY")}</span>
              )

            },
            {
                title: 'Code journal',
                dataIndex: 'journal_code',
                filters:journalOption,
                onFilter: (value: string,record: any) => record.journalentry.journal_name==value,

              render: text => <span data-title="journal_code">{text}</span>
            },
            {
                title: 'N°compte',
                sorter: (a: any,b: any) => a.account.code-b.account.code,
              render:
                (text,record) => (
                  <span data-title="N°compte"> {record.account.code}</span>
                )
            },

            {
                title: 'Libellé',
                dataIndex: 'label',
                key: 'label',
              render: text => <span data-title="Libellé">{text}</span>
            },

            {
                title: 'Montant débit',
                dataIndex: 'debit_amount',
                sorter: (a: any,b: any) => a.debit_amount-b.debit_amount,
              render: text => <span data-title="Montant débit">{text}</span>
            },
            {
                title: 'Montant crédit',
                dataIndex: 'credit_amount',
                sorter: (a: any,b: any) => a.credit_amount-b.credit_amount,
              render: text => <span data-title="Montant crédit">{text}</span>
            },
            {
                title: 'Date d\'échéance',
                dataIndex: "due_date",
                sorter: (a: any,b: any) => moment(a.due_date).unix() - moment(b.due_date).unix(),
                render:(text) => (
                <span data-title="Date d'échéance"> {moment(text).format("DD-MM-YYYY")}</span>
              )
            },

            {
              title: 'Status',
              dataIndex: "status",
              filters: [
                {
                  text: 'Valide',
                  value: 'Valide',
                },
                {
                  text: 'Brouillon',
                  value: 'Brouillon',
                },
              ],
              onFilter: (value: string,record: any) => record.transaction.status.includes(value),
            render:(text ,record) => (
              <div>
                {record.transaction.status=="Valide"?
                 <Tag color="green">{record.transaction.status}</Tag>:
                 <Tag color="orange">{record.transaction.status}</Tag>
                }

              </div>
            )
          },

        ];

        const config = {
            headers: {
            Authorization: `Bearer ${token}`,
            //transaction__ficalyear: status.fiscal_year,
            //organization: status.organization
            },
            params: {
                page_size: 1000,
                level: 0,
                transaction__ficalyear: status.fiscal_year,
            }
        }



        useEffect(() => {

            axios.get(`${API_URL_TRANSACTIONITEMS}/`, config)
                .then(response => {
                  console.log("test",config)
                    state.loading =false;
                    setData(response.data.results);
                }).catch(error => {
                  console.log(error);
            });

      }, [])




        return (
            <>

                <Divider/>
            {/*     <Form
                    placement="vertical"
                    name="basic"
                    {...formItemLayout}
                    layout={formLayout}
                    form={form}
                    initialValues={{ layout: formLayout }}
                    className="formEcriture"

                >

                    <Form.Item label="Date d'échéance:">
                        <RangePicker
                            onChange={onChange}
                            placeholder={["Date de début", "Date de fin"]}
                        />
                    </Form.Item>

                    <Form.Item
                               label="Date d'écriture:"
                    >
                        <RangePicker
                            onChange={onChangeDate}
                            placeholder={["Date de début", "Date de fin"]}
                            // format={format}
                            // showTime
                            // allowClear={false}
                        />
                    </Form.Item>


                </Form>
*/}
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}


               < Table style={{marginTop: 20}}

                         pagination={{pageSize: 25, position: [state.top, state.bottom], showTotal,simple:true}}
                         key={data.id}
                         rowKey="id" rowSelection={rowSelection}
                         bordered
                         columns={columns} dataSource={datafilter}
                         loading={state.loading}

                />




            </>
        )


    }
    return (
        <JwtContextProvider>
        <Card>
            <Title level={2}>Liste des écritures comptables</Title>
            <Get/>
        </Card>
        </JwtContextProvider>

    )
}
export default EcritureComptable
