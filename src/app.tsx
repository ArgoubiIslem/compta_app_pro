import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { history, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { ResponseError } from 'umi-request';
import defaultSettings from '../config/defaultSettings';
import { isNull } from 'lodash';
import { query, queryCurrent } from './services/user';

export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  settings?: LayoutSettings;
}> {

  const paths =
  [
    "",
    `user`,
    "Comptabilite","rh",
    'accueil'];
  const privatePaths =
  [
    'welcome',
    'dashboard',
    'saisie',
    "mesComptes",
    "etats","upgradeoffer",
    ];

  if(privatePaths.includes(history.location.pathname.split('/')[1]))
  {
    const jwtAccess = window.localStorage.getItem('jwtAccess');
    if (isNull(jwtAccess)) {
      history.push('/accueil');
    }

  }

  if(paths.includes(history.location.pathname.split('/')[1]))
  {
    const jwtAccess = window.localStorage.getItem('jwtAccess');
    if (!isNull(jwtAccess)) {
      history.push('/welcome');
    }

  }

 /* if (paths.includes(history.location.pathname.split('/')[1])) {
    const jwtAccess = window.localStorage.getItem('jwtAccess');

    if (!isNull(jwtAccess)) {
      history.push(history.location.pathname);
    }
     else {
      history.push('/accueil');

    }

     }*/

  return {
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,

    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};



const errorHandler = (error: ResponseError) => {

};

export const request: RequestConfig = {
  errorHandler,
};
