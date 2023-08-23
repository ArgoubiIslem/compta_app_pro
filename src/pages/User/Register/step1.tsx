import React,{useState,useEffect } from 'react';
import {Form, Input} from "antd";

function Step1(props) {

    let fs = localStorage.getItem('fs');
    if (props.current !== 0) {

        return null
    }

    return (

            <Form style={{position:"relative"}}
                name="normal_login"
                className="login-form steps-action"
                initialValues={{remember: true}}
            >
                <Form.Item >
                    <Input  prefix={<span className="site-form-item-icon"/>}
                           id="last_name"
                           name="last_name"
                           value={props.last_name}
                           status={props.nameStatus}
                           onBlur={props.validate}
                           onChange={props.changEvent}
                          placeholder="Nom"

                    />


                    <div
                        style={{fontSize: "13px",
                            color: 'red',
                            display:"block",
                            position:"absolute",
                            bottom :"10",
                            left:"0",
                            transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                        }}>{props.nameError}</div>
                </Form.Item>


                <Form.Item>
                    <Input prefix={<span className="site-form-item-icon"/>}
                           id="first_name"
                           name="first_name"
                           value={props.first_name}
                           status={props.prenomStatus}
                           onChange={props.changEvent}
                           onBlur={props.validate}
                           placeholder="Prénom"
                           style={{marginTop:"20px"}}
                           />

                    <div
                        style={{fontSize: "13px",
                            color: 'red',
                            display:"block",
                            position:"absolute",
                            bottom :"10",
                            left:"0",
                            transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)",
                            marginTop:"5px"
                        }}>{props.firstnameError}</div>
                </Form.Item>

            </Form>

    );

}

export default Step1;
