import React from "react";

const Footer= ()=>{
    return(
        <footer className="footer-14398 col-xl-12">
      
        <div className="container">
          <div className="row mb-5">
            <div className="col-md-3">
              <a href="/" className="footer-site-logo">РЕКПАРК</a>
              <p>Сайт объявлений Кыргызстана</p>
            </div>
            <div className="col-md-2 ml-auto">
              <a className="text-white" href="#">Для бизнеса</a>
              {/* <ul className="list-unstyled links">
                <li><a href="/category/6">Квартиры</a></li>
                <li><a href="#">Коммерческое помещение</a></li>
                <li><a href="#">Дома и дача</a></li>
                <li><a href="#">Частные сектора</a></li>
                <li><a href="#">Земельные участки</a></li>
              </ul> */}
            </div>
            <div className="col-md-2 ml-auto">
              <a className="text-white" href="#">О проекте</a>
              {/* <ul className="list-unstyled links">
                <li><a href="#">Легковые</a></li>
                <li><a href="#">Спец.Техника</a></li>
                <li><a href="#">Мотоциклы</a></li>
                <li><a href="#">Запчасти</a></li>
                <li><a href="#"></a></li>
              </ul> */}
            </div>
            <div className="col-md-2 ml-auto">
              <a className="text-white" href="#">Помощь</a>
              {/* <ul className="list-unstyled links">
                <li><a href="#">О проекте</a></li>
                <li><a href="#">Обратная связь</a></li>
                <li><a href="#">Пользовательское соглашение</a></li>
                <li><a href="#">Помощь</a></li>
                <li><a href="#">Для бизнеса</a></li>
              </ul> */}
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12 pb-4">
              <div className="line"></div>
            </div>
            <div className="col-md-6 text-md-left">
              <ul className="list-unstyled link-menu nav-left">
                <li><a href="/agreement">Пользовательское соглашение</a></li>
                <li><a href="/about">О сайте</a></li>
                <li><a href="/">Объявления</a></li>
              </ul>
            </div>
            <div className="col-md-6 text-md-right">
              <ul className="list-unstyled social nav-right">
                <li><a href="#"><span className="icon-twitter"></span></a></li>
                <li><a href="#"><span className="icon-instagram"></span></a></li>
                <li><a href="#"><span className="icon-facebook"></span></a></li>
                <li><a href="#"><span className="icon-pinterest"></span></a></li>
              </ul>
            </div>
          </div>

          <div className="row">
            <div className="col-md-7">
              <p><small>Все права защищены</small></p>
            </div>
          </div>
        </div>
    </footer>
    );
}
export default Footer;