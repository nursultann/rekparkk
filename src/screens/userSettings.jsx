import React from "react";
import { Link } from 'react-router-dom';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { userDetails, userSettings } from "../api/user";
import { useEffect, useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user_actions";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Button } from "@mui/material";
import { setProducts } from "../redux/actions/product_actions";
import * as api from "../api";
import { Tabs } from 'antd';
import { Input } from 'antd';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const key = 'updatable';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageurl] = useState();
    const [name, setName] = useState();
    const [userid, setUserid] = useState();
    const [file, setFile] = useState();

    function beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return false;
        }

        setFile(file);
        getBase64(file, function (result) {
            setImageurl(result);
        });

        return false;
    }

    const handleChange = (info) => { }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    if (!localStorage.getItem('token')) {
        window.location.href = '/';
    }
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const limit = 20;
    const [offset, setOffset] = useState(0);

    const fetchUserDetails = async () => {
        const user = await userDetails();
        if (user != null) {
            dispatch(setUser(user));
            setUserid(user.id);
        }
    };

    const UserProducts = async () => {
        let _products = await api.fetchUserProducts({ 'sub': true });
        if (_products != null) {
            dispatch(setProducts(_products));
            setOffset(offset + limit);
        }
    };

    const saveSettings = async () => {
        const formData = new FormData();
        if (name != null) {
            if (name.length > 4) {
                formData.append('name', name);
            } else {
                message.error('Имя не может быть короче 4 символов', 10);
                return;
            }

        }
        if (file != null) {
            formData.append('avatar', file);
        }
        if (name != null || file != null) {
            formData.append('_method', 'PATCH');
            message.loading({ content: 'Загрузка...', key });
            const result = await userSettings(formData, userid, function (data) {
                fetchUserDetails();
                setTimeout(() => {
                    message.success({ content: 'Успешно!', key, duration: 2 });
                }, 1000);
                // window.location.href = '/profile';
            }, function (data) {
                console.log("Error");
            });
        }
    }
    document.title = "Настройки пользователя";
    useEffect(() => {
        fetchUserDetails();
        UserProducts();
    }, []);

    return (
        user === null || user === undefined || user === ""
            ? <div className="col-md-12">
                <Skeleton variant="rectangular" width={'100%'} height={200} />
                <div className="row mt-3">
                    <div className="col-md-4">
                        <Skeleton variant="text" />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={118} />
                    </div>
                    <div className="col-md-8">
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
            <div>
                <Navbar />
                <div className="col-md-12 mt-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a className="text-primary" href="/"><i className="fa-solid fa-house"></i> Главная страница</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Настройки пользователя</li>
                        </ol>
                    </nav>
                    <div className="row px-3 mb-5">
                        <div className="col-md-4 bg-light rounded py-3">
                            <div className="col-md-12 text-white alert" style={{ backgroundColor: "#184d9f" }}>
                                <div className="row">
                                    <div className="col-12">
                                        {user.media?.length ?
                                            <Avatar size={64} icon={<img src={user.media[0].original_url} alt="" />} />
                                            :
                                            <Avatar size={42} icon={<UserOutlined />} />
                                        }
                                        <label className="ml-3">{user.name}</label>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-xl-12">
                                    <ul className="list-group">
                                        <li className="list-group-item">+{user.phone}</li>
                                        <li className="list-group-item"><Link to="/wallets">Пополнить</Link>: {user.balance} сом</li>
                                        <li className="list-group-item"><Link to="/profile">Мои объявления</Link></li>
                                        <li className="list-group-item"><Link to="/favorites">Избранные</Link></li>
                                        <li className="list-group-item"><Link to="/chats">Сообщения</Link></li>
                                        <li className="list-group-item text-white" style={{ backgroundColor: "#184d9f" }}><Link to="/settings">Настройки пользователя</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <hr />
                        </div>
                        <div className="col-md-8 mt-4 mt-md-0">
                            <div className="col-md-12 border rounded py-3">
                                <label style={{ fontSize: 18 }}>Настройки пользователя</label>
                                <div className="row py-3">
                                    <div className="col-md-12 mb-3">
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                        >
                                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                        </Upload>
                                    </div>
                                    <div className="col-md-1">
                                        <label style={{ fontSize: 16 }}>Имя:</label>
                                    </div>
                                    <div className="col-md-4">
                                        <Input placeholder="Имя" onChange={(e) => { setName(e.target.value) }} />
                                    </div>
                                    <div className="col-md-12 mt-4">
                                        <Button type="primary" onClick={saveSettings} style={{ backgroundColor: '#184d9f', color: "#fff" }}>Сохранить изменения</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}
export default Settings;