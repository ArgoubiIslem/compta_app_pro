import React from 'react';
import {Form, Input } from "antd";
import {EyeOutlined, EyeTwoTone, EyeInvisibleOutlined} from '@ant-design/icons';
import './index.less'

function Step3(props) {

    if (props.current !== 2) { // Prop: The current step
        return null
    }
    return (
        <div>
            <Form style={{position:"relative"}}
                name="normal_login"
                className="login-form steps-action"
                initialValues={{remember: true}}
                // onFinish={onFinish}

            >
                <Form.Item>

                    <Input.Password
                        id="password1"
                        placeholder="Mot de passe"
                        name="password1"
                        value={props.password1}
                        status={props.passworStatus}
                        onChange={props.changEvent}
                        onBlur={props.handleSubmit}

                    />
                    <div style={{fontSize: "13px",
                        color: 'red',
                        display:"block",
                        position:"absolute",
                        bottom :"10",
                        left:"0",
                        transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"

                    }}>{props.passwordError}</div>

                </Form.Item>


                <Form.Item>
                    <Input.Password className="controle"
                                    id="password2"
                                    placeholder="Confirmer mot de passe"
                                    name="password2"
                                    value={props.password2}
                                    status={props.passwordConfStatus}
                                    onChange={props.changEvent}
                                    onBlur={props.validate}
                                    style={{marginTop:"20px"}}

                    />
                    <div style={{
                        fontSize: "13px",
                        color: 'red',
                        display:"block",
                        position:"absolute",
                        bottom :"10",
                        left:"0",
                        transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                    }}>{props.passwordConfError}</div>
                </Form.Item>
            </Form>
        </div>
    );

}

export default Step3;
