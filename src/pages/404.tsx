import { Button, Layout, Result } from 'antd';
import React from 'react';
import { history } from 'umi';
import { isNull } from 'lodash';

const NoFoundPage: React.FC<{}> = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
        <Button type="primary" onClick={() => {
          if(isNull(localStorage.getItem('jwtAccess'))==false){
            history.push('/welcome')
          }else{
            history.push('/')
          }
        }}>
        Back to a Valid Page
      </Button>
     
    }
  />
);

export default NoFoundPage;
