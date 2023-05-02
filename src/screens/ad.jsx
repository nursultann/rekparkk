import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct, userDetails } from "../api";
import { addToFavorites, answerComment, deleteComments, getComplaints, postComment, postComplaints, removeFromFavorites } from "../api/product";
import { setProductDetails } from "../redux/actions/product_actions";
import Carousel from 'react-gallery-carousel';
import { FacebookShareButton, WhatsappShareButton, TelegramShareButton } from "react-share";
import { FacebookIcon, WhatsappIcon, TelegramIcon } from "react-share";
import { Modal, Comment, Avatar, Form, Button, List, Input, message, Select, notification, Image } from 'antd';
import moment from 'moment';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { createComment } from "../api/product";
import { Link } from 'react-router-dom';
import { postUserMessage } from "../api/user";
const key = "updateable";
const { TextArea } = Input;
const { Option } = Select;
const openNotificationWithIcon = (type, info) => {
    notification[type]({
        message: info,
    });
};
const Ad = ({ match }) => {
    const dispatch = useDispatch();
    const { productDetails } = useSelector((state) => state.product);
    const [favorite, setFavorite] = useState();
    const [userId, setUserId] = useState();
    const [parentId, setParentId] = useState();
    const [comment, setComment] = useState(false);
    const [userDetail, setUserDetail] = useState();
    const [complaintsText, setComplaintsText] = useState();
    const [reason, setReason] = useState();
    const [childrens, setChildrens] = useState();
    const [productUserDetails, setProductUserDetail] = useState();
    const [loadings, setLoadings] = useState();
    const [messag, setMessage] = useState();
    const [chat_id, setChatId] = useState();
    const [phones, setPhones] = useState();
    const [location, setLocation] = useState(undefined);
    const [map1, setMap1] = useState(<div id="map" style={{ width: "100%", height: "400px" }}></div>);
    const fetchProductDetails = async () => {
        const productDetails = await fetchProduct(match.params.id, {
            'with': 'category;customAttributeValues.customAttribute;region;city;user;comments.user'
        });
        if (productDetails != null) {
            dispatch(setProductDetails(productDetails));
            setFavorite(productDetails.is_favorite);
            // dispatch(setProductUserDetails(productDetails.user));
            setProductUserDetail(productDetails.user);
            setChatId(productDetails.user_id);
            setPhones(productDetails.phones);
            var position = productDetails.location;
            if (position != undefined) {
                setLocation(JSON.parse(position));
            }
            // console.log('product',productDetails);
            document.title = productDetails.title;
        }
        const user = await userDetails();
        if (user != null) {
            setUserDetail(user);
            setUserId(user.id);
        }
    };
    if (location != undefined) {
        //map
        var DG = require('2gis-maps');
        var map;
        var marker;
        DG.then(function () {
            map = DG.map('map', {
                'center': [location.latitude, location.longitude],
                'zoom': 13
            });
            DG.marker([location.latitude, location.longitude]).addTo(map);
        });
    }
    console.log(productDetails);
    //reason
    const fetchComplaints = async () => {
        const complaints = await getComplaints();
        if (complaints != null) {
            setChildrens(complaints);
        }
        // const childrens = [];
        // for (let i = 10; i < 36; i++) {
        //   childrens.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
        // }
    }
    //comments
    const token = localStorage.getItem('token');
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');
    const onSubmit = async () => {
        if (!value) {
            return;
        }
        const user = await userDetails();
        if (user != null) {
            setUserId(user.id);
        }
        setSubmitting(true);
        const result = await createComment(value, productDetails.id, userId);
        console.log(result)
        setValue('');
        message.success({ content: 'Добавлен комментарий!', key, duration: 2 });
        fetchProductDetails();
        setSubmitting(false);
    }
    const clickAnswer = (userName, parent) => {
        setComment(true);
        setParentId(parent);
        setValue("@" + userName);
    }
    const deleteComment = async (id) => {
        const result = await deleteComments(id);
        message.error({ content: 'Комментарий удалён!', key, duration: 2 });
        fetchProductDetails();
    }
    const Answer = async () => {
        const user = await userDetails();
        if (user != null) {
            setUserId(user.id);
        }
        setSubmitting(true);
        const result = await answerComment(value, productDetails.id, userId, parentId);
        console.log(result)
        setValue('');
        message.success({ content: 'Добавлен ответ на комментарий!', key, duration: 2 });
        fetchProductDetails();
        setSubmitting(false);
    }
    const CommentList = (productDetails) => (
        <List
            dataSource={productDetails.comments}
            header={`${productDetails.comments.length} ${productDetails.comments.length > 1 ? 'Комментариев' : 'Комментариев'}`}
            itemLayout="horizontal"
            renderItem={item => <Comment
                actions={[
                    <span key="comment-basic-reply-to" onClick={() => clickAnswer(item.user != null ? (item.user.name, item.id) : "Удаленный пользователь")}>{token != null ? <>Ответить</> : <></>}</span>,
                    <span key="comment-basic-reply-to" onClick={() => deleteComment(item.id)}>{item.user != null ? (item.user.id == userId ? <>Удалить</> : <></>) : <></>}</span>
                ]}
                avatar={<Avatar src={item.user?.media?.length ? item.user.media[0].original_url : 'https://joeschmoe.io/api/v1/random'} />}
                author={item.user != null ? item.user.name : "Удаленный пользователь"}
                content={item.text}
            />}
        />
    );

    const addFav = async () => {
        const addToFav = await addToFavorites(productDetails.id);
        message.success({ content: 'Добавлено в избранное!', key, duration: 2 });
        setFavorite(true);
    }
    const removeFav = async () => {
        const addToFav = await removeFromFavorites(productDetails.id);
        message.error({ content: 'Удалено из избранного!', key, duration: 2 });
        setFavorite(false);
    }
    useEffect(() => {
        fetchProductDetails();
        fetchComplaints();

    }, []);
    //complaints
    const PostComplaint = async () => {
        const params = {
            'complaint_type_id': reason,
            'text': complaintsText,
            'advertisement_id': productDetails.id
        }
        const postComplaint = await postComplaints(params);
        message.success("Ваше обращение отправлено!", 1000);
    }
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [modalText, setModalText] = React.useState('Content of the modal');

    const showModal = () => {
        setVisible(true);
    };
    function handleChange(value) {
        console.log(`Selected: ${value}`);
        setReason(value);
    }
    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setVisible(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };
    if (productDetails != null) {
        var time = moment(productDetails.created_at, 'YYYYMMDD, H:mm:ss');
        moment.locale('ru');
        var update = time.fromNow();
    }
    const postMessage = async () => {
        setLoadings(true);
        if (messag != "" && messag != null) {
            const sendMessage = await postUserMessage({ 'user_id': chat_id, 'message': messag, 'advertisement_id': match.params.id });
            setMessage("");
            openNotificationWithIcon('success', 'Сообщение отправлено!');
            setLoadings(false);
        } else {
            openNotificationWithIcon('error', 'Заполните поле для сообщения!');
        }
    }
    const postQuickMessage = async (messag) => {
        setLoadings(true);
        if (messag != "" && messag != null) {
            const sendMessage = await postUserMessage({ 'user_id': chat_id, 'message': messag, 'advertisement_id': match.params.id });
            setMessage("");
            openNotificationWithIcon('success', 'Сообщение отправлено!');
            setLoadings(false);
        } else {
            openNotificationWithIcon('error', 'Заполните поле для сообщения!');
        }
    }
    return (
        <div>
            <Navbar />
            {productDetails != null ? <>
                <div className="col-xl-12 mt-xl-3 mt-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a style={{ color: "rgb(9, 72, 130)" }} href="/"><i className="fa-solid fa-house"></i> Главная страница</a></li>
                            <li className="breadcrumb-item"><a style={{ color: "rgb(9, 72, 130)" }} href={"/category/" + productDetails.category_id}>Объявления из категории</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{productDetails.title}</li>
                        </ol>
                    </nav>
                    <div className="row px-xl-3 px-2">
                        <div className="col-xl-8 border rounded py-3">
                            <div className="row">
                                <div className="col-xl-12">
                                    <label style={{ fontSize: "22px", whiteSpace: "normal", color: "rgb(9, 72, 130)" }}>{productDetails.title}</label><br />
                                    {productDetails.media.length > 0 ?
                                        <Carousel
                                            images={productDetails.media.map((item) => ({
                                                src: `${item.original_url}`
                                            }))}
                                            style={{ height: "450px", width: "100%" }}
                                        />
                                        :
                                        <div className="col-12 border rounded p-1">
                                            <Image
                                                width={"100%"}
                                                height={450}
                                                src="error"
                                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                                            />
                                        </div>
                                    }
                                </div>
                                <div className="col-xl-12">
                                    <hr className="d-block d-xl-none" />
                                    <div className="row">
                                        <div className="col-xl-12 mt-3" style={{ fontSize: "14px", whiteSpace: "normal", color: "rgb(9, 72, 130)" }}>
                                            <div className="row">
                                                <label className="col-6">Категория:</label><label className="col-6">{productDetails.category != null ? productDetails.category.name : <></>}</label>
                                                <label className="col-6">Цена:</label><label className="col-6">{productDetails.price + " " + productDetails.currency_symbol}</label>
                                                {productDetails.custom_attribute_values != null ?
                                                    productDetails.custom_attribute_values.map((item) => {
                                                        return (
                                                            <>
                                                                <label className="col-6">{item.custom_attribute.title}:</label>
                                                                <label className="col-6">{item.value}</label>
                                                            </>
                                                        )
                                                    })
                                                    : <></>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="col-xl-12">
                                <label style={{ fontSize: "18px", whiteSpace: "normal" }}>Описание</label>
                                <p className="label">{productDetails.description}</p>
                            </div>
                        </div>
                        <div className="col-xl-4">
                            <div className="col-xl-12 border rounded mt-3 mt-xl-0">
                                <div className="row">
                                    <div className="col-xl-12 mt-xl-4">
                                        <hr className="d-block d-xl-none" />
                                        <button className="btn col-xl-12 text-white" style={{ backgroundColor: "rgb(9, 72, 130)" }} data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1"><i className="fas fa-phone-volume"></i> Показать номер</button>
                                        <div className="collapse multi-collapse" id="multiCollapseExample1">
                                            <div className="card card-body">
                                                {phones != null && phones.length > 12 ?
                                                    <>
                                                        {phones.split(",").map((item) =>
                                                            <a href={"tel:" + item}>{item}</a>
                                                        )
                                                        }
                                                    </>
                                                    :
                                                    <>
                                                        <a href={"tel:" + phones}>{phones}</a>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {token ?
                                        <>
                                            <div className="col-xl-12 mt-xl-2">
                                                <hr className="d-block d-xl-none" />

                                                {favorite ?
                                                    <button className="btn col-xl-12 text-white" style={{ backgroundColor: "rgb(9, 72, 130)" }} onClick={removeFav}><i className="far fa-heart"></i>Удалить из избранного</button>
                                                    :
                                                    <button className="btn btn-outline-secondary col-xl-12" onClick={addFav}><i className="far fa-heart"></i> Добавить в избранное</button>
                                                }

                                            </div>
                                        </>
                                        : <></>
                                    }
                                    <div className="col-xl-12 mt-xl-2">
                                        <hr className="d-block d-xl-none" />
                                        <button className="btn btn-outline-danger col-xl-12" onClick={showModal}><i className="fas fa-exclamation-triangle"></i> Пожаловаться</button>
                                    </div>
                                </div>
                                <div className="col-xl-12 mt-xl-2">
                                    <hr />
                                    <div className="row">
                                        <div className="col-2">
                                            {productDetails.user != null ?
                                                <>
                                                    {productDetails.user?.media?.length ?
                                                        <>
                                                            {productDetails.user.business_account != null ?
                                                                <>
                                                                    <div className='rounded-circle'
                                                                        style={{
                                                                            backgroundImage: 'url(' + productDetails.user.business_account.logoImage + ')',
                                                                            width: "50px",
                                                                            height: "50px",
                                                                            backgroundSize: "cover"
                                                                        }}>
                                                                        <span className='badge badge-danger mt-4 ml-4'>pro</span>
                                                                    </div>
                                                                </>
                                                                :
                                                                <img className="mb-3" src={productDetails.user.media[0].original_url} style={{ borderRadius: "50%", width: "50px", height: "50px" }} />
                                                            }
                                                        </>
                                                        :
                                                        <Avatar size={42} icon={<UserOutlined />} />
                                                    }
                                                </>
                                                : <></>
                                            }
                                        </div>
                                        <div className="col-10 px-4">
                                            {productDetails.user != null ?
                                                <>
                                                    <Link to={"/userAds/" + productDetails.user_id}>
                                                        {productDetails.user.business_account != null ?
                                                            <>
                                                                {productDetails.user.business_account.name}
                                                            </>
                                                            :
                                                            <>
                                                                {productDetails.user != null ? productDetails.user.name : <></>}
                                                            </>
                                                        }
                                                    </Link>
                                                    <p className="border rounded bg-light px-1 text-secondary">{productDetails.user.active_count} объявлений пользователя</p>
                                                </>
                                                : <></>
                                            }
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                                <div className="col-6 col-xl-12 mt-2">
                                    <label className="text-muted"><b>Поделиться</b></label><br />
                                    <FacebookShareButton
                                        url={window.location.href}
                                        quote={"フェイスブックはタイトルが付けれるようです"}
                                        hashtag={"#hashtag"}
                                        description={"aiueo"}
                                        className="Demo__some-network__share-button mr-1"
                                    >
                                        <FacebookIcon size={30} round />
                                    </FacebookShareButton>
                                    <WhatsappShareButton
                                        url={window.location.href}
                                        quote={"フェイスブックはタイトルが付けれるようです"}
                                        hashtag={"#hashtag"}
                                        description={"aiueo"}
                                        className="Demo__some-network__share-button mr-1"
                                    >
                                        <WhatsappIcon size={30} round />
                                    </WhatsappShareButton>
                                    <TelegramShareButton
                                        url={window.location.href}
                                        quote={"フェイスブックはタイトルが付けれるようです"}
                                        hashtag={"#hashtag"}
                                        description={"aiueo"}
                                        className="Demo__some-network__share-button"
                                    >
                                        <TelegramIcon size={30} round />
                                    </TelegramShareButton>
                                    <hr className="d-none d-xl-block" />
                                </div>
                                <div className="col-xl-12 mt-2 mt-xl-2">
                                    <label className="ml-0 ml-xl-3 text-muted"><i className="far fa-eye"></i> Просмотры: {productDetails.views}<br />
                                        <i className="fas fa-map-marker-alt"></i> Местоположение: {productDetails.region != null ? productDetails.region.name + "," + productDetails.city.name : ""}<br />
                                        <i className="far fa-clock"></i> Обновлено: {update}
                                    </label>
                                </div>
                            </div>
                            <hr />
                            {token ?
                                <div className="col-xl-12 border rounded p-2">
                                    <div className="col-xl-12 text-center" style={{ backgroundColor: "rgb(9, 72, 130)" }}>
                                        <label className="p-2 rounded text-white">Написать сообщение к {productDetails.user.name}</label>
                                    </div>
                                    <div className="col-xl-12 mt-2 px-0">
                                        <textarea rows="10" className="form-control" value={messag} onChange={(e) => { setMessage(e.target.value) }}></textarea>
                                        <Button loading={loadings} className="btn btn-outline-primary rounded col-12 mt-2" onClick={postMessage}>Отправить</Button>
                                        <Button className="btn text-white rounded mt-2 col-12" style={{ backgroundColor: "rgb(9, 72, 130)" }} onClick={() => postQuickMessage("Еще актуально?")}>Еще актуально?</Button>
                                        <Button className="btn text-white rounded mt-2 col-12" style={{ backgroundColor: "rgb(9, 72, 130)" }} onClick={() => postQuickMessage("Обмен интересует?")}>Обмен интересует?</Button>
                                        <Button className="btn text-white rounded mt-2 col-12" style={{ backgroundColor: "rgb(9, 72, 130)" }} onClick={() => postQuickMessage("Торг возможен?")}>Торг возможен?</Button>
                                    </div>
                                </div>
                                : <></>
                            }
                            <hr />
                            {location != null ?
                                <div className="col-xl-12">
                                    <p>Местоположение</p>
                                    {map1}
                                </div>
                                : <></>
                            }
                        </div>
                    </div>
                    <div className="col-xl-8 border rounded mt-3 py-3 mb-5">
                        <label style={{ fontSize: 15 }}><b>Комментарии</b></label>
                        {
                            token != null ?
                                <>
                                    {
                                        productDetails.can_comment == "all" ?
                                            <div className="col-xl-12">
                                                {
                                                    productDetails.comments?.length
                                                        ? <CommentList comments={productDetails.comments} />
                                                        : <>Нет комментариев</>
                                                }
                                                <Comment
                                                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                                                    content={
                                                        <>
                                                            <Form.Item>
                                                                <TextArea rows={4}
                                                                    onChange={(e) => { setValue(e.target.value) }} value={value} />
                                                            </Form.Item>
                                                            <Form.Item>
                                                                {!comment ?
                                                                    <Button className="rounded-pill" htmlType="submit" loading={submitting} onClick={onSubmit} style={{ backgroundColor: "#184d9f", color: "#fff" }}>
                                                                        Добавить комментарий
                                                                    </Button>
                                                                    :
                                                                    <Button className="rounded-pill" htmlType="submit" loading={submitting} onClick={Answer} style={{ backgroundColor: "#184d9f", color: "#fff" }}>
                                                                        Ответить на комментарий
                                                                    </Button>
                                                                }
                                                            </Form.Item>
                                                        </>
                                                    }
                                                />
                                            </div>
                                            :
                                            <></>
                                    }
                                </>
                                :
                                <>
                                    <div className="col-xl-12 py-2">
                                        {
                                            productDetails.comments?.length
                                                ? <CommentList comments={productDetails.comments} />
                                                : <>Нет комментариев</>
                                        }
                                        <hr />
                                        <label style={{ fontSize: 14 }}>Чтобы оставить комментарий нужно авторизоваться</label>
                                        <br />
                                        <Button style={{ borderColor: "#184d9f", color: "#184d9f" }}><a href="/login">Войти</a></Button>
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </>
                :
                <div>
                    <center className="py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </center>
                </div>

            }
            <Modal
                className="rounded"
                title="ПОЖАЛОВАТЬСЯ"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={null}
                width={580}
            >
                <label style={{ fontSize: 17, fontWeight: "normal" }}>Причина жалобы:</label>
                <Select size={"large"} onChange={handleChange} style={{ width: "100%" }}>
                    {childrens?.length ?
                        <>
                            {childrens.map((item) =>
                                <>
                                    <option value={item.id}>{item.name}</option>
                                </>
                            )}
                        </>
                        : <></>
                    }
                </Select>
                <TextArea className="rounded mt-3" rows={4} placeholder="Напишите, что вам не понравилось в данном объявлении" onChange={(e) => setComplaintsText(e.target.value)} />
                <hr />
                <div className="text-right">
                    <button className="btn btn-outline-light border text-dark mr-2" onClick={handleCancel}>Закрыть</button>
                    <button className="btn text-white" style={{ backgroundColor: "#184d9f" }} onClick={PostComplaint}>Пожаловаться</button>
                </div>
            </Modal>
            <div className="fixed-bottom d-block d-md-none">
                <div className="row">
                    <button className="btn col-6 text-white" style={{ backgroundColor: "rgb(9, 72, 130)" }} data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1"><i className="fas fa-phone-volume"></i> Позвонить</button>
                    <button className="btn col-6 text-white" style={{ backgroundColor: "rgb(9, 72, 130)" }} data-toggle="collapse" href="#multiCollapseExample2" role="button" aria-expanded="false" aria-controls="multiCollapseExample1"><i className="fa-solid fa-envelope"></i> Написать</button>
                    <div className="col-12">
                        <div className="collapse multi-collapse" id="multiCollapseExample1">
                            <div className="card card-body bg-white">
                                {phones != null && phones.length > 12 ?
                                    <>
                                        {phones.split(",").map((item) =>
                                            <a href={"tel:" + item}>{item}</a>
                                        )
                                        }
                                    </>
                                    :
                                    <>
                                        <a href={"tel:" + phones}>{phones}</a>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="collapse multi-collapse" id="multiCollapseExample2">
                            {token ?
                                <div className="col-xl-12 bg-white border rounded p-2">
                                    <div className="col-xl-12 text-center" style={{ backgroundColor: "rgb(9, 72, 130)" }}>
                                        <label className="p-2 rounded text-white">Написать сообщение к {productDetails.user.name}</label>
                                    </div>
                                    <div className="col-xl-12 mt-2 px-0">
                                        <textarea rows="10" className="form-control" value={messag} onChange={(e) => { setMessage(e.target.value) }}></textarea>
                                        <Button loading={loadings} className="btn btn-outline-primary rounded col-12 mt-2" onClick={postMessage}>Отправить</Button>
                                        <Button className="btn text-white rounded mt-2 col-12" style={{ backgroundColor: "rgb(9, 72, 130)" }} onClick={() => postQuickMessage("Еще актуально?")}>Еще актуально?</Button>
                                        <Button className="btn text-white rounded mt-2 col-12" style={{ backgroundColor: "rgb(9, 72, 130)" }} onClick={() => postQuickMessage("Обмен интересует?")}>Обмен интересует?</Button>
                                        <Button className="btn text-white rounded mt-2 col-12" style={{ backgroundColor: "rgb(9, 72, 130)" }} onClick={() => postQuickMessage("Торг возможен?")}>Торг возможен?</Button>
                                    </div>
                                </div>
                                : <div className="bg-white">Авторизуйтесь сначала чтобы написать</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ad;