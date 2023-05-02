import React, {useEffect, useState} from "react";
import Navbar from "../components/navbar";
import {useSelector, useDispatch} from "react-redux";
import * as api from "../api";
import {useHistory} from "react-router-dom";
import {
    Form,
    notification
} from "antd";
import ProductFields from "../components/product/product_fields";
import {setUser} from "../redux/actions/user_actions";

const DG = require('2gis-maps');

const CreateAd = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [form] = Form.useForm();

    const fetchUserDetails = async () => {
        const userDetails = await api.userDetails();
        if (userDetails != null) {
            dispatch(setUser(userDetails));
        }
    };

    useEffect(() => {
        let marker;
        let map = null;
        //2gis map
        DG.then(function () {
            map = DG.map('map', {
                'center': [40.500305, 72.814718],
                'zoom': 13
            });
            marker = DG.marker([40.500305, 72.814718], {
                draggable: true
            }).addTo(map);
            marker.on('drag', function (e) {
                let lat = e.target._latlng.lat.toFixed(3);
                let lng = e.target._latlng.lng.toFixed(3);
                setLocation({latitude: lat, longitude: lng});
            });
        });
    }, []);

    console.log("location", location);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    return (
        <div>
            <Navbar/>
            <div className="col-12 mt-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a style={{color: "rgb(9, 72, 130)"}} href="/">
                            <i className="fa-solid fa-house"/> Главная страница</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Новое объявление</li>
                    </ol>
                </nav>
            </div>
            <div className="col-md-8 p-3">
                <center className="pb-4">
                    <label style={{fontSize: 25}}>Создать новое объявление</label>
                    <p>Поля, обозначенные <span className="text-danger">*</span> - обязательные. После создания
                        объявления Вы можете редактировать и удалять его в Личном кабинете.</p>
                </center>
                <ProductFields
                    form={form}
                    loading={loading}
                    onSend={async (model) => {
                        console.log('phones', form.getFieldValue('phones'));
                        console.log('video', form.getFieldValue('video'));
                        const valid = await form.validateFields();
                        if (valid) {
                            const formData = new FormData();
                            formData.append('user_id', user.id);
                            formData.append('currency_id', model.currency_id);
                            formData.append('location', JSON.stringify(location));
                            model.files.forEach(file => {
                                formData.append('images[]', file);
                            });
                            for (const [key, value] of Object.entries(form.getFieldsValue())) {
                                formData.append(`${key}`, value);
                            }
                            setLoading(true);
                            const response = await api.createProduct(formData);
                            if (response != null && response.success) {
                                openNotification('success', 'Объявление отправлено на модерацию!', null);
                                console.log();
                                history.push(`/`);
                            } else {
                                openNotification('error', 'Не удалось опубликовать!', null);
                            }
                            setLoading(false);
                        }
                    }}
                />
            </div>
        </div>
    );
}


export default CreateAd;