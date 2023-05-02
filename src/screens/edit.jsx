import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../api";
import { useHistory } from "react-router-dom";
import {
  Form,
  notification
} from "antd";
import ProductFields from "../components/product/product_fields";
import { setUser } from "../redux/actions/user_actions";
import { setProductDetails } from "../redux/actions/product_actions";

const EditAd = ({ match }) => {

  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [location, setLocation] = useState(null);
  const [form] = Form.useForm();
  const [product, setProduct] = useState();
  const fetchProductDetails = async () => {
    const productDetails = await api.fetchProduct(match.params.id, {
      'with': 'category;customAttributeValues.customAttribute'
    });
    if (productDetails != null) {
      dispatch(setProductDetails(productDetails));
      setFields(productDetails);
      setProduct(productDetails);
      setLocation(JSON.parse(productDetails.location));
    }
    setReady(true);
  };
  if (ready == true) {
    var DG = require('2gis-maps');
    var marker;
    var map = null;
    //2gis map
    DG.then(function () {
      map = DG.map('map', {
        'center': [location.latitude, location.longitude],
        'zoom': 13
      });
      marker = DG.marker([location.latitude, location.longitude], {
        draggable: true
      }).addTo(map);
      marker.on('drag', function (e) {
        var lat = e.target._latlng.lat.toFixed(3);
        var lng = e.target._latlng.lng.toFixed(3);
        setLocation({ latitude: lat, longitude: lng });
      });
    });
  }
  const fetchUserDetails = async () => {
    const userDetails = await api.userDetails();
    if (userDetails != null) {
      dispatch(setUser(userDetails));
    }
  };
  console.log("location", location);
  console.log("productDetails", product);
  useEffect(() => {
    fetchUserDetails();
    fetchProductDetails();
  }, []);

  const setFields = (productDetails) => {
    if (productDetails != null) {
      const data = {
        category_id: productDetails.category_id,
        title: productDetails.title,
        description: productDetails.description,
        price: productDetails.price,
        region_id: productDetails.region_id,
        currency_id: productDetails.currency_id,
        city_id: productDetails.city_id,
        district: productDetails.district,
        can_comment: productDetails.can_comment,
        phones: productDetails.phones
      };
      if (productDetails.has_custom_attribute_values) {
        productDetails.custom_attribute_values.forEach((item) => {
          data[item.custom_attribute.name] = item.value;
        });
        form.setFieldsValue(data);
      }
      console.log('data', data);
      form.setFieldsValue({
        ...data,
      });
    }
  };

  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };
  document.title = "Редактирование";
  return (
    <div>
      <Navbar />
      <div className="col-12 mt-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a style={{ color: "rgb(9, 72, 130)" }} href="/"><i className="fa-solid fa-house"></i> Главная страница</a></li>
            <li className="breadcrumb-item active" aria-current="page">Редактирование объявления</li>
          </ol>
        </nav>
      </div>
      <div className="col-md-8 py-5">
        <center className="pb-4">
          <label style={{ fontSize: 25 }}>Редактировать объявление</label>
          <p>Поля, обозначенные <span className="text-danger">*</span>  - обязательные. После создания объявления Вы можете редактировать и удалять его в Личном кабинете.</p>
        </center>
        {ready ? <ProductFields
          form={form}
          loading={loading}
          onSend={async (model) => {
            const valid = await form.validateFields();
            if (valid) {
              const formData = new FormData();
              formData.append('currency_id', model.currency_id);
              formData.append('location', JSON.stringify(location));
              model.files.forEach(file => {
                formData.append('images[]', file);
              });
              for (const [key, value] of Object.entries(form.getFieldsValue())) {
                formData.append(`${key}`, value);
              }
              setLoading(true);
              console.log('formdata', formData);
              const response = await api.updateProduct(match.params.id, formData);
              if (response != null && response.success) {
                openNotification('success', 'Изменения сохранены!', null);
                history.push(`/profile/`);
              } else {
                openNotification('error', 'Не удалось сохранить!', null);
              }
              setLoading(false);
            }
          }}
        /> : <></>}
      </div>
    </div>
  );
}

export default EditAd;