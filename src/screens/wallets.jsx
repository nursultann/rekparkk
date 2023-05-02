import React, { useState } from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { Card, Modal } from 'antd';
import { depositAmount, userDetails } from "../api/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user_actions";
import Skeleton from '@mui/material/Skeleton';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const Wallets = () => {
    if (!localStorage.getItem('token')) {
        window.location.href = '/';
    }
    const [amount, setAmount] = useState(0);
    const [isModal, setModal] = useState(false);
    const [depositType, setDepositType] = useState(null);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const fetchUserDetails = async () => {
        const user = await userDetails();
        if (user != null) {
            dispatch(setUser(user));
        }
    };
    const closeModal = () => {
        setModal(false);
        setAmount(0);
    }
    const deposit = async () => {
        if (amount > 0 || amount != '') {
            if (depositType == 'bankcard') {
                const data = await depositAmount({
                    amount: amount,
                    success_url: 'https://rekpark.kg/complete',
                    payment_method: depositType
                })
                // console.log('data',data);
                if (data.redirect_url != null) {
                    window.location.href = data.redirect_url;
                }
            }
            if (depositType == 'wallet') {
                const data = await depositAmount({
                    amount: amount,
                    success_url: 'https://rekpark.kg/complete',
                    payment_method: depositType
                })
                // console.log('data',data);
                if (data.redirect_url != null) {
                    window.location.href = data.redirect_url;
                }
            }
        }
    }
    const openModal = (type) => {
        if (type == 'bankcard') {
            setModal(true);
            setDepositType(type);
        }
        if (type == 'wallet') {
            setModal(true);
            setDepositType(type);
        }
    }
    useEffect(() => {
        fetchUserDetails();
    }, []);
    return (
        user === null || user === undefined || user === ""
            ?
            <div className="col-md-12">
                <Skeleton variant="rectangular" width={'100%'} height={200} />
                <div className="row mt-3">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-12 mb-2">
                                <Skeleton variant="rectangular" width={'100%'} height={50} />
                            </div>
                            <div className="col-md-4">
                                <Skeleton variant="rectangular" width={'100%'} height={100} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </div>
                            <div className="col-md-4">
                                <Skeleton variant="rectangular" width={'100%'} height={100} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </div>
                            <div className="col-md-4">
                                <Skeleton variant="rectangular" width={'100%'} height={100} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :
            <>
                <Navbar />
                <div className="col-md-12 mt-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a style={{ color: "rgb(9, 72, 130)" }} href="/"><i
                                className="fa-solid fa-house"></i> Главная страница</a></li>
                            <li className="breadcrumb-item" aria-current="page"><a style={{ color: "rgb(9, 72, 130)" }} href="/profile">Мои
                                объявления</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Пополнить баланс</li>
                        </ol>
                    </nav>
                    <div className='row py-3 px-3'>
                        <div className="col-md-4 alert alert-primary py-3">
                            <h5>Пополнение баланса</h5>
                            <label><i className="fa-solid fa-user text-secondary"></i> Имя пользователя: {user.name}</label><br />
                            <label><i className="fa-solid fa-user text-secondary"></i> Пользователь: +{user.phone}</label><br />
                            <label><i className="fa-solid fa-money-check-dollar text-secondary"></i> Баланс: {user.balance} сом</label>
                        </div>

                        <div className='col-md-8'>
                            <h5>Метод оплаты</h5>
                            <div className='row px-3'>
                                <div className='col-md-4'>
                                    <div className='col-12 shadow p-5 d-flex justify-content-center align-items-center'>
                                        <h6 className='text-center'><a onClick={() => { openModal('bankcard') }}><i className="fa-solid fa-money-check-dollar"></i>Банковской картой</a></h6>
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='col-12 shadow p-5 d-flex justify-content-center align-items-center'>
                                        <h6 className='text-center'><a onClick={() => { openModal('wallet') }}><i className="fa-solid fa-money-check"></i> Электронные кошельки</a></h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
                <Modal
                    title="Пополнение счета"
                    visible={isModal}
                    onCancel={closeModal}
                    okText="пополнить сумму"
                    cancelText='отмена операции'
                    onOk={deposit}>
                    <div className='col-12'>
                        <div className='alert alert-primary'>
                            Введите пополнения сумму пополнения
                        </div>
                        <input
                            value={amount}
                            type={'number'}
                            placeholder='сумма пополнения'
                            className='form-control'
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </Modal>
            </>
    );
}
export default Wallets; 