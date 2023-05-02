import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import '../../dist/css/custom_card.css';
import { setProductDetails } from "../../redux/actions/product_actions";
import { AppImage } from "../custom_components";
import { Button, notification, Avatar, message } from "antd";
import { removeFromFavorites } from "../../api/product";
import moment from 'moment';
import { UserOutlined } from '@ant-design/icons';
const key = "updateable";
const ProductItem = ({ product }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const navigateToProductDetailsPage = (product) => {
        dispatch(setProductDetails(product));
        history.push(`products/${product.id}`);
    };
    const baseStyle = { height: 'auto' };
    if (typeof product.features === 'object' && !Array.isArray(product.features)) {
        if (product.features.color !== null) {
            baseStyle.background = product.features.color;
        }
    }
    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };
    const removeFav = async () => {
        const addToFav = await removeFromFavorites(product.id);
        message.error({ content: 'Удалено из избранного!', key, duration: 2 });
        window.location.href = "/favorites";
    }
    var time = moment(product.created_at, 'YYYYMMDD, h:mm:ss a');
    moment.locale('ru');
    var update = time.calendar();
    const image = product.has_media
        ? product.media[0].original_url
        : '';
    return (
        <div className="col-md-12 shadow-sm" style={{ ...baseStyle }}>
            <div className="row">
                <div className="col-md-12 px-0" style={{ height: 150 }}>
                    <AppImage height={150} width="100%" src={image} classNameName="card-img-top rounded" style={{ objectFit: "cover" }} />
                    {product.is_vip ?
                        <div style={{ position: "absolute", left: "30px", top: "10px", }}><span className="badge badge-danger p-2">VIP</span></div>
                        : <></>}
                </div>
            </div>
            <div className="card-body">
                <div className="row">
                    <label style={{ fontSize: 17 }} className="card-title px-0 col-md-12 py-0 label">{product.price + " " + product.currency_symbol}</label>
                    <p style={{ fontSize: 15, fontFamily: "sans-serif", whiteSpace: "nowrap", color: "rgb(9, 72, 130)" }} className="card-title px-0 py-0 col-md-12">{product.title}</p>
                </div>
                <div className="row px-0 d-flex justify-content-between">
                    <Avatar size="small" icon={<UserOutlined />} />
                    <label className="text-muted label" style={{ fontSize: 11 }}>
                        <i className="far fa-clock"></i> {update}<br />
                        <i className="far fa-eye"></i>  {product.views}
                    </label>
                </div>
                <i className="fa-solid fa-heart text-danger"></i> <a style={{ fontSize: 15, color: "rgb(9, 72, 130)" }} className="mt-2" onClick={removeFav}>Удалить из избранного</a>
            </div>
        </div>
    );
};

export default ProductItem;