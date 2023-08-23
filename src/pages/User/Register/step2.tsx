import React from 'react';
import {Form, Input} from "antd";

function Step2(props) {

    if (props.current !== 1) { // Prop: The current step
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
                    <Input prefix={<span className="site-form-item-icon"/>}
                           id="email"
                           placeholder="Email"
                           name="email"
                           value={props.email}
                           status={props.emailStatus}
                           onChange={props.changEvent}
                           onBlur={props.validate}
                           />
                    <div style={{fontSize: "13px",
                        color: 'red',
                        display:"block",
                        position:"absolute",
                        bottom :"10",
                        left:"0",
                        transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                    }}>{props.emailError}</div>
                </Form.Item>

                <Form.Item>
                    <Input prefix={<span className="site-form-item-icon" />}
                        id="address"
                        placeholder="Adresse"
                        name="address"
                        value={props.address}
                        status={props.addressStatus}
                        onChange={props.changEvent}
                        onBlur={props.validate}
                        style={{marginTop:"20px"}}
                    />
                    <div style={{
                        fontSize: "13px",
                        color: 'red',
                        display: "block",
                        position: "absolute",
                        bottom: "10",
                        left: "0",
                        transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                    }}>{props.addressError}</div>
                </Form.Item>
                <Form.Item>
                    <Input prefix={<span className="site-form-item-icon"/>}
                           id="phone_number"
                           name="phone_number"
                           type="number"
                           placeholder="telephone"
                           status={props.phoneStatus}
                           value={props.phone_number}
                           onChange={props.changEvent}
                           onBlur={props.validate}
                           style={{marginTop:"20px"}}
                    />
                    <div style={{fontSize: "13px",
                        color: 'red',
                        display:"block",
                        position:"absolute",
                        bottom :"10",
                        left:"0",
                        transition: "color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                    }}>{props.phoneError}</div>
                </Form.Item>
            </Form>
        </div>
    );

}

export default Step2;
