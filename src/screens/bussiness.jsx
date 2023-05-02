import React, { useEffect, useState } from "react";
import { fetchBussinessPlans } from "../api/bussiness.js";
import BusinessItem from "../components/bussiness/bussiness_item.jsx";
import Navbar from "../components/navbar";

const SetBusinessProfile = () => {
    if (localStorage.getItem('token') == null) {
        window.location.href = "/";
    }

    const [plans, setPlans] = useState();
    const [periodId, setPeriodId] = useState();
    const [planId, setPlanId] = useState();
    const [itemPrice, setItemPrice] = useState(0);
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [sites, setSite] = useState();
    const [period, setPeriod] = useState(1);

    const BusinessPlans = async () => {
        const plan = await fetchBussinessPlans();
        if (plan != null) {
            setPlans(plan);
            console.log(plan);
        }
    }
    const setTime = (time) => {
        setPeriod(time);
        console.log(period);
        BusinessPlans();
    }

    useEffect(() => {
        BusinessPlans();
    }, [])

    return (
        <>
            <Navbar />
            <div className="col-xl-12 py-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a className="text-primary" href="/"><i className="fa-solid fa-house"></i> Главная страница</a></li>
                        <li className="breadcrumb-item active" aria-current="page"><a className="text-primary" href="/profile">Профиль</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Бизнес профиль</li>
                    </ol>
                </nav>
                <div className="row pt-2">
                    <div className="col-xl-12">
                        <h5>Выберите бизнес план</h5>
                        <hr />
                    </div>
                </div>
                <div className="row px-4 pb-3">
                    <div className="col-xl-12 py-3 border rounded">
                        <div className="row">
                            <div className="col-12 mb-3">
                                <div className="row py-3">
                                    <div className="col-2">
                                    </div>
                                    <div className="col-12 col-md-8 text-center">
                                        <button className="btn btn-outline-primary" onClick={() => { setTime(1) }}>1 месяц</button>
                                        <button className="btn btn-outline-primary" onClick={() => { setTime(3) }}>3 месяца</button>
                                        <button className="btn btn-outline-primary" onClick={() => { setTime(6) }}>6 месяцев</button>
                                        <button className="btn btn-outline-primary" onClick={() => { setTime(12) }}>1 год</button>
                                    </div>
                                    <div className="col-2">

                                    </div>
                                </div>
                                <div className="row mt-3">
                                    {plans != null ?
                                        <>
                                            {plans.map((item) =>
                                                <BusinessItem
                                                    plan={item}
                                                    periods={item.periods}
                                                    period={period}
                                                />
                                            )}
                                        </>
                                        :
                                        <>
                                            <div className="col-12 py-5 text-center">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default SetBusinessProfile;