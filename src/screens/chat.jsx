import React from "react";
import { Link, useParams } from 'react-router-dom';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { getUserChats, getUserMessages, postUserMessage, readMessages, userDetails } from "../api/user";
import { useEffect, useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user_actions";
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { setProducts } from "../redux/actions/product_actions";
import * as api from "../api";
import ProductItem from "../components/product/user_product_item";
import { notification } from 'antd';
import moment from "moment-timezone";
const openNotificationWithIcon = (type, info) => {
    notification[type]({
        message: info,
    });
};
const ChatUser = () => {
    if (!localStorage.getItem('token')) {
        window.location.href = '/';
    }
    const param = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [messages, setMessages] = useState(null);
    const [chat_id, setChatId] = useState();
    const [chat_name, setChatName] = useState();
    const [chat_image, setChatImage] = useState();
    const [message, setMessage] = useState();
    const [loadings, setLoadings] = useState();
    const [postId, setPostId] = useState();
    const [product, setProduct] = useState(null);
    const userid = param.id;
    const advertisement_id = param.ad_id;
    const fetchUserDetails = async () => {
        const user = await userDetails();
        if (user != null) {
            dispatch(setUser(user));
        }
    };
    const getUserMessage = async () => {
        console.log(userid);
        setChatId(userid);
        // setChatName(userName);
        const userMessages = await getUserMessages({ 'chat_user_id': userid, 'advertisement_id': advertisement_id, 'with': 'sender' });
        if (userMessages != null) {
            setMessages(userMessages.reverse());
            setPostId(messages[0].advertisement_id);
            console.log('messages', messages);
        }
    }
    const postMessage = async () => {
        setLoadings(true);
        if (message != "" && message != null) {
            const sendMessage = await postUserMessage({ 'user_id': chat_id, 'message': message, 'advertisement_id': advertisement_id });
            getUserMessage(chat_id);
            setMessage("");
            openNotificationWithIcon('success', 'Сообщение отправлено!');
            setLoadings(false);
        } else {
            openNotificationWithIcon('error', 'Заполните поле для сообщения!');
        }
    }
    if (product == null) {
        if (messages != null) {
            const productDetails = async () => {
                const _product = await api.fetchProduct(messages[0].advertisement_id);
                const readMessage = await readMessages({ 'partner_id': chat_id });
                setProduct(_product);
                console.log("read", readMessage);
            }
            productDetails();
        }
    }
    moment.locale('ru');
    useEffect(() => {
        document.title = "Сообщение пользователя";
        fetchUserDetails();
        getUserMessage();
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
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 px-0">
                                            <div className="card m-0">
                                                <div className="row no-gutters">
                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                        <div className="selected-user">
                                                            <span>Сообщения от <span className="name">{chat_name}</span></span>
                                                        </div>
                                                        <div className="col-12 alert alert-primary">
                                                            {product != null ?
                                                                <>
                                                                    <img src={product.image} width="50px" />
                                                                    <a href={"/products/" + product.id}><span className="ml-2">{product.title}</span></a>
                                                                </>
                                                                :
                                                                <>

                                                                </>
                                                            }
                                                        </div>
                                                        <div className="chat-container">
                                                            <ul className="chat-box chatContainerScroll">
                                                                {
                                                                    messages?.length > 0 ?
                                                                        <>
                                                                            {
                                                                                messages.map((item) =>
                                                                                    <>
                                                                                        {item.sender_id == chat_id ?
                                                                                            <li className="chat-left">
                                                                                                <div className="chat-avatar">
                                                                                                    <img src={item.sender.image} alt="Retail Admin" />
                                                                                                    <div className="chat-name">{item.sender.name}</div>
                                                                                                </div>
                                                                                                <div className="chat-text">
                                                                                                    {item.message}
                                                                                                </div>
                                                                                                {/* <div className="chat-hour">{moment(item.created_at, 'YYYYMMDD, h:mm:ss a').tz('Asia/Almaty').format('LLLL')}</div> */}
                                                                                            </li>
                                                                                            :
                                                                                            <li className="chat-right">
                                                                                                {/* <div className="chat-hour">{moment(item.created_at, 'YYYYMMDD, h:mm:ss a').tz('Asia/Almaty').format('LLLL')}
                                                                                                    {item.sender.read_at != null ? <span className="fa fa-check-circle"></span> : <></>}
                                                                                                </div> */}
                                                                                                <div className="chat-text">
                                                                                                    {item.message}
                                                                                                </div>
                                                                                                <div className="chat-avatar">
                                                                                                    <img src={item.sender.image} alt="Retail Admin" />
                                                                                                    <div className="chat-name">{item.sender.name}</div>
                                                                                                </div>
                                                                                            </li>
                                                                                        }
                                                                                    </>
                                                                                )}
                                                                        </> : <></>
                                                                }
                                                            </ul>
                                                        </div>
                                                        {chat_id ?
                                                            <div className="form-group text-right py-2 px-3 mt-3 mb-0">
                                                                <textarea className="form-control" rows="3" placeholder="Напишите ваше сообщение..."
                                                                    onChange={(e) => { setMessage(e.target.value) }} value={message}></textarea>
                                                                <button style={{ backgroundColor: "#184d9f" }} className="btn btn-primary mt-3 mb-2" type="primary" loading={loadings} onClick={postMessage}>
                                                                    Отправить
                                                                </button>
                                                            </div>
                                                            : <></>
                                                        }
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
export default ChatUser;