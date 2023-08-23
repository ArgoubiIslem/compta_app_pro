// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV, REACT_APP_URL } = process.env;

export default defineConfig(
  {
    hash: true,
    antd: {},

    dva: {
      hmr: true,
    },
    layout: {
      name: 'Ant Design Pro',
      locale: true,
      siderWidth: 208,
    },
    locale: {

      default: 'fr-FR',
      // default true, when it is true, will use `navigator.language` overwrite default
      antd: true,
      baseNavigator: true,
    },
    dynamicImport: {
      loading: '@/components/PageLoading/index',
    },
    targets: {
      ie: 11,
    },
    // umi routes: https://umijs.org/docs/routing
    routes: [
      {
        path: '/welcome',
        name: 'welcome',
        icon: 'smile',
        access: 'canAdmin ',
        hideInMenu: true,
        component: './Welcome',
        authority: ['admin', 'user'],
      },

      {
        path: '/user',
        layout: false,
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/Login',
          },
          {
            name: 'register',
            path: '/user/register/:id',
            component: './User/Register',
          },
          {
            name: 'verify',
            path: '/user/verify/:token',
            component: './User/VerifyUser',
          },
          {
            name: 'forgot-password',
            path: '/user/forgot-password',
            component: './User/Password',
          },
          {
            name: 'reset-password',
            path: '/user/reset-password',
            component: './User/Password/Reset',
          },
        ],
      },


      {
        path: '/dashboard',
        name: 'Dashboard',
        icon: 'DashboardOutlined',
        component: './Dashboard',
        authority: ['admin', 'user'],
      },


      {
        path: '/saisie',
        name: 'Saisie',
        icon: 'EditOutlined',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/saisie/ecritureComptable',
            name: 'Mes écriture',
            component: './EcritureComptable',
          },
          {
            path: '/saisie/transaction/:id',
            name: 'Transaction',
            component: './Transaction',
            hideInMenu: true,
          },
          {
            path: '/saisie/factureFournisseur',
            name: 'Facture fournisseur',
            component: './FactureFournisseur',
          },
          {
            path: '/saisie/avoirFournisseur',
            name: 'Avoir fournisseur',
            component: './AvoirFournisseur',
          },
          {
            path: '/saisie/factureClient',
            name: 'Facture client',
            component: './FactureClient',
          },
          {
            path: '/saisie/avoirClient',
            name: 'Avoir client',
            component: './AvoirClient',
          },
          {
            path: '/saisie/encaissement',
            name: 'Encaissement',
            component: './Encaissement',
          },
          {
            path: '/saisie/paiement',
            name: 'Paiement',
            component: './Paiement',
          },
          {
            path: '/saisie/saisieStandart',
            name: 'Saisie Standart',
            component: './Welcome',
            hideInMenu: true,
          },
          {
            path: '/saisie/saisieAuKilometre',
            name: 'Saisie au Kilométre',
            component: './Welcome',
            hideInMenu: true,
          },

          {
            path: '/saisie/saisieAssisté',
            name: 'Saisie Assisté',
            component: './Welcome',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/mesComptes',
        name: 'Mes Comptes',
        icon: 'BarChartOutlined',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/mesComptes/planComptable',
            name: 'Plan Comptable',
            component: './AccountChart',
          },

          {
            path: '/mesComptes/ref',
            name: 'Référence',
            icon: 'table',
            routes: [
              {
                path: '/mesComptes/ref/taxsysteme',
                name: 'Régime fiscal',
                exact: true,
                component: './TaxSysteme',
              },
              {
                path: '/mesComptes/ref/fiscalyears',
                name: 'Exercices comptables ',
                exact: true,
                component: './Fiscalyears',
              },
              {
                path: '/mesComptes/ref/organisation',
                name: 'Organisation',
                exact: true,
                component: './Organisation',
              },
              {
                path: '/mesComptes/ref/collaborator',
                name: 'Collaborators',
                exact: true,
                component: './Collaborator',
              },
            ],
          },
          {
            path: '/mesComptes/legalperson/client',
            name: 'Client',
            component: './Legalperson',
          },
          {
            path: '/mesComptes/legalperson/fournisseur',
            name: 'Fournisseur',
            component: './Legalperson',
          },
        ],
      },

      {
        path: '/etats',
        name: 'Etats',
        icon: 'AreaChartOutlined',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/etats/brouillard',
            name: 'Brouillard',
            component: './Welcome',
            hideInMenu: true,
          },
          {
            path: '/etats/journaux',
            name: 'Journaux',
            component: './Journals',
          },
          {
            path: '/etats/grandLivre',
            name: 'Grand livre',
            component: './GrandLivre',
          },
          {
            path: '/etats/balance',
            name: 'Balance',
            component: './Balance',
          },
          {
            path: '/etats/compteDesResultat',
            name: 'Compte Des Resultat',
            component: './CompteResultat',
          },
          {
            path: '/etats/bilan',
            name: 'Bilan',
            component: './Bilan',
          },

        ],
      },


      // {
      //   path: '/admin',
      //   name: 'admin',
      //   icon: 'crown',
      //   access: 'canAdmin',
      //   component: './Admin',
      //   routes: [
      //     {
      //       path: '/admin/sub-page',
      //       name: 'sub-page',
      //       icon: 'smile',
      //       component: './Welcome',
      //     },
      //   ],
      // },
      // {
      //   name: 'list.table-list',
      //   icon: 'table',
      //   path: '/list',
      //   component: './ListTableList',
      // },

      {
        path: '/',
        redirect: '/accueil',
      }, {
        path: '/upgradeoffer',
        access: 'canUser',
        authority: ['user'],
        name: "Changer Offer  ",
        icon: "ReconciliationOutlined",
        component: './UpgradeOffer',
      },
      {
        path: '/accueil',
        layout: false,
        access: 'canGuest',
        authority: ['guest'],
        //name: "Offers d'Inscriptions",
        //icon: "ReconciliationOutlined",
        component: './LandingPage',
      },
      {
        path: '/comptabilite',
        layout: false,
        access: 'canGuest',
        authority: ['guest'],
        component: './LandingPage/Compta',
      },
      {
        path: '/rh',
        layout: false,
        access: 'canGuest',
        authority: ['guest'],
        component: './LandingPage/RH',
      },
      {
        component: './404',
      },
    ],
    // Theme for antd: https://ant.design/docs/react/customize-theme-cn
    theme: {
      // ...darkTheme,
      'primary-color': defaultSettings.primaryColor,
    },
    define: {
      REACT_APP_ENV: REACT_APP_ENV || '',
      REACT_APP_URL: REACT_APP_URL || '' // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
    },
    // @ts-ignore
    title: false,
    ignoreMomentLocale: true,
    proxy: proxy[REACT_APP_ENV || 'dev'],
    manifest: {
      basePath: '/welcome',
    },
  });
