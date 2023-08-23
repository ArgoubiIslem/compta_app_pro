import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios'
import '../App.less'
import JwtContextProvider, {JwtContext} from '../provider/JwtContextProvider';
import { Row, Col, Select} from 'antd';
const { Option } = Select;

//j'ai pas encore ajouté ajouter un fichier .env
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL ='http://localhost:8000/api/v1'
const API_URL_FiscalYears= `${API_URL}/fiscalyears`
const API_URL_ARGUMENT = `${API_URL}/arguments`

const SelectOrg: React.FC  = () => {
  const Get: React.FC  = () => {
  const status  = useContext(JwtContext);
  const token  = status.jwtAccess;
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const [listOrganization, setListOrganization] = useState([])
  const [listFiscalYear, setListFiscalYear] = useState([])
  const [defaultFiscalYear, setDefaultFiscalYear] = useState([])



  const  handleChangeOrganization = (value: string) =>{

    status.changeOrganisation(value);


    axios.get(`${API_URL_FiscalYears}/?organization=${value}`, config)
    .then(response => {
        setListFiscalYear(response.data.results, "inside handle");
        setDefaultFiscalYear(response.data.results[0].year)
        status.ChangeFiscal(response.data.results[0].id);
        window.location.reload();
    }).catch(error => {console.log(error)
    })

  }
  const  handleChangeFiscalYear = (value: string) =>{
    status.ChangeFiscal(value);
    window.location.reload();
  }
  useEffect(() => {
    axios.get(`${API_URL_ARGUMENT}/${status.argument}`,config)
    .then(response => {
        setListOrganization(response.data.organizations);
      console.log(response)

    }).catch(error => {console.log('arg',error)
    })
    axios.get(`${API_URL_FiscalYears}/?organization=${status.organization}`, config)
      .then(response => {
          setListFiscalYear(response.data.results);


      }).catch(error => {console.log(error)
      })
  },[listFiscalYear.length]);
  var selectedFiscalYear;
  var optionOrganization;
  var selectedOrganization;
  var optionFiscalYear;
  if (listOrganization) {
   optionOrganization = listOrganization.map((item:any) =>  item.id != status.organization? <Option  key={item.id} value={item.id} >{item.display_name}</Option> :null)
   selectedOrganization= listOrganization.map((item:any) =>   item.id == status.organization? item.display_name : null)

  listFiscalYear.map((item:any) => {
    if(item.id == status.fiscal_year) {
      selectedFiscalYear= item.year;
    }
  })
  if(!selectedFiscalYear) {
    selectedFiscalYear= defaultFiscalYear;
  }
   optionFiscalYear = listFiscalYear.map((item:any) =>   item.id == status.fiscal_year? null : <Option  key={item.id} value={item.id} >{item.year}</Option> )
}

    return(

      <Row md={6}>
      <Col>
      <Row>
        <Col>
        <div style={{ color:"#FFFFFF"}}> Organisation </div>

        </Col>
        <Col>
        <Select defaultValue={status.organization} style={{ width: 200 ,  margin: 10 }} onChange={handleChangeOrganization}>
      <Option value={status.organization} > {selectedOrganization} </Option>
      {optionOrganization}
      </Select>
        </Col>
      </Row>
      </Col>
      <Col>
      <Row>
        <Col>
        <div style={{ color:"#FFFFFF"}} > Année Fiscale </div>

        </Col>
        <Col>
        <Select defaultValue={status.fiscal_year} style={{ width: 200 , margin: 10}} onChange={handleChangeFiscalYear}>
    <Option value={status.fiscal_year} > {selectedFiscalYear} </Option>
      {optionFiscalYear}
    </Select>
        </Col>
      </Row>


    </Col>
      </Row>

 )

    }
    return(

        <JwtContextProvider>
            <Get/>
        </JwtContextProvider>
    )
}

export default SelectOrg;
