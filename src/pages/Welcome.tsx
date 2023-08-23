import React,{  useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import axios from "axios";
import type { FC } from 'react';
import { Avatar, Spin } from 'antd';
import styles from './Welcome.less';
const API_URL = 'http://localhost:8000/api/v1';
const API_URL_USER = `${API_URL}/users`;



const PageHeaderContent: FC<{}> = () => {
  const [user,setUser]=useState({})
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL_USER}/${localStorage.getItem("user_id")}`)
        .then(response => {

          setUser(response.data);
          setIsLoading(false)
         }).catch(error => {
          console.log(error)
        });

},[])


  return (

    <div className={styles.pageHeaderContent}>
         {isLoading ? <Spin size="default" />:
         <div>
      <div className={styles.avatar}>
        <Avatar size="large" src='https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png' />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
        Bienvenue  {user.first_name} {user.last_name}
        </div>
        <div>
       {user.email}
        </div>
      </div>
      </div>}
    </div>
  );
};

const ExtraContent: FC<Record<string, any>> = () => (
  <div className={styles.extraContent}>

    </div>

);

export default (): React.ReactNode => (
//  <PageContainer>

<PageContainer
  content={ <PageHeaderContent />
}
extraContent={<ExtraContent />}
>
<></>
</PageContainer>

  //</PageContainer>

);
