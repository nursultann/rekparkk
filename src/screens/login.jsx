import React, { useEffect, useState } from "react";
import { message } from 'antd';
import { Form, Input, Select } from 'antd';
import { gapi } from 'gapi-script';
import { Link, useHistory } from "react-router-dom";
import GoogleLogin from "react-google-login";

import { login, loginGoogle } from "../api/user";
import Navbar from "../components/navbar";
import { auth, clientId, googleAuthProvider } from '../config/firebase_config';

const { Option } = Select;
const key = 'updatable';

const Sign = () => {
    const history = useHistory();
    const [phoneNumber, setLogin] = useState(0);
    const [password, setPassword] = useState();
    const [countryCode, setCountryCode] = useState();

    const responseGoogle = async (response) => {
        console.log("google response", response);
        const email = response.profileObj.email;
        const name = response.profileObj.name;
        const uid = response.profileObj.googleId;
        
        // const credential = await auth.signInWithEmailAndPassword(email, uid);

        console.log(clientId, email, name)

        const credential = await auth.signInWithCredential(googleAuthProvider.credential(
            response.tokenId,
            response.accessToken,
        ))

        console.log('credential', credential)

        const idToken = await credential.user.getIdToken(true);
        // credential.user.displayName;
        // credential.user.email;


        console.log('datas', email, name, idToken)
        await loginGoogle(
            email, name, idToken,
            (data) => {
                console.log('Success', data);
            },
            (data) => {
                console.log('error', data);
            },
        );

        const onLoginError = (data) => {
            // message.error({content:'Номер или пароль указан неверно!', duration: 2});
        };

    }

    const onFailure = (response) => {
        console.log("Failure!", response);
    }

    const signIn = async () => {
        if (password === "" || phoneNumber.length < 9) return;
        // console.log('phone', countryCode + phoneNumber);
        await login(countryCode + phoneNumber, password, onLoginSuccess, onLoginError);
    }

    const onLoginSuccess = (data) => {
        localStorage.setItem('token', data.api_token);
        message.loading({ content: 'Загрузка...', key });
        setTimeout(() => {
            message.success({ content: 'Успешно!', key, duration: 2 });
        }, 1000);
        history.push("/profile");
    };

    const onLoginError = (data) => {
        console.log('error', data);
        message.error({ content: 'Номер или пароль указан неверно!', duration: 2 });
    };

    function onChange(value) {
        // console.log(`selected ${value}`);
        setCountryCode(value);
    }

    useEffect(() => {
        document.title = "Вход";
        // function start() {
        //     gapi.client.init({
        //         clientId: clientId,
        //         scope: ""
        //     })
        // }
        // gapi.load('client:auth2', start);
    });

    return (
        <div>
            <Navbar />
            <div className="col-xl-12 d-flex justify-content-center">
                <div className="col-xl-8 py-4 m-xl-5 shadow rounded-lg my-3 bg-light text-center">
                    <label className="py-2 label" style={{ fontSize: 20 }}>Вход на сайт</label>
                    <br />
                    <Form
                        name="basic"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 19 }}
                        layout="vertical"
                        initialValues={{ remember: true }}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Телефон"
                            name="phone"
                            rules={[{ required: true, message: 'Пожалуйста введите номер телефона!' }]}
                            wrapperCol={{ offset: 0 }}
                        >
                            <Input
                                addonBefore={
                                    <Select
                                        placeholder="код страны"
                                        showSearch
                                        optionFilterProp="children"
                                        onChange={onChange}
                                        className="bg-white rounded border-0"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Option value="996">+996</Option>
                                        <Option value="7">+7</Option>
                                    </Select>
                                }
                                onChange={(e) => {
                                    setLogin(e.target.value)
                                }}
                                className="bg-white rounded border-0"
                                type="number"
                                placeholder="Номер телефона"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Пароль"
                            name="password"
                            rules={[{ required: true, message: 'Пожалуйста введите пароль!' }]}
                            wrapperCol={{ offset: 0 }}
                        >
                            <Input.Password 
                            className="bg-white rounded border-0"
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }} placeholder="Пароль" />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 0 }}>
                            <button
                                className="col-md-12 ml-0 rounded btn btn-primary"
                                htmltype="submit"
                                onClick={signIn}
                            >
                                Войти
                            </button>
                        </Form.Item>
                        <Link className="mt-3" to="/forgot_password">Забыли пароль?</Link><br/>
                        <label className="text-muted">Вход с помощью</label>
                        <Form.Item wrapperCol={{ offset: 0 }} className="d-xl-flex justify-content-center">
                            <GoogleLogin
                                clientId={clientId}
                                buttonText="Войти через Google"
                                onSuccess={responseGoogle}
                                onFailure={onFailure}
                                // cookiePolicy={'single_host_origin'}
                                isSignedIn={false}
                                scope='https://www.googleapis.com/auth/userinfo.profile'
                            />
                        </Form.Item>
                    </Form>
                    <label>Нету аккаунта?</label>
                    <Link className="ml-2" to="/register">Зарегиструйтесь</Link><br />
                </div>
            </div>
        </div>
    );
}
export default Sign;