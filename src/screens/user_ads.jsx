import { Avatar, Button, Carousel, Image } from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { fetchUsersProducts } from '../api/product';
import Navbar from '../components/navbar';
import ProductItem from "../components/product/product_item";
import moment from 'moment';
import { useDispatch } from 'react-redux';
const UserAds = ({ match }) => {
    const [product, setProducts] = useState()
    const [user, setUser] = useState();
    const [socials, setSocials] = useState(null);
    const [phones, setPhones] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [location, setLocation] = useState(null);
    const [photoGallery, setPhotoGallery] = useState(null);
    const [visible, setVisible] = useState(false);
    const fetchProducts = async () => {
        const _products = await fetchUsersProducts({
            'search': 'user_id:' + match.params.id,
            'searchFields': 'user_id:=',
            'with': 'user'
        });
        if (_products != null) {
            setProducts(_products);
            console.log("product", _products[0]);
            if (_products[0].user.business_account != null) {
                var str = _products[0].user.business_account.socials;
                setSocials(JSON.parse(str));
                var phone = _products[0].user.business_account.phones;
                setPhones(JSON.parse(phone));
                var schedules = _products[0].user.business_account.schedule;
                setSchedule(JSON.parse(schedules));
                var position = _products[0].user.business_account.location;
                setLocation(JSON.parse(position));
                var gallery = _products[0].user.business_account.photogallery;
                setPhotoGallery(gallery);
            }
        }
    }
    if (photoGallery != null) {
        console.log("photos", photoGallery);
    }
    if (location != null) {
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
    useEffect(() => {
        fetchProducts();
    }, [])
    return (
        <div>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12 mt-3">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item" ><a style={{ color: "rgb(9, 72, 130)" }} href="/"><i className="fa-solid fa-house"></i> Главная страница</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Объявления пользователя</li>
                            </ol>
                        </nav>
                        <div className="row mt-4 px-2">
                            <div className='col-xl-12 border rounded py-3'>
                                {product != null || product != undefined ?
                                    <>
                                        <div className="col-xl-6">
                                            <div className='row'>
                                                <div className='col-1'>
                                                    {product[0].user.business_account != null ?
                                                        <>
                                                            {product[0].user.image == null ?
                                                                <Avatar size={100} icon={<UserOutlined />} />
                                                                :
                                                                <div className='rounded-circle'
                                                                    style={{
                                                                        backgroundImage: 'url(' + product[0].user.business_account.logoImage + ')',
                                                                        width: "50px",
                                                                        height: "50px",
                                                                        backgroundSize: "cover"
                                                                    }}>
                                                                    <span className='badge badge-danger mt-4 ml-4'>pro</span>
                                                                </div>
                                                            }
                                                        </>
                                                        :
                                                        <>
                                                            {product[0].user.image == null ?
                                                                <Avatar size={100} icon={<UserOutlined />} />
                                                                : <img src={product[0].user.image} className="rounded-circle" width='50' height='50' />
                                                            }
                                                        </>
                                                    }
                                                </div>
                                                <div className='col-9 ml-1 px-4'>
                                                    <label className='ml-2 text-muted'>
                                                        <span className='text-dark'>
                                                            {product[0].user.business_account != null ?
                                                                <>
                                                                    {product[0].user.business_account.name}
                                                                </>
                                                                :
                                                                <>
                                                                    {product[0].user.name}
                                                                </>
                                                            }
                                                        </span><br />
                                                        Аккаунт создан {moment(product[0].user.created_at, "YYYYMMDD").fromNow()}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-6'>

                                        </div>
                                    </> : <></>
                                }
                            </div>

                            {product != null || product != undefined ?
                                <>
                                    {
                                        product[0].user.business_account != null ?
                                            <div className='col-12'>
                                                <div className='row'>
                                                    <div className='col-xl-4 border rounded my-3 py-3'>
                                                        <div className='row'>
                                                            <div className='col-12 mb-2'>
                                                                <span className='badge badge-primary'>Бизнес профиль</span>
                                                            </div>
                                                            <div className='col-12 mb-2'>
                                                                <i className="fa-solid fa-location-dot text-secondary"></i>
                                                                <span className='text-secondary'> Адрес: </span>
                                                                {
                                                                    product[0].user.business_account.address
                                                                }
                                                            </div>
                                                            <div className='col-12 mb-2'>
                                                                <i className="fa-solid fa-envelope text-secondary"></i>
                                                                <span className='text-secondary'> Почта: </span>
                                                                <a href={'mailto:' + product[0].user.business_account.email}>
                                                                    {
                                                                        product[0].user.business_account.email
                                                                    }
                                                                </a>
                                                            </div>
                                                            <div className='col-12 mb-2'>
                                                                <i className="fa-solid fa-phone text-secondary"></i>
                                                                <span className='text-secondary'> Телефоны: </span>
                                                                <br />
                                                                {phones != null ?
                                                                    <>
                                                                        {phones.map((item) =>
                                                                            <>
                                                                                <a href={'tel:' + item}>
                                                                                    {
                                                                                        item
                                                                                    }
                                                                                </a>
                                                                                <br />
                                                                            </>
                                                                        )}
                                                                    </>
                                                                    : <></>
                                                                }
                                                            </div>
                                                            <div className='col-12 mb-2'>
                                                                <i className="fa-brands fa-whatsapp text-secondary"></i>
                                                                <span className='text-secondary'> Whats App: </span>
                                                                <a href={'https://wa.me/' + product[0].user.business_account.whatsapp}>
                                                                    {
                                                                        product[0].user.business_account.whatsapp
                                                                    }
                                                                </a>
                                                            </div>
                                                            <div className='col-12 mb-2'>
                                                                <i className="fa-solid fa-link text-secondary"></i>
                                                                <span className='text-secondary'> Сайт: </span>
                                                                <a href={product[0].user.business_account.site}>
                                                                    {
                                                                        product[0].user.business_account.site
                                                                    }
                                                                </a>
                                                            </div>
                                                            <div className='col-12 mb-2'>
                                                                <i className="fa-brands fa-instagram text-sceondary"></i>
                                                                <span className='text-secondary'> Instagram: </span>
                                                                {socials != null ?
                                                                    <a href={socials.instagram}>
                                                                        {
                                                                            socials.instagram
                                                                        }
                                                                    </a>
                                                                    : <></>
                                                                }
                                                            </div>
                                                            <div className='col-12 mb-2'>
                                                                <i className="fa-brands fa-facebook text-secondary"></i>
                                                                <span className='text-secondary'> Facebook: </span>
                                                                {socials != null ?
                                                                    <a href={socials.facebook}>
                                                                        {
                                                                            socials.facebook
                                                                        }
                                                                    </a>
                                                                    : <></>
                                                                }
                                                            </div>
                                                            <div className='col-12 mb-2'>
                                                                <i className="fa-brands fa-telegram text-secondary"></i>
                                                                <span className='text-secondary'> Telegram: </span>
                                                                {socials != null ?
                                                                    <a href={socials.telegram}>
                                                                        {
                                                                            socials.telegram
                                                                        }
                                                                    </a>
                                                                    : <></>
                                                                }
                                                            </div>
                                                            <div className='col-12 mb-2'>
                                                                <i className="fa-solid fa-calendar-days text-secondary"></i>
                                                                <span className='text-secondary'> Время работы: </span>
                                                                <br />

                                                                {schedule != null ?
                                                                    <>
                                                                        {schedule.monday != null && schedule.monday.selected != false ?
                                                                            <>
                                                                                Пн : {schedule.monday.startTime} - {schedule.monday.endTime} <br />
                                                                            </>
                                                                            : <>Пн : Закрыто<br /></>
                                                                        }
                                                                        {schedule.tuesday != null && schedule.tuesday.selected != false ?
                                                                            <>
                                                                                Вт : {schedule.tuesday.startTime} - {schedule.tuesday.endTime} <br />
                                                                            </>
                                                                            : <>Вт : Закрыто<br /></>
                                                                        }
                                                                        {schedule.wednesday != null && schedule.wednesday.selected != false ?
                                                                            <>
                                                                                Ср : {schedule.wednesday.startTime} - {schedule.wednesday.endTime} <br />
                                                                            </>
                                                                            : <>Ср : Закрыто<br /></>
                                                                        }
                                                                        {schedule.thursday != null && schedule.thursday.selected != false ?
                                                                            <>
                                                                                Чт : {schedule.thursday.startTime} - {schedule.thursday.endTime} <br />
                                                                            </>
                                                                            : <>Чт : Закрыто<br /></>
                                                                        }
                                                                        {schedule.friday != null && schedule.friday.selected != false ?
                                                                            <>
                                                                                Пт : {schedule.friday.startTime} - {schedule.friday.endTime} <br />
                                                                            </>
                                                                            : <>Пт : Закрыто<br /></>
                                                                        }
                                                                        {schedule.saturday != null && schedule.saturday.selected != false ?
                                                                            <>
                                                                                Сб : {schedule.saturday.startTime} - {schedule.saturday.endTime} <br />
                                                                            </>
                                                                            : <>Сб : Закрыто<br /></>
                                                                        }
                                                                        {schedule.sunday != null && schedule.sunday.selected != false ?
                                                                            <>
                                                                                Вс : {schedule.sunday.startTime} - {schedule.sunday.endTime} <br />
                                                                            </>
                                                                            : <>Вс : Закрыто<br /></>
                                                                        }
                                                                    </>
                                                                    : <> </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {product[0].user.business_account.coverImage != null & product[0].user.business_account.coverImage != undefined ?
                                                        <div className='col-xl-8 my-3'>
                                                            <img src={product[0].user.business_account.coverImage} width="100%" />
                                                        </div>
                                                        : <></>
                                                    }
                                                    {location != null ?
                                                        <div className='col-xl-12 p-3'>
                                                            <h4 className='text-muted' style={{ fontSize: "20px" }}>Местоположение</h4>
                                                            <hr />
                                                            <div id="map" style={{ width: "100%", height: "500px" }}></div>
                                                        </div>
                                                        : <></>
                                                    }
                                                    {photoGallery != null && photoGallery?.length > 0 ?
                                                        <div className='col-xl-12'>
                                                            {
                                                                photoGallery != null ?
                                                                    <div className="col-12 text-center py-4 mb-5">
                                                                        <h4 className="text-left text-muted" style={{ fontSize: "20px" }}>Галерея</h4>
                                                                        <hr />
                                                                        <div className="row">
                                                                            {photoGallery.map((item) =>
                                                                                <div className="col-6 col-lg-3 mt-2">
                                                                                    <div className="col-12 py-3 border rounded">
                                                                                        <Image
                                                                                            preview={{
                                                                                                visible: false,
                                                                                            }}
                                                                                            width={"100%"}
                                                                                            src={item.cover}
                                                                                            onClick={() => setVisible(true)}
                                                                                        />
                                                                                        <div
                                                                                            style={{
                                                                                                display: 'none',
                                                                                            }}
                                                                                        >
                                                                                            <Image.PreviewGroup
                                                                                                preview={{
                                                                                                    visible,
                                                                                                    onVisibleChange: (vis) => setVisible(vis),
                                                                                                }}
                                                                                            >
                                                                                                {
                                                                                                    item.media.length > 0 ?
                                                                                                        <>
                                                                                                            {item.media.map((i) =>
                                                                                                                <Image src={i.original_url} />
                                                                                                            )
                                                                                                            }
                                                                                                        </>
                                                                                                        : <></>
                                                                                                }
                                                                                                {/* <Image src={item.media[0].original_url} /> */}
                                                                                            </Image.PreviewGroup>
                                                                                        </div>
                                                                                        <p className="py-1 text-left" style={{ fontSize: "15px" }}>Название галереи: {item.title}</p>
                                                                                        <p className="text-muted text-left" style={{ fontSize: "12px" }}>{moment(item.media[0].created_at, 'YYYYMMDD, H:mm:ss', 'Asia/Bishkek').fromNow()}</p>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <div className="col-12 text-center py-3">
                                                                        <div className="spinner-border text-primary" role="status">
                                                                            <span className="sr-only">Loading...</span>
                                                                        </div>
                                                                    </div>
                                                            }
                                                        </div>
                                                        : <></>
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <>
                                            </>
                                    }
                                </> : <></>
                            }



                            <div className='col-xl-12 border rounded py-3 mt-4'>
                                <h4 className='' style={{ fontSize: 20 }}>Объявления</h4>
                                <div style={{ 'width': '120px', 'height': '3px', 'backgroundColor': 'rgb(9, 72, 130)' }}></div>
                                <div className='row'>
                                    {product != null && product != undefined ?
                                        product.map((item) => (
                                            <div className="col-xs-12 col-sm-6 col-xl-3 mt-3">
                                                <ProductItem product={item} />
                                            </div>
                                        ))
                                        :
                                        <div className='col-12 text-center py-5'>
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden"></span>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default UserAds;