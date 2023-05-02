import React from "react";
import Navbar from "../components/navbar";
import logo from "../../src/img/logo.png";
import Footer from "../components/footer";

class About extends React.Component {
    render() {
        return (
            <div>
                <Navbar />
                <div className="col-md-12 p-4">
                    <div className="row">
                        <div className="col-md-12 bg-light text-center border rounded p-3">
                            <div className="col-12 d-flex justify-content-center py-4">
                                <div className="col-4">
                                    <img src={logo} width="100%" />
                                </div>
                            </div>
                            <div className="col-12 py-4">
                                <label style={{ fontSize: 28 }}>О нас</label>
                                <p>
                                    «Рек-ПАРК» - электронная версия популярной рекламно-информационной газеты «Ош-ПАРК»,  это отечественный онлайн сервис по продаже новых и вторичных товаров различных категорий, предоставление услуг во сферах жизни, незаменимый помощник для ведения бизнеса. Наша команда постаралась сделать сайт максимально удобным и продуктивным для пользователей, а также готовы развивать ее вместе с ваши пожеланиями.
                                    На сайте имеется отдельная категория для владельцев компаний, где вы с сможете развивать свой бизнес вместе с нами. Оформите на сайте онлайн магазин или офис, получите расширенный доступ к инструментам продвижении вашей страницы и новых клиентов.
                                    Интересные статьи про нашу Родину, афиша, фотогалерея и много познавательного.
                                    Если у вас имеются замечания или пожелания по сайту непременно обращайтесь, будем рады каждому вашему отзыву, ведь мы хотим сделать удобным для наших соотечественников!
                                </p>
                            </div>
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default About;