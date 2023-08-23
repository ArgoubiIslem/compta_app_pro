import React, { Component, useContext, useEffect, useState, } from 'react';
import { Divider, Select, Table, Card, Typography, Button } from 'antd';
import axios from 'axios'
import JwtContextProvider, { JwtContext } from '../../provider/JwtContextProvider';
import '../Theme/style-table.less'

const { Title } = Typography;
const API_URL = 'http://localhost:8000/api/v1'
const API_URL_BILAN = `${API_URL}/bilanheadings`


const Bilan: React.FC = () => {
  const Get: React.FC = () => {
    const { Title } = Typography
    const { Option } = Select

    const status = useContext(JwtContext);
    console.log(status)
    const token = status.jwtAccess;
    const [data, setData] = useState([])
    const [state, setState] = useState({
      top: 'topRight',
      bottom: 'bottomRight',
      loading: true,
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
        title: '',
        children: [
          {
            title: '#',
            key: 'id',
            defaultSortOrder: 'ascend',
            sorter: (a: any, b: any) => a.id - b.id,
            render: (value, record, index) => (<>{index + 1}</>)
          },
          {
            title: 'Réf.',
            dataIndex: 'ref',
            key: 'ref',
            render: text => <span data-title="Réf.">{text}</span>

          },
        ],
      },
      {
        title: '',
        children: [
          {
            title: 'Postes',
            dataIndex: 'name',
            key: 'name',
            render: text => <span data-title="Postes">{text}</span>
          },
        ],
      },

      {
        title: 'Exercice N',
        children: [
          {
            title: 'Brute',
            dataIndex: 'brut',
            key: 'brut',
            render: text => <span data-title="Brute">{text}</span>
          },
          {
            title: 'Amort',
            key: 'amort',
            dataIndex: 'amort',

            render: text => <span data-title="Amort">{text}</span>
          },
          {
            title: 'Net',
            key: 'net',
            dataIndex: 'net',
            render: text => <span data-title="Net">{text}</span>
          },
        ],
      },

      {
        title: 'Exercice N-1',
        children: [
          {
            title: 'Net',
            key: 'net_n_1',
            dataIndex: 'net_n_1',
            render: text => <span data-title="Net">{text}</span>
          },
        ],
      },
    ];

    const [nature, setNature] = useState("ACTIF");
    const handleOnChange = (e: string) => {
      setNature(e);
    };

    useEffect(() => {
      axios.get(`${API_URL_BILAN}/?nature=${nature}`, config)
        .then(response => {
          state.loading = false;
          setData(response.data.results);
          console.log(response);
        }).catch(error => { });
    }, [nature, alert]);

    return (
      <Card>
        <Title> Bilan </Title>
        <Divider />

        <div className="selection">
          <span className="selection-txt">Nature :</span>
          <Select
            className="selector"
            size="large"
            showSearch
            style={{ width: 300 }}
            optionFilterProp="children"
            value={nature}
            onChange={handleOnChange}
          >
            <Option value="ACTIF">ACTIF</Option>
            <Option value="PASSIF">PASSIF</Option>
          </Select>
        </div>
        <Table columns={columns} pagination={{ pageSize: 25, position: [state.top, state.bottom], simple: true }} dataSource={data} loading={state.loading} />
      </Card>
    )

  }
  return (
    <JwtContextProvider>
      <Title level={2}>
        Bilan
      </Title>
      <Get />
    </JwtContextProvider>

  )

}
export default Bilan;
