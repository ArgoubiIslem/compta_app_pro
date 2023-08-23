import React, { useContext, useEffect, useState, useRef } from 'react';
import JwtContextProvider, { JwtContext } from '../../provider/JwtContextProvider';
import { getLocale} from '@@/plugin-locale/localeExports';
import { Card, Divider, Typography, Table} from 'antd';
import axios from 'axios';
import '../Theme/style-table.less';
import { useIntl } from 'umi';


const { Title } = Typography;
const API_URL = 'http://localhost:8000/api/v1';
const API_URL_RESULTS = `${API_URL}/incomeHeading`;

const CompteResultat: React.FC = () => {
  const GetCompteResultat: React.FC = () => {
    const status  = useContext(JwtContext);
    console.log(status)
    const token  = status.jwtAccess;
    const [resultData, setResultData] = useState<[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        fiscal_year: status.fiscal_year,
        organization: status.organization,
    }
    };
    useEffect(() => {
      axios
        .get(API_URL_RESULTS,config)
        .then((response) => {

          setResultData(response.data);
          setIsLoading(false)
          console.log(response.data);
          console.log(config)

        })
        .catch((error) => {});
    }, []);

    const columns = [
      {
        title: `${useIntl().formatMessage({ id: 'app.pwa.etats.compteDesResultat.Ref' })}`,
        key: 'ref',
        render: (text) => (
          <span data-title="Ref" className={text.nature == 'AUTRE' ? 'styleLibelle' : 'libel'}>
            {text.ref}
          </span>
        ),
      },
      {
        title: `${useIntl().formatMessage({ id: 'app.pwa.etats.compteDesResultat.Libellés' })}`,
        children: [
          {
            key: 'libelle',
            render: (text) => (
              <span
                data-title="Libelle"
                className={text.nature == 'AUTRE' ? 'styleLibelle' : 'libel'}
              >{text.name}</span>
            ),
          },
          {
            key: 'nature',
            render: (text) => <span data-title="Libelle">{text.ref=="RB"||text.ref=="RD"||text.ref=="RF"?"-/+":text.nature == "AUTRE" ?"" : text.nature == "CHARGE" ? "-":"+"}</span>,
          },
        ],
      },
      {
        title: `${useIntl().formatMessage({ id: 'app.pwa.etats.compteDesResultat.Exercice N' })}`,
        key: 'exercice n',
        render: (text) => (
          <span data-title="Exercice_N" className={text.nature == 'AUTRE' ? 'styleLibelle' : 'libel'}>
            {text.solde}
          </span>
        ),
      },
      {
        title: `${useIntl().formatMessage({ id: 'app.pwa.etats.compteDesResultat.Exercice N-1' })}`,
        key: 'exercice n-1',
        render: (text) => (
          <span data-title="Exercice_N-1" className={text.nature == 'AUTRE' ? 'styleLibelle' : 'libel'}>
            {text.ancien_solde}
          </span>
        ),
      },
    ];

    return (
      <Table
        style={{ marginTop: 75 }}
        rowKey="id"
        bordered
        columns={columns}
        dataSource={resultData}
        pagination={false}
        loading={isLoading}
      />
    );
  };

  return (
    <JwtContextProvider>
      <Card>
        <Title level={2}>
          {useIntl().formatMessage({ id: 'app.pwa.etats.compteDesResultat.Compte des résultats' })}
        </Title>
        <Divider />
        <GetCompteResultat />
      </Card>
    </JwtContextProvider>
  );
};
export default CompteResultat;
