import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import '../../dist/css/custom_card.css';
import { setProductDetails } from "../../redux/actions/product_actions";
import { AppImage } from "../custom_components";
import { Avatar, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import AliceCarousel from 'react-alice-carousel';

const ProductItem = ({ product }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const navigateToProductDetailsPage = (product) => {
        dispatch(setProductDetails(product));
        history.push(`/products/${product.id}`);
    };

    const baseStyle = { height: 'auto' };

    if (typeof product.features === 'object' && !Array.isArray(product.features)) {
        if (product.features.color !== null) {
            baseStyle.background = product.features.color;
        }
    }

    var time = moment(product.created_at, 'YYYYMMDD, H:mm:ss', 'Asia/Bishkek');
    moment.locale('ru');

    var update = time.fromNow();

    return (
        <div className="col-md-12" style={{ ...baseStyle, 
        borderRadius: "10px", 
        border : "1px solid #dee2e6", 
        borderColor : product.is_vip ? <>{"#FF0707"}</> : <>{product.is_urgent ? "#ffc107" : "#dee2e6"}</>}}>
            <div className="row">
                <div className="col-md-12 p-2" style={{ height: 180 }}>
                    {product.media?.length > 0 ?
                        <>
                            {
                                <AliceCarousel
                                    mouseTracking
                                    items={product.media.map((item) =>
                                        <div
                                            style={{
                                                backgroundImage: "url(" + item.original_url + ")",
                                                height: 170,
                                                width: "100%",
                                                backgroundSize: "cover",
                                                borderRadius: "10px"
                                            }}
                                        />
                                    )}
                                    ArrowLeft={false}
                                    ArrowRight={false}
                                    disableButtonsControls
                                    // disableDotsControls
                                    responsive={{
                                        0: {
                                            items: 1,
                                        },
                                        1024: {
                                            items: 1
                                        },
                                        1280: {
                                            items: 1
                                        },
                                        1920: {
                                            items: 1
                                        }
                                    }}
                                />
                            }
                        </>
                        :
                        <>
                            <Image
                                width={"100%"}
                                height={170}
                                src="error"
                                fallback="data:image/png;base64,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"
                            />
                        </>
                    }
                    {product.is_vip && product.is_urgent ?
                        <>
                            <div style={{ position: "absolute", left: "10px", top: "10px", }}><span className="badge badge-danger p-1"><i className="fa-solid fa-crown"></i> VIP</span></div>
                            <div style={{ position: "absolute", left: "57px", top: "10px", }}><span className="badge badge-warning p-1"><i className="fa-solid fa-bolt"></i> Срочно</span></div>
                        </>
                        : <></>}
                    {product.is_urgent && product.is_vip == false ?
                        <div style={{ position: "absolute", left: "10px", top: "10px", }}><span className="badge badge-warning p-1"><i className="fa-solid fa-bolt"></i> Срочно</span></div>
                        : <></>}
                    {product.is_vip && product.is_urgent == false ?
                        <div style={{ position: "absolute", left: "10px", top: "10px", }}><span className="badge badge-danger p-1"><i className="fa-solid fa-crown"></i> VIP</span></div>
                        : <></>}
                </div>
            </div>
            <a onClick={() => navigateToProductDetailsPage(product)}>
                <div className="card-body px-2 px-md-3">
                    <div className="row">
                        <label style={{ fontSize: 16, fontWeight: "450" }} className="card-title px-0 col-md-12 py-0">{product.price + " " + product.currency_symbol}</label>
                        <label
                            style={{
                                fontSize: 14,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                columnWidth: "10px",
                                color: "rgb(9, 72, 130)",
                                fontWeight: '420'
                            }}
                            className="px-0 py-0 col-md-12"
                        >
                            {product.title}
                        </label>
                        <p
                            className="card-text text-secondary"
                            style={{
                                display: "-webkit-box",
                                fontSize: 13,
                                WebkitLineClamp: "1",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden"
                            }}
                        >
                            {product.description}
                        </p>
                    </div>
                    <div className="row">
                        <div className="col-3 mt-3 px-0">
                            {product.user?.media?.length ?
                                <>
                                    {product.user.business_account != null ?
                                        <>
                                            <div className='rounded-circle p-0'
                                                style={{
                                                    backgroundImage: 'url(' + product.user.business_account.logoImage + ')',
                                                    width: "30px",
                                                    height: "30px",
                                                    backgroundSize: "cover"
                                                }}>
                                                <span className='badge badge-danger mt-4 ml-3' style={{ fontSize: 10 }}>pro</span>
                                            </div>
                                        </>
                                        :
                                        <img className="mb-3" src={product.user.media[0].original_url} style={{ borderRadius: "50%", width: "30px", height: "30px" }} />
                                    }
                                </>
                                :
                                <Avatar size={42} icon={<UserOutlined />} />
                            }
                        </div>
                        <div className="col-9 mt-3 px-0 text-right" style={{ fontSize: 11, color: "rgb(9, 72, 130)" }}>
                            <i className="fa-solid fa-calendar-days text-danger"></i> {update}<br />
                            {/* <img src={views} width="18" height="18" /> {product.views}<br/> */}
                            <label className="text-dark label" style={{ fontSize: 11 }}>
                                {/* <i className="far fa-clock text-info"></i> {update}<br /> */}
                                <i className="far fa-eye"></i>  {product.views}
                            </label>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
};
export default ProductItem;