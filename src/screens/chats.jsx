import React from "react";
import { Link, useHistory } from 'react-router-dom';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { deleteChat, getUserChats, getUserMessages, postUserMessage, readMessages, userDetails } from "../api/user";
import { useEffect, useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user_actions";
import { Avatar, Button, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { setProducts } from "../redux/actions/product_actions";
import * as api from "../api";
import ProductItem from "../components/product/user_product_item";
import { Tabs, notification } from 'antd';
import moment from "moment-timezone";
const openNotificationWithIcon = (type, info) => {
    notification[type]({
        message: info,
    });
};
const { TabPane } = Tabs;
const Chats = () => {
    // console.log(localStorage.getItem('token'));
    if (!localStorage.getItem('token')) {
        window.location.href = '/';
    }
    const history = useHistory();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [chats, setChats] = useState();
    const limit = 20;
    const [offset, setOffset] = useState(0);
    const [chat_id, setChatId] = useState();
    const [chat_name, setChatName] = useState();
    const [chat_image, setChatImage] = useState();
    const [message, setMessage] = useState();
    const [loadings, setLoadings] = useState();
    const [user_id, setUserId] = useState();
    const fetchUserDetails = async () => {
        const user = await userDetails();
        if (user != null) {
            dispatch(setUser(user));
            setUserId(user.id);
        }
    };
    const removeChat = async (id) => {
        console.log('id chat', id);
        const remove = await deleteChat(id);
        console.log(remove);
        if (remove != null) {
            openNotificationWithIcon('success', 'Чат успешно удалён!');
        }
    }
    const UserProducts = async () => {
        let _products = await api.fetchUserProducts({ 'sub': true });
        if (_products != null) {
            dispatch(setProducts(_products));
            setOffset(offset + limit);
        }
    };
    const fetchChats = async () => {
        const userChats = await getUserChats();
        if (userChats != null) {
            setChats(userChats);
            console.log(userChats);
        }
    }
    const getUserMessage = async (id, userName, partner_id) => {
        // console.log('id', id , 'userName', userName);
        history.push("/chat/" + id + "/" + userName);
    }
    const postMessage = async () => {
        setLoadings(true);
        if (message != "" && message != null) {
            const sendMessage = await postUserMessage({ 'user_id': chat_id, 'message': message });
            getUserMessage(chat_id);
            setMessage("");
            openNotificationWithIcon('success', 'Сообщение отправлено!');
            setLoadings(false);
        } else {
            openNotificationWithIcon('error', 'Заполните поле для сообщения!');
        }
    }
    moment.locale('ru');
    useEffect(() => {
        document.title = "Личный кабинет";
        fetchUserDetails();
        UserProducts();
        fetchChats();
    }, []);
    return (
        user === null || user === undefined || user === ""
            ? <div className="col-md-12 mt-3">
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
                <div className="col-xl-12 mt-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a style={{ color: "rgb(9, 72, 130)" }} href="/"><i className="fa-solid fa-house"></i> Главная страница</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Сообщения</li>
                        </ol>
                    </nav>
                    <div className="row px-3 mb-5">
                        <div className="col-xl-4 bg-light rounded py-3">
                            <div className="col-xl-12 alert text-white" style={{ backgroundColor: "#184d9f" }}>
                                <div className="row">
                                    <div className="col-12">
                                        {user.media?.length ?
                                            <Avatar size={64} icon={<img src={user.media[0].original_url} />} />
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
                                        <li className="list-group-item text-white" style={{ backgroundColor: "#184d9f" }}><Link to="/chats">Сообщения</Link></li>
                                        <li className="list-group-item"><Link to="/settings">Настройки пользователя</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <hr />
                        </div>
                        <div className="col-xl-8 mt-3 mt-md-0">
                            <div className="col-xl-12 px-2 py-2 rounded mb-3" style={{ backgroundColor: "#184d9f" }}>
                                <label className="text-white" style={{ fontSize: 15 }}>Сообщения</label>
                            </div>
                            <div className="container">
                                <div className="content-wrapper">
                                    <div className="row gutters">

                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">

                                            <div className="card m-0">
                                                <div className="row no-gutters">
                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                        <div className="users-container">
                                                            <ul className="users">
                                                                {chats?.length > 0 ?
                                                                    <>
                                                                        {chats.map((chat) =>
                                                                            <li className="person" data-chat="person1">
                                                                                <div className="user" onClick={() => getUserMessage(chat.user_1_id != user_id ? chat.user_1_id : chat.user_2_id, chat.advertisement_id)}>
                                                                                    {chat.advertisement.image != null ?
                                                                                    <>
                                                                                    <img src={chat.advertisement.image} />
                                                                                    <span className="status busy"></span>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                    <Image />
                                                                                    </>
                                                                                    }
                                                                                </div>
                                                                                <p className="name-time" onClick={() => getUserMessage(chat.user_1_id != user_id ? chat.user_1_id : chat.user_2_id, chat.advertisement_id)}>
                                                                                    <span className="name">{chat.advertisement.title}</span>
                                                                                </p>
                                                                                <div className="float-right">
                                                                                    <span><i className="fa-solid fa-trash-can text-primary" onClick={() => removeChat(chat.id)}></i></span>
                                                                                </div>
                                                                            </li>
                                                                        )}
                                                                    </> :
                                                                    <div className="col-12 text-center">
                                                                        Пока нет сообщений
                                                                    </div>
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <Tabs className="border px-2 py-4 rounded" tabPosition="left">
                                {chats != null || chats != undefined || chats?.length > 0  ?
                                <>
                                {chats.map((chat)=>
                                <TabPane tab={
                                    <div className="col-10 col-xl-12">
                                    <div className="row">
                                        <div className="col-3 col-xl-2">
                                        <Avatar size={"100%"} icon={<UserOutlined />} />
                                        </div>
                                        <div className="col-9 col-xl-10">
                                        <div className="about">
                                        <div className="name"><a href="#" onClick={()=>getUserMessage(chat.id)}>{chat.name}</a></div>                                            
                                        </div>
                                        </div>
                                    </div>
                                    <hr className="d-none d-md-block"/>
                                    </div>
                                } key={chat.id}>
                                    <div className="col-xl-12">
                                        <div className="row border rounded py-3" style={{height:"300px",overflowY:"scroll"}}>
                                            {messages != null ?
                                            <>
                                            {
                                            

                                            }
                                            <div className="col-12 text-left">
                                                <label className="bg-light px-4 rounded-pill">
                                                    Text
                                                </label>
                                            </div>
                                            <div className="col-12 text-right">
                                                <label className="bg-light px-4 rounded-pill">
                                                    Text
                                                </label>
                                            </div>
                                           </>
                                           :<></> 
                                            }   
                                        </div>
                                        <div className="row mt-3">
                                        <div className="col-xl-12">
                                        <textarea className="form-control"></textarea>
                                        </div>
                                        <div className="col-xl-12 mt-3 text-right">
                                        <Button type="primary">Отправить</Button>
                                        </div>
                                        </div>    
                                    </div>
                                </TabPane>
                                )}
                                </>:<center>Нет Чатов</center>
                                }
                            </Tabs> */}
                        </div>
                    </div>
                </div>
            </div>
    );
}
export default Chats;