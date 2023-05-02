import top from './img/topbanner.png';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import React, { useEffect } from 'react';
import Ad from './screens/ad';
import Main from './screens/main';
import Login from './screens/login';
import CreateAd from './screens/create';
import EditAd from './screens/edit';
import Profile from './screens/profile';
import Ads from './screens/ads';
import Category from './screens/category';
import About from './screens/about';
import Articles from './screens/articles';
import Article from './screens/article';
import Contacts from './screens/contacts';
import Register from './screens/register';
import 'react-gallery-carousel/dist/index.css';
import Settings from './screens/userSettings';
import 'antd/dist/antd.css';
import Wallets from './screens/wallets';
import ForgotPassword from './screens/forgot_password';
import SearchResult from './screens/search_result';
import Favorites from './screens/favorites';
import Footer from './components/footer';
import UserAds from './screens/user_ads';
import Chats from './screens/chats';
import BusinessProfile from './screens/bussiness_profile_page';
import BusinessSettings from './screens/bussiness_settings';
import { subscribeToPusher } from './helpers/pusher';
import { userDetails } from './api';
import CategoryArticles from './screens/category_article';
import SetBusinessProfile from './screens/bussiness';
import BusinessPlan from './screens/bussiness_plan';
import ChatUser from './screens/chat';
import './blog.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import 'react-alice-carousel/lib/alice-carousel.css';
import "./App.css";
import 'moment/locale/ru';
import Gallery from './screens/photo_gallery';
import Agreement from './screens/agreement';
import Complete from './screens/complete';

const App = ({ match }) => {
  const subscribe = async () => {
    const user = await userDetails();
    if (localStorage.getItem('token')) {
      subscribeToPusher(user.id);
    }
  }
  useEffect(() => {
    subscribe();
  }, []);

  return (
    // url('https://www.house.kg/build/images/banners/branding-left-imarat-20-may.e320d43f.png')
    // url('https://www.house.kg/build/images/banners/branding-left-imarat-20-may.e320d43f.png')
    <div className="container-fluid">
      <div className="row">
        <div className="col-1-5 px-0 d-none d-lg-block text-white text-center"
          style={{
            backgroundSize: "auto", backgroundPosition: "right top",
            backgroundImage: "",
            backgroundRepeat: "no-repeat"
          }}>
        </div>
        <div className="col-lg-9 px-0" style={{ backgroundColor: '#fff', minHeight: "500px" }}>
          <div className="col-lg-12 bg-success px-0 text-white text-center">
            <img src={top} width="100%" />
          </div>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/products/create" component={CreateAd} />
              <Route path="/products/:id/edit" component={EditAd} />
              <Route path="/products/:id" component={Ad} />
              <Route path="/products" component={Ads} />
              <Route path="/products/create" component={CreateAd} />
              <Route path="/register" component={Register} />
              <Route path="/profile" component={Profile} />
              <Route path="/favorites" component={Favorites} />
              <Route path="/category/:id" component={Category} />
              <Route path="/about_us" component={About} />
              <Route path="/contacts" component={Contacts} />
              <Route path="/login" component={Login} />
              <Route path="/settings" component={Settings} />
              <Route path="/forgot_password" component={ForgotPassword} />
              <Route path="/wallets" component={Wallets} />
              <Route path="/complete" component={Complete} />
              <Route path="/articles" component={Articles} />
              <Route path="/articles_categories/:id" component={CategoryArticles} />
              <Route path="/article/:id" component={Article} />
              <Route path="/search_result/:search" component={SearchResult} />
              <Route path={"/userAds/:id"} component={UserAds} />
              <Route path={"/chats"} component={Chats} />
              <Route path={"/chat/:id?/:ad_id"} component={ChatUser} />
              <Route path="/business-profile" component={BusinessProfile} />
              <Route path="/business-settings" component={BusinessSettings} />
              <Route path="/business" component={SetBusinessProfile} />
              <Route path={"/business-plan/:id/:period"} component={BusinessPlan} />
              <Route path={"/about"} component={About} />
              <Route path={"/gallery"} component={Gallery} />
              <Route path={'/agreement'} component={Agreement} />
            </Switch>
          </BrowserRouter>
        </div>
        <div className="col-1-5 px-0 d-none d-lg-block text-white text-center"
          style={{
            backgroundSize: "auto",
            backgroundImage: "",
            backgroundRepeat: "no-repeat"
          }}>
        </div>
        <Footer />
      </div>
    </div>
  );
}
export default App;
