import React, { Component, useContext, useEffect, useState, useRef } from 'react';
import { Table, Select , Form, Card, Modal ,Drawer, Button, Space, Typography, Input } from 'antd';
import axios from 'axios'
import JwtContextProvider, { JwtContext } from '../../provider/JwtContextProvider';
import '../Theme/style-table.less'
const { Title } = Typography;

//j'ai pas encore ajouté ajouter un fichier .env
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL ='http://localhost:8000/api/v1'

const API_URL_BALANCE =`${API_URL}/balance`

const Balance: React.FC  =()=>{
  const Get: React.FC = () => {
    const status  = useContext(JwtContext);
    const [searchedText,setSearchedText]=useState("");
    const token  = status.jwtAccess;
    const [data, setData] = useState([])
    const [state, setState] = useState({
      top: 'topRight',
      bottom: 'bottomRight',
      loading:true,
      })
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page_size: 2000,
          level: 0,
          fiscal_year: status.fiscal_year,
          organization: status.organization,
      }
      };




    const columns = [
        {
          title: 'Code',
          dataIndex: 'code',
          key: 'code',
          filteredValue:[searchedText],
          onFilter:(value,record)=>{
            return String(record.name).toLowerCase().includes(value.toLowerCase())||
            String(record.code).includes(value)
          },
          sorter: (a: any, b: any) => a.code - b.code,
          render: text => <span data-title="Code">{text}</span>
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: text => <span data-title="Name">{text}</span>
        },

        {
          title: 'Débit',
          key: 'débit',
          dataIndex: 'debit',
          sorter: (a: any, b: any) => a.debit - b.debit,
          render: text => <span data-title="Débit">{text}</span>
        },
        {
          title: 'Crédit',
          dataIndex: 'credit',
          key: 'crédit',
          sorter: (a: any, b: any) => a.credit - b.credit,
          render: text => <span data-title="Crédit">{text}</span>
        },
        {
            title: 'Solde',
            key: 'solde',
            dataIndex: 'solde',
            sorter: (a: any, b: any) => a.solde - b.solde,
          render: text => <span data-title="Solde">{text}</span>
          },
      ];


    useEffect(() => {
      axios.get(`${API_URL_BALANCE}/`, config)
          .then(response => {
              state.loading =false;
              setData(response.data.results);
              console.log(response);
          }).catch(error => {});
  },[alert]);
      return (
        <>
           <Input.Search placeholder='rechercher .....'
          style={{width:"20%", marginBottom:"5px"}}
          onSearch={(value)=>
          setSearchedText(value)
          }
          onChange={(e)=>setSearchedText(e.target.value)}
          />

        <Table columns={columns} pagination={{pageSize: 25, position: [state.top, state.bottom] ,simple:true}}dataSource={data}  loading={state.loading}/>
        </>
      )

  }
    return (
      <JwtContextProvider>
        <Card>
        <Title level={2}>
          Balance
        </Title>
        <Get/>
        </Card>
      </JwtContextProvider>

    )

}
export default Balance;
