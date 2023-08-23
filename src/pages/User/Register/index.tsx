import {Typography, Layout, Row, Steps, Alert, Button} from 'antd';
import React, {Component, useContext,useEffect, useState} from "react";
import 'antd/dist/antd.css';
import {Link, Redirect} from 'react-router-dom'
import './../index.less';
import axios from 'axios'
import {UserOutlined, LockOutlined, ContactsOutlined, SettingOutlined } from '@ant-design/icons';
import compta from './../images/compta-1.svg';
import account from './../images/compta-2.svg';
import './index.less'
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import JwtContextProvider, {JwtContext} from '../../../provider/JwtContextProvider';
import jwt_decode from 'jwt-decode';
import { history } from 'umi';
const {Title} = Typography;
const {Content} = Layout;
const {Step} = Steps
const API_URL = 'http://localhost:8000/api/v1'
const API_URL_ARGUMENT = `${API_URL}/arguments`
const API_URL_LEGALSTATUS = `${API_URL}/legalstatus`
const API_URL_DOMAINS = `${API_URL}/domains`
const API_URL_TAXSYSTEM = `${API_URL}/taxsystems`
const API_URL_REGISTRATION = `${API_URL}/auth/registration/`
const API_URL_OFFER = `${API_URL}/offer`

const steps = [
    {
        icon: <UserOutlined/>,
    },
    {
        icon: <ContactsOutlined/>,

    },
    {
        icon: <LockOutlined/>,
    },
    {
        icon: <SettingOutlined/>,
    }

];
interface MyProps{}
interface MyState {
            id: string,
            last_name: string,
            first_name: string,
            email: string,
            phone_number: string,
            password1: string,
            password2: string,
            address: string,
            organisation_display_name: string,
            organisation_legal_name: string,
            organisation_phone_number: string,
            organisation_email: string,
            organisation_adresss: string,
            organisation_domain: string,
            organisation_legalstatus: string,
            organisation_taxsystem: string,
            current: number,
            isRegistered: boolean,
            error: string,
            nameError: string,
            firstnameError: string,
            prenomStatus: string,
            nameStatus: string,
            emailError: string,
            phoneError: string,
            passwordError: string,
            passwordConfError: string,
            addressError: string,
            organisation_display_nameError: string,
            organisation_legal_nameError: string,
            organisation_phone_numberError: string,
            organisation_emailError: string,
            organisation_adresssError: string,
            domainError: string,
            taxsysError: string,
            legalError: string,
            organisation_display_nameStatus: string,
            organisation_legal_nameStatus: string,
            organisation_phone_numberStatus: string,
            organisation_emailStatus: string,
            organisation_adresssStatus: string,
            messageerror: string,
            emailStatus: string,
            addressStatus: string,
            phoneStatus: string,
            passwordStatus: string,
            passwordConfStatus: string,
            domainStatus: string,
            taxsysStatus: string,
            legalStatus: string,
            listLg: Array<Object>,
            listD: Array<Object>,
            listTax: Array<Object>,
            jwt: any,
            loading: boolean,
            alert: Array<Object>

}
class Register extends React.Component <MyProps, MyState>  {


    constructor(props) {
        super(props);
        this.state  = {
            id:`${props.match.params.id}`,
            last_name: '',
            first_name: '',
            email: '',
            phone_number: '',
            password1: '',
            password2: '',
            address: '',
            organisation_display_name:'',
            organisation_legal_name:'',
            organisation_phone_number:'',
            organisation_email:'',
            organisation_domain:'',
            organisation_legalstatus:'',
            organisation_taxsystem: "",
            current: 0,
            isRegistered: false,
            error: '',
            nameError: "",
            firstnameError: "",
            emailError: "",
            phoneError: "",
            passwordError: "",
            passwordConfError: "",
            addressError: "",
            messageerror: "",
            organisation_display_nameError: "",
            organisation_legal_nameError: "",
            organisation_phone_numberError: "",
            organisation_emailError: "",
            organisation_adresssError: "",
            domainError: "",
            taxsysError: "",
            legalError: "",
            organisation_adresss:"",
            listLg:[],
            listD:[],
            listTax:[],
            jwt:"",
            prenomStatus:"",
            nameStatus:"",
            emailStatus:"",
            addressStatus:"",
            phoneStatus:"",
            passwordStatus: "",
            passwordConfStatus: "",
            organisation_display_nameStatus: "",
            organisation_legal_nameStatus: "",
            organisation_phone_numberStatus: "",
            organisation_emailStatus: "",
            organisation_adresssStatus: "",
            domainStatus: "",
            taxsysStatus: "",
            legalStatus: "",
            loading:true,
            alert:[]



        }
    }

    async getOfferModule(){
      const res= await axios.get(`${API_URL_OFFER}/${this.state.id}`)
      window.localStorage.setItem('module',res.data.module.code)
    }
    async onRegistre() {
      const isvalid = this.validate();
      this.getOfferModule()
      if (isvalid) {
        const formdata = {
          organisation_offer:this.state.id,
          last_name: this.state.last_name,
          first_name: this.state.first_name,
          email: this.state.email,
          phone_number: this.state.phone_number,
          password1: this.state.password1,
          password2: this.state.password2,
          address: this.state.address,
          organisation_display_name:this.state.organisation_display_name,
          organisation_legal_name:this.state.organisation_legal_name,
          organisation_phone_number:this.state.organisation_phone_number,
          organisation_email:this.state.organisation_email,
          organisation_domain:this.state.organisation_domain,
          organisation_adresss:this.state.organisation_adresss,
          organisation_legalstatus:this.state. organisation_legalstatus,
          organisation_taxsystem:this.state.organisation_taxsystem
      }


      try {
        const res= await axios
        .post(`${API_URL_REGISTRATION}`, formdata)
          console.log("res",res);
          /*  window.localStorage.setItem('auth', true);
            console.log("first")
            window.localStorage.setItem('jwtAccess', res.data.access_token);
            window.localStorage.setItem('jwtRefresh', res.data.refresh_token);
            this.setState({isRegistered: true})
            this.setState({jwt:res.data.access_token})
            const decoded = jwt_decode(window.localStorage.getItem('jwtAccess'))
            const config = {
            headers: { Authorization: `Bearer ${window.localStorage.getItem('jwtAccess')}` }
            };
            const res2= await axios.get(`${API_URL_ARGUMENT}/?user=${decoded.user_id}`, config)
            const result = res2.data.results && res2.data.results[0]
            window.localStorage.setItem('argument', result.id)
            window.localStorage.setItem('organization', result.organization.id)
            window.localStorage.setItem('fiscal_year', result.fiscal_year.id)
            window.localStorage.setItem('user_id',decoded.user_id)

            this.setState({loading: false})
            return true*/
            history.push('/user/login');
      } catch (error) {
          console.log(Object.values(error.response.data)[0][0])
          this.setState({alert:['fail', Object.values(error.response.data)[0][0]]});
      }

      }
      return false
    }

    next() {
        const isvalid = this.validate();
        if (isvalid) {
            const current = this.state.current + 1;
            this.setState({current})
        }
        return false
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({current});
    }

    changEvent = (event :React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    changEventLG = (value: string) => {
        this.setState({
            organisation_legalstatus: value
        });
    };
    changEventD = (value: string) => {
        this.setState({
            organisation_domain: value
        });
    };
    changEventTax = (value: string) => {
      this.setState({
        organisation_taxsystem: value
      });
  };
    validate = () => {
        const {last_name,
          first_name,
          email,
          phone_number,
          password1,
          password2,
          address,
          organisation_display_name,
          organisation_legal_name,
          organisation_phone_number ,
          organisation_email ,
          organisation_adresss,
          organisation_domain,
          organisation_legalstatus,
          organisation_taxsystem,
          current} = this.state;


        let nameError = "";
        let firstnameError = "";
        let emailError = "";
        let phoneError = ""
        let passwordError = "";
        let passwordConfError = "";
        let addressError = "";
        let organisation_display_nameError ="";
        let organisation_legal_nameError= "";
        let organisation_phone_numberError= "";
        let organisation_emailError= "";
        let organisation_adresssError="";
        let domainError= "";
        let taxsysError="";
        let legalError="";
        let prenomStatus="";
        let nameStatus="";
        let emailStatus="";
        let addressStatus="";
        let phoneStatus="";
        let passwordStatus="";
        let passwordConfStatus= "";
        let organisation_display_nameStatus="";
        let organisation_legal_nameStatus="";
        let organisation_phone_numberStatus="";
        let organisation_emailStatus="";
        let organisation_adresssStatus="";
        let domainStatus= "";
        let taxsysStatus="";
        let legalStatus="";


        this.setState({nameError});
        this.setState({firstnameError});
        this.setState({emailError});
        this.setState({phoneError});
        this.setState({passwordError});
        this.setState({passwordConfError});
        this.setState({addressError});
        this.setState({organisation_display_nameError});
        this.setState({organisation_legal_nameError});
        this.setState({organisation_phone_numberError});
        this.setState({organisation_emailError});
        this.setState({organisation_adresssError});
        this.setState({domainError});
        this.setState({taxsysError});
        this.setState({legalError});
        this.setState({nameStatus});
        this.setState({prenomStatus});
        this.setState({phoneStatus});
        this.setState({addressStatus});
        this.setState({emailStatus});
        this.setState({passwordStatus});
        this.setState({passwordConfStatus});
        this.setState({organisation_display_nameStatus});
        this.setState({organisation_legal_nameStatus});
        this.setState({organisation_phone_numberStatus});
        this.setState({organisation_emailStatus});
        this.setState({organisation_adresssStatus});
        this.setState({domainStatus});
        this.setState({taxsysStatus});
        this.setState({legalStatus});

        if (!last_name && !first_name) {
            nameError = "Veuillez renseigner votre nom";
            firstnameError = "Veuillez renseigner votre prénom";
            nameStatus="error"
            prenomStatus="error"

        }
        if (last_name && !first_name) {
            firstnameError = "Veuillez renseigner votre prénom";
            prenomStatus="error"
        }
        if (!last_name && first_name && current === 0) {
            nameError = "Veuillez renseigner votre nom";
            nameStatus="error"
        }
        if (firstnameError || nameError) {
            this.setState({firstnameError, nameError,nameStatus,prenomStatus})
            return false
        }
        const regex=/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-z]+)$/;
        if (!regex.test(email) && current === 1)
        {
          emailError = "Email invalid"
          emailStatus="error"
        }



        if (!email && !phone_number && !address && current === 1) {
            emailError = "Veuillez renseigner un email valide"
            phoneError = "Veuillez renseigner votre numero téléphone"
            addressError= "Veuillez renseigner votre adresse"
            emailStatus="error"
            addressStatus="error"
            phoneStatus="error"
        }
        if (!email && phone_number && address && current === 1) {
            emailError = "Veuillez ajouter un Email valide"
            emailStatus="error"
        }
        if (email && phone_number && !address && current === 1) {
          addressError= "Veuillez renseigner votre adresse"
          addressStatus="error"
        }
      if (email&& !phone_number && address && current === 1) {
        phoneError = "Veuillez renseigner votre numero téléphone"
        phoneStatus="error"
        }
        if (email && !phone_number && !address && current === 1) {
            phoneError = "Veuillez renseigner votre numero téléphone"
            addressError= "Veuillez renseigner votre adresse"
            addressStatus="error"
            phoneStatus="error"
        }
        if (!email && phone_number && !address && current === 1) {
          emailError = "Veuillez ajouter un Email valide"
          addressError= "Veuillez renseigner votre adresse"
          emailStatus="error"
          addressStatus="error"
      }
      if (!email && !phone_number && address && current === 1) {
        phoneError = "Veuillez renseigner votre numero téléphone"
        emailError = "Veuillez ajouter un Email valide"
        emailStatus="error"
        phoneStatus="error"
    }
        if (emailError || phoneError ||addressError) {
            this.setState({emailError, phoneError, addressError,emailStatus,addressStatus,phoneStatus})
            return false
        }

        if (!password1 && current === 2) {
            passwordError = "Veuillez renseigner votre password"
            passwordStatus="error"
        }
        if ((password1 !== password2) && current === 2) {
            passwordConfError = "votre mot de passe confirmé est incorrect";
            passwordConfStatus="error"
        }
        if (passwordError || passwordConfError) {
            this.setState({passwordError, passwordConfError,passwordConfStatus,passwordStatus})
            return false
        }


        if (!regex.test(organisation_email) && current === 3)
        {
          organisation_emailError = "Email invalid"
          organisation_emailStatus="error"
        }

        if(! organisation_display_name &&! organisation_legal_name && !organisation_phone_number &&!organisation_email && ! organisation_adresss && current == 3)
        {
          organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_legal_nameStatus="error";
           organisation_phone_numberStatus="error";
           organisation_emailStatus="error";
           organisation_adresssStatus="error";
        }
        if(organisation_display_name &&! organisation_legal_name && !organisation_phone_number &&!organisation_email && ! organisation_adresss && current == 3)
        {
           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_legal_nameStatus="error";
           organisation_phone_numberStatus="error";
           organisation_emailStatus="error";
           organisation_adresssStatus="error";
        }
        if(!organisation_display_name && organisation_legal_name && !organisation_phone_number &&!organisation_email && ! organisation_adresss && current == 3)
        {
           organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_phone_numberStatus="error";
           organisation_emailStatus="error";
           organisation_adresssStatus="error";
        }
        if(! organisation_display_name &&! organisation_legal_name && organisation_phone_number &&!organisation_email && ! organisation_adresss && current == 3)
        {
          organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_legal_nameStatus="error";
           organisation_emailStatus="error";
           organisation_adresssStatus="error";
        }
        if(! organisation_display_name &&! organisation_legal_name && !organisation_phone_number && organisation_email && ! organisation_adresss && current == 3)
        {
          organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_legal_nameStatus="error";
           organisation_phone_numberStatus="error";
           organisation_adresssStatus="error";
        }
        if(! organisation_display_name &&! organisation_legal_name && !organisation_phone_number &&!organisation_email && organisation_adresss && current == 3)
        {
           organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_legal_nameStatus="error";
           organisation_phone_numberStatus="error";
           organisation_emailStatus="error";

        }

        if(! organisation_display_name && organisation_legal_name && organisation_phone_number &&organisation_email &&  organisation_adresss && current == 3)
        {
           organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_display_nameStatus="error";
        }

        if(organisation_display_name &&! organisation_legal_name && organisation_phone_number &&organisation_email && organisation_adresss && current == 3)
        {
           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_legal_nameStatus="error";
        }

        if(organisation_display_name && organisation_legal_name && !organisation_phone_number && organisation_email && organisation_adresss && current == 3)
        {
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_phone_numberStatus="error";
        }

        if(organisation_display_name &&organisation_legal_name && organisation_phone_number &&!organisation_email && organisation_adresss && current == 3)
        {
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_emailStatus="error";

        }
        if(organisation_display_name &&organisation_legal_name && organisation_phone_number &&organisation_email && ! organisation_adresss && current == 3)
        {
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_adresssStatus="error";
        }

        if(! organisation_display_name &&! organisation_legal_name && organisation_phone_number && organisation_email && organisation_adresss && current == 3)
        {
          organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";

           organisation_display_nameStatus="error";
           organisation_legal_nameStatus="error";

        }

        if(! organisation_display_name && organisation_legal_name && !organisation_phone_number &&organisation_email && organisation_adresss && current == 3)
        {
          organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_phone_numberStatus="error";

        }

        if(! organisation_display_name && organisation_legal_name && organisation_phone_number &&!organisation_email && organisation_adresss && current == 3)
        {
          organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_emailStatus="error";

        }
        if(! organisation_display_name &&organisation_legal_name && organisation_phone_number &&organisation_email && ! organisation_adresss && current == 3)
        {
           organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_adresssStatus="error";
        }
        if(organisation_display_name &&! organisation_legal_name && !organisation_phone_number &&organisation_email && organisation_adresss && current == 3)
        {

           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_legal_nameStatus="error";
           organisation_phone_numberStatus="error";

        }
        if(organisation_display_name &&! organisation_legal_name && organisation_phone_number &&!organisation_email && organisation_adresss && current == 3)
        {

           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";

           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";

           organisation_legal_nameStatus="error";

           organisation_emailStatus="error";

        }

        if(organisation_display_name &&! organisation_legal_name && organisation_phone_number &&organisation_email && ! organisation_adresss && current == 3)
        {
           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise"
           organisation_legal_nameStatus="error";
           organisation_adresssStatus="error";
        }
        if(organisation_display_name &&organisation_legal_name && !organisation_phone_number &&!organisation_email && organisation_adresss && current == 3)
        {

           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_phone_numberStatus="error";
           organisation_emailStatus="error";

        }
        if(organisation_display_name &&organisation_legal_name && !organisation_phone_number &&organisation_email && ! organisation_adresss && current == 3)
        {
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_phone_numberStatus="error";
           organisation_adresssStatus="error";
        }

        if(organisation_display_name &&organisation_legal_name && organisation_phone_number &&!organisation_email && ! organisation_adresss && current == 3)
        {

           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_emailStatus="error";
           organisation_adresssStatus="error";
        }
        if(! organisation_display_name &&! organisation_legal_name && !organisation_phone_number &&organisation_email && organisation_adresss && current == 3)
        {
          organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_legal_nameStatus="error";
           organisation_phone_numberStatus="error";

        }
        if(! organisation_display_name &&! organisation_legal_name && organisation_phone_number &&!organisation_email && organisation_adresss && current == 3)
        {
          organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_legal_nameStatus="error";
           organisation_emailStatus="error";

        }
        if(! organisation_display_name &&! organisation_legal_name && organisation_phone_number &&organisation_email && !organisation_adresss && current == 3)
        {
          organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_legal_nameStatus="error";
           organisation_adresssStatus="error";
        }
        if(! organisation_display_name &&organisation_legal_name && !organisation_phone_number &&!organisation_email && organisation_adresss && current == 3)
        {
          organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_phone_numberStatus="error";
           organisation_emailStatus="error";

        }
        if(! organisation_display_name &&organisation_legal_name && !organisation_phone_number &&organisation_email && ! organisation_adresss && current == 3)
        {
          organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_phone_numberStatus="error";
           organisation_adresssStatus="error";
        }
        if(! organisation_display_name &&organisation_legal_name && organisation_phone_number &&!organisation_email && ! organisation_adresss && current == 3)
        {
          organisation_display_nameError ="Veuillez renseigner le nom de votre entreprise";
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_display_nameStatus="error";
           organisation_emailStatus="error";
           organisation_adresssStatus="error";
        }
        if(organisation_display_name &&! organisation_legal_name && !organisation_phone_number &&!organisation_email && organisation_adresss && current == 3)
        {

           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_legal_nameStatus="error";
           organisation_phone_numberStatus="error";
           organisation_emailStatus="error";

        }
        if(organisation_display_name &&! organisation_legal_name && organisation_phone_number &&!organisation_email && ! organisation_adresss && current == 3)
        {
           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_legal_nameStatus="error";
           organisation_emailStatus="error";
           organisation_adresssStatus="error";
        }

        if( organisation_display_name &&! organisation_legal_name && !organisation_phone_number &&organisation_email && ! organisation_adresss && current == 3)
        {

           organisation_legal_nameError= "Veuillez renseigner le nom légal de votre entreprise";
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";

           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";

           organisation_legal_nameStatus="error";
           organisation_phone_numberStatus="error";

           organisation_adresssStatus="error";
        }

        if(organisation_display_name &&organisation_legal_name && !organisation_phone_number &&!organisation_email && ! organisation_adresss && current == 3)
        {
           organisation_phone_numberError= "Veuillez renseigner le numero téléphone de votre entreprise";
           organisation_emailError= "Veuillez renseigner l'email de votre entreprise";
           organisation_adresssError="Veuillez renseigner l'addresse de votre entreprise";
           organisation_phone_numberStatus="error";
           organisation_emailStatus="error";
           organisation_adresssStatus="error";
        }
        if(! organisation_domain &&! organisation_legalstatus && !organisation_taxsystem && current == 3)
        {

          domainError ="Veuillez sélectionner le domaine de votre entreprise";
           legalError= "Veuillez sélectionner la  forme juridique de votre entreprise";
           taxsysError= "Veuillez sélectionner le régime fiscal de votre entrepris";
           domainStatus="error";
           legalStatus="error";
           taxsysStatus="error";

        }

        if(organisation_domain &&! organisation_legalstatus && !organisation_taxsystem && current == 3)
        {


           legalError= "Veuillez sélectionner la  forme juridique de votre entreprise";
           taxsysError= "Veuillez sélectionner le régime fiscal de votre entreprise";

           legalStatus="error";
           taxsysStatus="error";

        }
        if(! organisation_domain &&organisation_legalstatus && !organisation_taxsystem && current == 3)
        {
          domainError ="Veuillez sélectionner le domaine de votre entreprise";
           taxsysError= "Veuillez sélectionner le régime fiscal de votre entreprise";
           domainStatus="error";
           taxsysStatus="error";

        }
        if(! organisation_domain &&! organisation_legalstatus && organisation_taxsystem && current == 3)
        {

          domainError ="Veuillez sélectionner le domaine de votre entreprise";
           legalError= "Veuillez sélectionner la  forme juridique de votre entreprise";
           domainStatus="error";
           legalStatus="error";

        }
        if(organisation_domain &&organisation_legalstatus && !organisation_taxsystem && current == 3)
        {
           taxsysError= "Veuillez sélectionner le régime fiscal de votre entreprise";
           taxsysStatus="error";

        }
        if(organisation_domain &&! organisation_legalstatus && organisation_taxsystem && current == 3)
        {
           legalError= "Veuillez sélectionner la  forme juridique de votre entreprise";
           legalStatus="error";
        }
        if(! organisation_domain && organisation_legalstatus && organisation_taxsystem && current == 3)
        {
          domainError ="Veuillez sélectionner le domaine de votre entreprise";
           domainStatus="error";


        }





        if (organisation_display_nameError ||domainError|| organisation_legal_nameError|| organisation_phone_numberError|| organisation_emailError|| organisation_adresssError|| taxsysError||legalError) {
          this.setState({organisation_display_nameError,
             organisation_phone_numberError,
             organisation_legal_nameError,
             organisation_emailError,
             organisation_adresssError,
             organisation_display_nameStatus,
             organisation_legal_nameStatus,
             organisation_phone_numberStatus,
             organisation_emailStatus,
             organisation_adresssStatus,
             taxsysError,
             domainError,
             legalError,
             taxsysStatus,domainStatus,legalStatus
            })
          return false
      }

        return true
    }
componentDidMount(){

    axios.get(`${API_URL_LEGALSTATUS}`)
            .then(response => {
               const data=response.data.results;
              this.setState({listLg:data});
              console.log('legal',this.state.listLg)
            }).catch(error => {
              console.log(error)
            });

            axios.get(`${API_URL_DOMAINS}`)
            .then(response => {
              const data=response.data.results;
              this.setState({listD:data});
              console.log('domain',this.state.listD)
            }).catch(error => {
              console.log(error)
            });

            axios.get(`${API_URL_TAXSYSTEM}`)
            .then(response => {
              const data=response.data;
              this.setState({listTax:data});
              console.log('taxsystem',this.state.listTax)
            }).catch(error => {
              console.log(error)
            });


}
    render() {

        const errorList: {} = this.state.error
        const errorItems = [];
        for (const property in errorList) {
            for (let i = 0; i < errorList[property].length; i++) {
                errorItems.push(errorList[property][i])
            }
        }
        // console.log(errorItems);

        const errorMessages = (errorItems.map(item => {
            return (
                <Alert type="error" message={item} showIcon banner/>
            )
        }))

        const {current, isRegistered} = this.state;


        return (

            isRegistered === false ?

                <JwtContextProvider>
                <Layout className="layout" style={{backgroundColor: '#FAFBFC', height: '120vh'}}>
                    <Title level={2}
                           style={{color: '#0747a6', padding: '10px 25px', textAlign: 'center'}}>InnERP</Title>
                    <img src={compta} className="ill-1"/>
                    <img src={account} className="ill-2"/>
                    <Content className="site-layout-content"
                             style={{padding: '50px 20px 150px 20px', maxHeight: '1000px', marginTop: 0}}>
                        <div className="steps-content">
                            <Title level={3} style={{textAlign: 'center'}}>Inscrivez-vous</Title>
                            <p style={{textAlign: 'center'}}>{current== 0 ?"Insérer votre nom et prénom" : current== 1 ? "Insérer vos informations personnelles":current== 2 ?"Insérer votre mot de passe":"Insérer les informations de votre société"}</p>
                        </div>
                        <div>
                            <Steps current={current}>
                                {steps.map((item, i) => (
                                    <Step key={i} icon={item.icon}/>
                                ))}
                            </Steps>
                            <div className="steps-content" >
                                <Step1
                                    current={this.state.current}
                                    changEvent={this.changEvent}
                                    last_name={this.state.last_name}
                                    first_name={this.state.first_name}
                                    validate={this.validate}
                                    nameError={this.state.nameError}
                                    firstnameError={this.state.firstnameError}
                                    nameStatus={this.state.nameStatus}
                                    prenomStatus={this.state.prenomStatus}

                                />

                                <Step2
                                    current={this.state.current}
                                    changEvent={this.changEvent}
                                    email={this.state.email}
                                    address={this.state.address}
                                    phone_number={this.state.phone_number}
                                    emailError={this.state.emailError}
                                    phoneError={this.state.phoneError}
                                    addressError={this.state.addressError}
                                    validate={this.validate}
                                    emailStatus={this.state.emailStatus}
                                    phoneStatus={this.state.phoneStatus}
                                    addressStatus={this.state.addressStatus}
                                />

                                <Step3
                                    current={this.state.current}
                                    changEvent={this.changEvent}
                                    password1={this.state.password1}
                                    password2={this.state.password2}
                                    validate={this.validate}
                                    passwordError={this.state.passwordError}
                                    passwordConfError={this.state.passwordConfError}
                                    passwordConfStatus={this.state.passwordConfStatus}
                                    passworStatus={this.state.passwordStatus}
                                />

                                <Step4
                                    listLg={this.state.listLg}
                                    listD={this.state.listD}
                                    listTax={this.state.listTax}
                                    current={this.state.current}
                                    changEvent={this.changEvent}
                                    changEventLG={this.changEventLG}
                                    changEventD={this.changEventD}
                                    changEventTax={this.changEventTax}
                                    organisation_display_name={this.state.organisation_display_name}
                                    organisation_legal_name={this.state.organisation_legal_name}
                                    organisation_phone_number={this.state.organisation_phone_number}
                                    organisation_email={this.state.organisation_email}
                                    organisation_adresss={this.state.organisation_adresss}
                                    organisation_domain={this.state.organisation_domain}
                                    organisation_legalstatus={this.state.organisation_legalstatus}
                                    organisation_taxsystem={this.state.organisation_taxsystem}
                                    organisation_display_nameError={this.state.organisation_display_nameError}
                                    organisation_phone_numberError={this.state.organisation_phone_numberError}
                                    organisation_legal_nameError={this.state.organisation_legal_nameError}
                                    organisation_emailError={this.state.organisation_emailError}
                                    organisation_adresssError={this.state.organisation_adresssError}
                                    organisation_display_nameStatus={this.state.organisation_display_nameStatus}
                                    organisation_legal_nameStatus={this.state.organisation_legal_nameStatus}
                                    organisation_phone_numberStatus={this.state.organisation_phone_numberStatus}
                                    organisation_emailStatus={this.state.organisation_emailStatus}
                                    organisation_adresssStatus={this.state.organisation_adresssStatus}
                                    domainError={this.state.domainError}
                                    taxsysError={this.state.taxsysError}
                                    legalError={this.state.legalError}
                                    domainStatus={this.state.domainStatus}
                                    legalStatus={this.state.legalStatus}
                                    taxsysStatus={this.state.taxsysStatus}
                                    validate={this.validate}
                                />
                            </div>
                            {(this.state.alert[0] === 'fail') ?
          <Alert style={{ marginTop: '15px' }}  message={`${this.state.alert[1]}`} type="error"/> : ''}
                            </div>
                            <div className="steps-action" style={{display:'flex'}}>
                            {current > 0 && (
                                        <Button type="link"><a style={{margin: ' 5px'}} onClick={() => this.prev()} onChange={this.onChange}>
                                        Précédent
                                    </a></Button>


                                )}

                                {current < steps.length - 1 && (
                                        <Button type="link"> <a style={{margin: '0 5px'}} type="primary" onClick={() => this.next()}>
                                        Suivant
                                    </a></Button>


                                )}
                                {current === steps.length - 1 && (
                                        <Button type="link"><a style={{margin: '0 5px'}} type="primary" onClick={() => {
                                            {
                                                this.onRegistre();

                                            }
                                        }}>
                                            Valider
                                        </a></Button>


                                )}

                        </div>
                        <Row>
                        <Button type="link">{/*<a span={12} style={{marginTop: '25px', textAlign: 'right'}}>*/}
                            <Link to='/user/login' type="link">Connection a un Compte Existant
                            </Link>
                            {/*</a>*/}</Button>


                        </Row>

                    </Content>
                </Layout>
                </JwtContextProvider>
                 : (
                  this.state.loading?
                  <></>:window.location.href = "/welcome"


                )
        );
    };
}

export default Register;
