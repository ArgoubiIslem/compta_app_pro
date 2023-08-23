import React, {useContext, useEffect, useState} from 'react';
import JwtContextProvider, {JwtContext} from "../../provider/JwtContextProvider";
import {Card, Divider, Table, Typography, Space,Pagination,List} from "antd";
import '../Theme/style-table.less'
import axios from "axios";
import moment from 'moment';

const {Title, Text } = Typography;
//j'ai pas encore ajouté ajouter un fichier .env
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL ='http://localhost:8000/api/v1'
const API_URL_LEDGER = `${API_URL}/ledger`


const GrandLivre: React.FC = () => {
    const Get: React.FC = () => {
    const [data, setData] = useState([]);
    const status = useContext(JwtContext);
    const token = status.jwtAccess;
    const [state, setState] = useState({
        top: 'topRight',
        bottom: 'bottomRight',
        loading:true,
        fam:[]


    })


    const columns = [

        {
            title: 'Journal',
            dataIndex: "journal_code",
            render: text => <span data-title="Journal">{text}</span>
        },
        {
            title: 'Date',
            dataIndex: "date",
            render: text => <span data-title="Date">{moment(text).format("DD-MM-YYYY")}</span>

        },
        {
            title: 'Libellé',
            dataIndex: "label",
            render: text => <span data-title="Libellé">{text}</span>

        },

        {
            title: 'Débit',
            dataIndex: "debit_amount",
            render: text => <span data-title="Débit">{text}</span>

        },
        {
          title: 'Crédit',
          dataIndex: "credit_amount",
          render: text => <span data-title="Crédit">{text}</span>

      },
    ];


    const config = {
        headers: {Authorization: `Bearer ${token}`},
        params: {
            page_size:2000,
            level: 0,
            fiscal_year: status.fiscal_year,
            organization: status.organization
        }
    }

    {console.log(config)}
    useEffect(() => {
        axios.get(`${API_URL_LEDGER}/`, config)
            .then(response => {
                state.loading =false;
                setData(response.data.results);
                console.log(response)
            }).catch(error => {});

    },[alert])
// const dataRemplie =data.filter((el,i)=>el.transactionitems.length !== 0)
//     {
//         console.log(dataRemplie)
//     }

    return(
        <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={data.filter((el:any,i)=>el.transactionitems.length !== 0)}
                loading={state.loading}
                pagination={{
                    pageSize: 10,
                    position: "both",
                 simple:true
                }}
                renderItem={(item:any) => (
                    <List.Item key={item.id}>
                        <Table
                            style={{marginBottom: "20px",marginTop:"10px"}}
                            title={() => item.code.substr(0,1)+'--'+item.code+'-'+item.name}
                            pagination={false}
                            key={item.id}
                            bordered
                            columns={columns}
                            dataSource={item.transactionitems}
                            summary={
                                pageData => {
                                    let totaCredit = item.credit;
                                    let totalDebit = item.debit;
                                    return (
                                        <>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell colSpan={3} className="positionTotal">
                                                    <Text >Total:</Text></Table.Summary.Cell>
                                                <Table.Summary.Cell>
                                                    <Text data-title="Total Crédit">{totalDebit}</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell>
                                                    <Text data-title="Total Débit">{totaCredit}</Text>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>

                                        </>
                                    );
                                }}
                        />

                    </List.Item>
                )}
            />

    )

    }
    return (
      <JwtContextProvider>
        <Card>
            <Title> Grand Livre</Title>
            <Divider/>
            <Get/>
        </Card>
      </JwtContextProvider>

    )

}
export default GrandLivre
