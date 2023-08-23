import React from 'react';
import { Form, Input, Select ,Spin} from "antd";

const { Option } = Select;

function Step4(props) {

    if (props.current !== 3) { // Prop: The current step
        return null
    }

    return (
       (props.listD!=null && props.listLg!=null && props.listTax!=null) ?  <div>

       <Form
           name="normal_login"
           className="login-form steps-action"
           initialvalues={{ remember: true }}

       //onFinish={onFinish}
       >

           <Form.Item>
               <Input prefix={<span className="site-form-item-icon" />}
                   id="organisation_display_name"
                   name="organisation_display_name"
                   value={props.organisation_display_name}
                   placeholder="Nom de l'entreprise"
                   status={props.organisation_display_nameStatus}
                   onBlur={props.validate}
                   onChange={props.changEvent}
                   style={{ marginTop: "20px"}}
               />
                   <div
                   style={{fontSize: "13px",
                       color: 'red',
                       display:"block",
                       position:"absolute",
                       bottom :"10",
                       left:"0",
                       transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                   }}>{props.organisation_display_nameError}</div>

           </Form.Item>
           <Form.Item>
               <Input prefix={<span className="site-form-item-icon" />}
                   id="organisation_legal_name"
                   name="organisation_legal_name"
                   value={props.organisation_legal_name}
                   status={props.organisation_legal_nameStatus}
                   onChange={props.changEvent}
                   onBlur={props.validate}
                   style={{ marginTop: "20px"}}
                   placeholder="nom légal de l'entreprise'" />
               <div
                   style={{fontSize: "13px",
                       color: 'red',
                       display:"block",
                       position:"absolute",
                       bottom :"10",
                       left:"0",
                       transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                   }}>{props.organisation_legal_nameError}</div>
           </Form.Item>

           <Form.Item>
               <Input prefix={<span className="site-form-item-icon" />}
                   id="organisation_adresss"
                   placeholder="Adresse de l'entreprise"
                   name="organisation_adresss"
                   value={props.organisation_adresss}
                   status={props.organisation_adresssStatus}
                   onChange={props.changEvent}
                   style={{ marginTop: "20px"}}
                   onBlur={props.validate}
               />
                 <div
                   style={{fontSize: "13px",
                       color: 'red',
                       display:"block",
                       position:"absolute",
                       bottom :"10",
                       left:"0",
                       transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                   }}>{props.organisation_adresssError}</div>
           </Form.Item>
           <Form.Item>
               <Input prefix={<span className="site-form-item-icon" />}
                   id="organisation_email"
                   placeholder="Email de l'entreprise"
                   name="organisation_email"
                   value={props.organisation_email}
                   status={props.organisation_emailStatus}
                   onChange={props.changEvent}
                   onBlur={props.validate}
                   style={{ marginTop: "20px"}}/>
                 <div
                   style={{fontSize: "13px",
                       color: 'red',
                       display:"block",
                       position:"absolute",
                       bottom :"10",
                       left:"0",
                       transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                   }}>{props.organisation_emailError}</div>
           </Form.Item>
           <Form.Item>
               <Input prefix={<span className="site-form-item-icon" />}
                   id="organisation_phone_number"
                   name="organisation_phone_number"
                   type="number"
                   placeholder="Téléphone professionnel"
                   value={props.organisation_phone_number}
                   status={props.organisation_phone_numberStatus  }

                   onChange={props.changEvent}
                   style={{ marginTop: "20px"}}
                   onBlur={props.validate}
               />
               <div
                   style={{fontSize: "13px",
                       color: 'red',
                       display:"block",
                       position:"absolute",
                       bottom :"10",
                       left:"0",
                       transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                   }}>{props.organisation_phone_numberError}</div>
           </Form.Item>
           <Form.Item>
            <Select placeholder="Forme Juridique"
            style={{ marginTop: "20px" ,border: "1px "}}
            status={props.legalStatus  }
            defaultValue={props.organisation_legalstatus!=""?props.organisation_legalstatus:null}
            onChange={props.changEventLG}>
            {props.listLg.map((item,indice) =>{
            return(<Option key={item.code+indice}value={item.id}>{item.code}</Option>)
            })}</Select>
                <div
                   style={{fontSize: "13px",
                       color: 'red',
                       display:"block",
                       position:"absolute",
                       bottom :"10",
                       left:"0",
                       transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                   }}>{props.legalError}</div>
            </Form.Item>

            <Form.Item>
          <Select placeholder="domaine d'activités"
          style={{ marginTop: "20px",border: "1px "}}
          status={props.domainStatus  }
          defaultValue={props.organisation_domain!=""?props.organisation_domain:null}
          onChange={props.changEventD}>
          {props.listD.map((item,indice) =>{
          return(<Option key={item.name+indice} value={item.id}>{item.name}</Option>)
          })}  </Select>
                     <div
                   style={{fontSize: "13px",
                       color: 'red',
                       display:"block",
                       position:"absolute",
                       bottom :"10",
                       left:"0",
                       transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                   }}>{props.domainError}</div>
          </Form.Item>
          <Form.Item>
              <Select placeholder="Régime fiscal"
              style={{ marginTop: "20px", border: "1px " }}
              status={props.taxsysStatus  }
              defaultValue={props.organisation_taxsystem!=""?props.organisation_taxsystem:null}
              onChange={props.changEventTax}>

            {props.listTax.map((item,indice) =>{
                return(<Option key={item.name+indice} value={item.id}>{item.name}</Option>)
            })}</Select>
              <div
                   style={{fontSize: "13px",
                       color: 'red',
                       display:"block",
                       position:"absolute",
                       bottom :"10",
                       left:"0",
                       transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                   }}>{props.taxsysError}</div>
            </Form.Item>
       </Form>
   </div>: <Spin size="default"/>
    );

}

export default Step4;
