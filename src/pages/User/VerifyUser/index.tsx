import { Layout } from 'antd';
import React, {  useEffect,useState } from "react";
import axios from 'axios';
import './../index.less';

import {Link} from 'react-router-dom'
import {  CheckCircleTwoTone} from '@ant-design/icons';
import {  Space  } from "antd";
import { useParams} from 'react-router';
const API_URL = 'http://localhost:8000/api/v1'
const API_URL_VERIFY = `${API_URL}/verify`


export const VerifyEmail: React.FC = () => {
  const params=useParams();
  const [message,setMessage]=useState("")

  useEffect(() => {
    axios.get(`${API_URL_VERIFY}/${params.token}`, )
      .then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error)
        setMessage("Votre compte déjà vérifié")

    });

  }, [params]);


  return (
    <Layout  style={{ marginLeft:"500px",fontSize:"30px" ,marginTop:"200px", backgroundColor: '#FAFBFC'}}>

    <Space>
    {message!=""? message : <h1>Email vérifié avec succès</h1>}

    <CheckCircleTwoTone twoToneColor="#52c41a" style={{fontSize:"30px"}} />

    </Space>

      <Link to='/user/login' type="link" style={{marginLeft:"150px"}}>Login</Link>

    </Layout>
  );
};


export default VerifyEmail;
