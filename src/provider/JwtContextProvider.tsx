import React, { Component, createContext } from 'react';

export const JwtContext = createContext({
    isAuthenticated: false,
    changeAuth: () => {},
    changeOrganisation: (val:string) => {},
    ChangeFiscal: (val:string) => {},
    jwtAccess:'',
    jwtRefresh:'',
    argument: '',
    organization : '',
    fiscal_year: ''
});


class JwtContextProvider extends Component {
  state = {
    isAuthenticated: window.localStorage.getItem('auth') || false,
    jwtAccess: window.localStorage.getItem('jwtAccess') || '',
    jwtRefresh: window.localStorage.getItem('jwtRefresh') || '',
    argument: window.localStorage.getItem('argument') || '',
    organization: window.localStorage.getItem('organization') || '',
    fiscal_year: window.localStorage.getItem('fiscal_year') || '',
    user_id: window.localStorage.getItem('user_id') || '',
  }
  refreshAcces = () => {
    // setInterval(this.setState({
    //   jwtAccess: this.state.jwtRefresh,
    // }), 3000);
    console.log(window.localStorage)
    console.log('ok')
  }
  changeAuth = () => {
    this.setState({
      isAuthenticated: !this.state.isAuthenticated ,

    });

  }
changeOrganisation = (value :string) => {
  console.log("inside changeOrg and val = ", value)
  window.localStorage.setItem('organization', value )
    this.setState({
      organization: value ,

    });

  }
  ChangeFiscal = (value:string) => {
    console.log("inside changeFiscal and val = ", value)
    window.localStorage.setItem('fiscal_year', value )
    this.setState({
      fiscal_year: value ,

    });

  }

  render() {
    return (
      <JwtContext.Provider value={{...this.state, changeAuth: this.changeAuth, changeOrganisation : this.changeOrganisation, ChangeFiscal: this.ChangeFiscal}}>
        {this.props.children}
      </JwtContext.Provider>
    );
  }
}

export default JwtContextProvider;
