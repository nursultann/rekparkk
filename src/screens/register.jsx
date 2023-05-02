import React, { useEffect, useState, Link } from "react";
import Navbar from "../components/navbar";
import { firebase, auth } from "../config/firebase_config";
import * as firebaseui from "firebaseui";
import ApiClient from "../api/ApiClient";
import { checkPhone, loginGoogle, register } from "../api/user";
import Footer from "../components/footer";
import { Steps, Button, message, Form, Input, Select, InputNumber } from 'antd';
import { Alert } from 'antd';
const clientId = "363682799555-97hlkli04bo0eevlu0br81jtl3vg677a.apps.googleusercontent.com";
// const countryCodes = [
//     {"value": "+996", "label": "+996"},
//     {"value": "+7", "label": "+7"},
// ];
const key = 'updatable';
const { Option } = Select;
const { Step } = Steps;

const Register = () => {
    // Inputs
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState('');
    const [final, setFinal] = useState('');
    const [userName, setUserName] = useState();
    const [timer, setTimer] = useState(59);
    const [userPassword, setPassword] = useState();
    const [passwordCheck, checkPassword] = useState();
    const [uuid, setUuid] = useState();
    const [countrycode, setCountryCode] = useState();
    const [current, setCurrent] = useState(0);
    const [link, setLink] = useState(false);

    const responseGoogle = (response) => {
        console.log("google response", response);
        const email = response.profileObj.email;
        const name = response.profileObj.name;
        const uid = response.profileObj.googleId;
        console.log(email, name, uid)
        loginGoogle(email, name, uid, (data) => {
            console.log('Success',data);
        }, (data) => {
            console.log('error', data);
        });
    
        const onLoginError = (data) => {
            
            // message.error({content:'Номер или пароль указан неверно!', duration: 2});
        };
    
    }
    const signIn = async () => {
        const check = await checkPhone(countrycode + phoneNumber);
        if (check == true) {
            message.warning('Такой номер уже существует!', 10);
        }
        else if (check == false) {
            if (phoneNumber === "" || phoneNumber.length < 9) return;
            auth.signInWithPhoneNumber(`+${countrycode + phoneNumber}`, window.verify).then((result) => {
                setFinal(result);
                message.success('Код потверждения отправлен!', 10);
                setCurrent(current + 1);
                setLink(false);
                var t = 59;
                function i() {
                    t -= 1;
                    setTimer(t);
                }
                var interval = setInterval(i, 1000);
                function time() {
                    clearInterval(interval);
                    setLink(true);
                    message.info('Время вышло!', 10);
                    // window.location.reload(); 
                }
                setTimeout(time, 59000);
            }).catch((err) => {
                alert(err);
                message.error('Номер указан неверно!', 10);
                window.location.reload()
            });
        }
    };

    const validateOtp = () => {
        if (otp === null || final === null)
            return;
        final.confirm(otp).then((result) => {
            console.log("OTP", result);
            message.success('Код потверждения выслан', 10);
            setUuid(result.user.uid);
            setCurrent(current + 1);
            // result.user.uuid;
            console.log('success ', result);
        }).catch((err) => {
            message.error('Код потверждения введен неверно!', 10);
        })
    }
    const addUser = async () => {
        if (userPassword === passwordCheck) {
            const params = {
                'name': userName,
                'password': userPassword,
                'phone': countrycode + phoneNumber,
                'uid': uuid,
            };
            console.log('params', params);
            message.loading({ content: 'Загрузка...', key });
            const result = await register(params, function (data) {
                localStorage.setItem('token', data.api_token);
                setTimeout(() => {
                    message.success({ content: 'Успешно!', key, duration: 2 });
                }, 1000);
                window.location.href = '/profile';
            }, function (data) {
                console.log("Error");
            });
        } else {
            message.error('Неправильный пароль', 10);
        }
    }

    function onChange(value) {
        console.log(`selected ${value}`);
        setCountryCode(value);
    }
    document.title = "Регистрация";
    useEffect(() => {
        window.verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        window.verify.render();
    }, []);

    const step1 = (
        <div className="col-xl-12 d-flex justify-content-center">
            <div className="col-xl-5 py-3 shadow bg-white text-center">
                <label className="py-3" style={{ fontSize: 20 }}>Регистрация профиля</label><br />

                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        label="Телефон"
                        name="phone"
                        rules={[{ required: true, message: 'Пожалуйста введите номер телефона!' }]}
                    >
                        <Input addonBefore={<Select
                            placeholder="код страны"
                            showSearch
                            optionFilterProp="children"
                            onChange={onChange}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="996">+996</Option>
                            <Option value="7">+7</Option>
                        </Select>} onChange={(e) => { setPhoneNumber(e.target.value) }} type="number" placeholder="(XXX) XXX XXX" />
                    </Form.Item>
                    <div className="my-3 ml-xl-5" id="recaptcha-container"></div>
                    <Form.Item wrapperCol={{ offset: 0 }}>
                        <Button style={{ backgroundColor: "#184d9f", color: "#fff" }} className="col-xl-7" htmlType="submit" onClick={signIn}>
                            Зарегистрироваться
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );

    const step2 = (
        <div className="form-group col-xl-6 py-5 px-5 shadow">
            <center>
                <label className="py-3" style={{ fontSize: 20 }}>Потверждение номера</label>
            </center>
            <Form.Item
                name="otp"
                rules={[{ required: true, message: 'Пожалуйста введите код потверждения!' }]}
            >
                <Input className="form-control" type="text" placeholder="Код потверждения"
                    onChange={(e) => { setOtp(e.target.value) }}></Input>
            </Form.Item>
            <center>
                <div className="text-secondary">{":" + timer}</div>
                <a href="/register" style={{ display: link ? "block" : "none" }}>Вернуться назад</a>
                <Form.Item wrapperCol={{ offset: 0 }}>
                    <Button style={{ backgroundColor: "#184d9f", color: "#fff" }} className='col-md-7' onClick={validateOtp}>Подтвердить</Button>
                </Form.Item>
            </center>
        </div>
    );
    const step3 = (
        <div className="form-group col-xl-6 shadow">
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Пожалуйста введите имя пользователя!' }]}
            >
                <Input className="form-control" type="text" placeholder="Имя пользователя"
                    onChange={(e) => { setUserName(e.target.value) }}></Input>
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Пожалуйста введите новый пароль!' }]}
            >
                <Input className="form-control" type="text" placeholder="Новый пароль"
                    onChange={(e) => { setPassword(e.target.value) }}></Input>
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Пожалуйста введите новый пароль снова!' }]}
            >
                <Input className="form-control" type="text" placeholder="Повторить пароль"
                    onChange={(e) => { checkPassword(e.target.value) }}></Input>
            </Form.Item>
            <center>
                <Form.Item wrapperCol={{ offset: 0 }}>
                    <Button style={{ backgroundColor: "#184d9f", color: "#fff" }} className='col-md-7' onClick={addUser}>Завершить регистрацию</Button>
                </Form.Item>
            </center>
        </div>
    );

    const steps = [
        {
            title: 'Шаг 1',
            content: step1,
        },
        {
            title: 'Шаг 2',
            content: step2,
        },
        {
            title: 'Шаг 3',
            content: step3,
        },
    ];

    return (
        <div>
            <Navbar />
            <div className="col-xl-12" style={{ height: "auto" }}>
                <div className="col-xl-12 d-flex justify-content-center mt-2 mt-md-3">
                    <div className="col-xl-6 bg-white xl-rounded-pill shadow-sm py-2 py-3">
                        <Steps current={current} size="small">
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                    </div>
                </div>
                <div className="steps-content col-xl-12 d-flex justify-content-center rounded mt-3 mt-xl-3" style={{ height: "400px" }}>
                    {steps[current].content}
                </div>
            </div>
        </div>
    );
}

export default Register;