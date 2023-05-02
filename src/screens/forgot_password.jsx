import React from 'react';
import { useState, useEffect, Link } from 'react';
import { checkPhone, passwordChange, login } from "../api/user";
import { firebase, auth } from "../config/firebase_config";
import { Steps, Button, message, Form, Input, Select, InputNumber } from 'antd';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useHistory } from 'react-router-dom';

const { Option } = Select;
const { Step } = Steps;
const key = 'updatable';

const ForgotPassword = () => {
    const history = useHistory();
    const [phoneNumber, setPhoneNumber] = useState();
    const [countryСode, setCountryCode] = useState();
    const [current, setCurrent] = useState(0);
    const [final, setFinal] = useState('');
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(59);
    const [password, setPassword] = useState();
    const [passwordCheck, checkPassword] = useState();
    const [uuid, setUuid] = useState();
    const [link, setLink] = useState(false);
    const result = "";

    const getAccessCode = async () => {
        const check = await checkPhone(countryСode + phoneNumber);
        if (check == false) {
            message.warning('Такого пользователя не удалось найти!', 10);
        } else if (check == true) {
            if (phoneNumber === "" || phoneNumber.length < 9) return;
            auth.signInWithPhoneNumber(`+${countryСode + phoneNumber}`, window.verify).then((result) => {
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
                message.error('Номер указан неверно или было очень много попыток потверждения номера!', 10);
                alert(err);
                window.location.reload()
            });
        }
    }

    const validateOtp = () => {
        // clearInterval(getAccessCode.time);
        if (otp === null || final === null)
            return;
        final.confirm(otp).then((result) => {
            message.success('Код потверждения верный', 10);
            setUuid(result.user.uid);
            console.log('firebase result', result);
            setCurrent(current + 1);
            // result.user.uuid;

            console.log('success ', result);

        }).catch((err) => {
            message.error('Код потверждения введен неверно!', 10);
        })
    }

    const saveChanges = async () => {
        if (password == passwordCheck) {
            const params = {
                'new_password': password,
                'uid': uuid,
                'phone': countryСode + phoneNumber,
            };
            message.loading({ content: 'Загрузка...', key });
            const result = await passwordChange(params, async function (data) {
                console.log(data);
                // localStorage.setItem('token', params['api_token']); 
                const loginResult = await login(countryСode + phoneNumber, password, function (user) {
                    localStorage.setItem('token', user.api_token);
                    history.push('/profile');
                }, function (data) {
                    message.loading({ content: 'Пароль успешно обновлен!', key });
                    history.push('/login');
                });
            }, function (data) {
                console.log("Error", data);
            });
        } else {
            message.error('Пароли не совпадают!', 10);
        }

    }

    function onChange(value) {
        console.log(`selected ${value}`);
        setCountryCode(value);
    }
    document.title = "Восстановление пароля";
    useEffect(() => {
        window.verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        window.verify.render();
    }, []);

    const step1 = (
        <div className="col-xl-12 d-flex justify-content-center px-0">
            <div className="col-xl-5 py-3 shadow bg-white text-center">
                <label className="py-3" style={{ fontSize: 20 }}>Восстановление пароля</label><br />
                <Form
                    name="basic"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    initialValues={{ remember: true }}
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
                    <div className="my-3" id="recaptcha-container"></div>
                    <Form.Item wrapperCol={{ offset: 0 }}>
                        <button className="col-md-7 btn btn-primary" style={{ backgroundColor: "#184d9f", color: "#fff" }} htmlType="submit" onClick={getAccessCode}>
                            Получить код потверждения
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );

    const step2 = (
        <div className="form-group col-xl-6 px-0">
            <Form.Item
                name="otp"
                rules={[{ required: true, message: 'Пожалуйста введите код потверждения!' }]}
            >
                <Input className="form-control" type="text" placeholder="Код потверждения"
                    onChange={(e) => { setOtp(e.target.value) }}></Input>
            </Form.Item>
            <center>
                <div className="text-secondary">{":" + timer}</div>
                <a href="/forgot_password" style={{ display: link ? "block" : "none" }}>Вернуться назад</a>
                <Form.Item wrapperCol={{ offset: 0 }}>
                    <button className="col-md-7 btn btn-primary" style={{ backgroundColor: "#184d9f", color: "#fff" }} onClick={validateOtp}>Подтвердить</button>
                </Form.Item>
            </center>
        </div>
    );

    const step3 = (
        <div className="form-group col-xl-6 px-0">
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
                    <button className="col-md-7 btn btn-primary" style={{ backgroundColor: "#184d9f", color: "#fff" }} onClick={saveChanges}>Сохранить новый пароль</button>
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
            <div className="col-xl-12 py-3" style={{ height: "auto" }}>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a className="text-primary" href="/"><i className="fa-solid fa-house"></i> Главная страница</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Забыли пароль</li>
                    </ol>
                </nav>
                <div className="col-xl-12 d-flex justify-content-center mt-0 mt-xl-3 px-0">
                    <div className="col-xl-6 bg-white md-rounded-pill py-2 py-3">
                        <Steps current={current} size="small">
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                    </div>
                </div>
                <div className="steps-content col-xl-12 d-flex justify-content-center rounded mt-3 mt-xl-3 px-0">
                    {steps[current].content}
                </div>
            </div>
        </div>
    );
}
export default ForgotPassword;