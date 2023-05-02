import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrencies, setRegions } from "../../redux/actions/main_actions";
import { Form, Button, Input, InputNumber, Modal, Select } from 'antd';
import { CustomAttributeField } from "../custom_components";
import * as api from "../../api";
import { Link, useHistory } from "react-router-dom";
const { Option } = Select;
const SubCategories = ({ category, onSubmit }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();
  const [cities, setCities] = useState([]);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const { currencies, regions } = useSelector((state) => state.main);
  const [districts, setDistricts] = useState([]);
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
  const fetchRegions = async () => {
    const regions = await api.fetchRegions();
    if (regions != null) {
      dispatch(setRegions(regions));
      if (regions.length) {
        if (form.getFieldValue("region_id")) {
          const region = regions.find(o => o.id === form.getFieldValue("region_id"));
          selectRegion(region);
        } else {
          selectRegion(regions[0]);
        }
      }
    }

    const currencies = await api.fetchCurrencies();
    if (currencies != null) {
      dispatch(setCurrencies(currencies));
      if (currencies.length) {
        if (form.getFieldValue("currency_id")) {
          const currency = currencies.find(o => o.id === form.getFieldValue("currency_id"));
          setSelectedCurrencyId(currency.id);
        } else {
          setSelectedCurrencyId(currencies[0].id);
        }
      }
    }
  }
  const selectRegion = (region) => {
    form.setFieldsValue({
      region_id: region.id
    });

    setCities(region.cities);
    if (region.cities != null && region.cities.length) {
      if (form.getFieldValue("city_id")) {
        const city = region.cities.find(o => o.id === form.getFieldValue("city_id"));
      } else {
        selectCity(region.cities[0]);
      }
    }
  }
  const selectCity = (city) => {
    form.setFieldsValue({
      city_id: city.id
    });

    setDistricts(city.districts);
  };
  const onChange = () => {
    if (onSubmit != null) onSubmit(form);
    setVisible(false);
  };
  const showModal = () => {
    setVisible(true);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const newCategory = (category) => {
    history.push(category);
    fetchRegions();
    document.location.reload();
  }
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };
  const [options, setOptions] = useState([]);
  const fetchCategoriesTree = async (category) => {
      category?.children?.map((item) =>
        setOptions(prevState => [...prevState, {
          label: item.name,
          value: item.id
          // options: [
          //   category.children.map((item)=>
          //   {
          //     label: item.name,
          //     value: item.id,
          //   },
          //   )
          // ],
        }])
      )
      console.log('options',options);
  }
  if(options.length == 0){
    fetchCategoriesTree(category);
  }
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    window.location.href = "/category/"+value;
  };
  useEffect(() => {
    fetchRegions();
    fetchCategoriesTree(category);
  }, []);
  return (
    <>
      {category?.children?.length ?
        <>
          <div className="col-md-12 pb-3 d-none d-xl-block">
            <label className="" style={{ fontSize: 18 }}>Поиск</label>
            <div className="mb-3" style={{'width' : '55px', 'height' : '3px', 'backgroundColor' : 'rgb(9, 72, 130)' }}></div>
            <Form
              form={form}
              name="advanced_search"
              className="ant-advanced-search-form"
              onFinish={onFinish}
            >
              <div className="row">
                {category?.custom_attribute != null ?
                  category.custom_attribute.map((item) => (
                    <div className="col-xl-3">
                      <Form.Item
                        key={item.name}
                        label={item.title}
                        name={item.name}
                        rules={[{ required: item.is_required, message: item.placeholder }]}
                      >
                        {CustomAttributeField(item)}
                      </Form.Item>
                    </div>
                  ))
                  : <></>}
                <div className="col-xl-9">
                  <div className="row">
                    <div className="col-xl-4">
                      <Form.Item
                        key={"price_from"}
                        label={"Цена от:"}
                        name={"price_from"}
                        rules={[{ required: "", message: "" }]}
                      >
                        <InputNumber id="price_at" placeholder="Цена от" initialValues={0} className="w-100 mb-2" />
                      </Form.Item>
                    </div>
                    <div className="col-xl-4">
                      <Form.Item
                        key={"price_to"}
                        label={"Цена до:"}
                        name={"price_to"}
                        rules={[{ required: "", message: "" }]}
                      >
                        <InputNumber id="price_to" placeholder="Цена до" initialValues={0} className="w-100 mb-2" />
                      </Form.Item>
                    </div>
                    <div className="col-xl-3">
                      <Form.Item
                        key={"currency_id"}
                        label={"Валюта:"}
                        name={"currency_id"}
                        rules={[{ required: "", message: "" }]}
                      >
                        <Select value={selectedCurrencyId} onChange={(value) => setSelectedCurrencyId(value)} className="select-after">
                          {currencies.map((item) => {
                            return (<Option value={item.id}>{item.symbol}</Option>);
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3">
                  <Form.Item
                    key="region_id"
                    label="Регион"
                    name="region_id"
                  >
                    <Select
                      placeholder="Выберите регион"
                      onChange={(item) => {
                        const region = regions.find(o => o.id === item);
                        selectRegion(region);
                      }}
                    >
                      {regions.map((item) =>
                        (<Option value={item.id}>{item.name}</Option>)
                      )}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-xl-3">
                  <Form.Item
                    key="city_id"
                    label="Город"
                    name="city_id"
                  >
                    <Select
                      placeholder="Выберите город"
                      onChange={(item) => {
                        const city = cities.find(o => o.id === item);
                        selectCity(city);
                      }}
                    >
                      {cities.map((item) =>
                        (<Option value={item.id}>{item.name}</Option>)
                      )}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className="col-xl-12 d-xl-flex justify-content-end">
                <Button className="col-12 col-xl-2" onClick={onChange} style={{ backgroundColor: "#184d9f", color: "#fff" }}>Поиск</Button>
              </div>
            </Form>
          </div>
          <div className="d-block d-xl-none my-4">
            <div className="text-center px-3">
              <button className="btn col-12 rounded" style={{ backgroundColor: "#184d9f", color: "#fff" }} type="primary" onClick={showModal}>
                Поиск по фильтрам
              </button>
            </div>
            <Modal
              title="Поиск по фильтрам"
              visible={visible}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
              footer={null}
            >
              <label className="mb-3" style={{ fontSize: 18 }}>Поиск</label>
              <Form
                form={form}
                name="advanced_search"
                className="ant-advanced-search-form"
                onFinish={onFinish}
              >
                <div className="row">
                  {category?.custom_attribute != null ?
                    category.custom_attribute.map((item) => (
                      <div className="col-xl-4">
                        <Form.Item
                          key={item.name}
                          label={item.title}
                          name={item.name}
                          rules={[{ required: item.is_required, message: item.placeholder }]}
                        >
                          {CustomAttributeField(item)}
                        </Form.Item>
                      </div>
                    ))
                    : <></>}
                  <div className="col-xl-6">
                    <div className="row">
                      <div className="col-xl-6">
                        <Form.Item
                          key={"price_from"}
                          label={"Цена от:"}
                          name={"price_from"}
                          rules={[{ required: "", message: "" }]}
                        >
                          <InputNumber id="price_at" placeholder="Цена от" initialValues={0} className="w-100 mb-2" />
                        </Form.Item>
                      </div>
                      <div className="col-xl-6">
                        <Form.Item
                          key={"price_to"}
                          label={"Цена до:"}
                          name={"price_to"}
                          rules={[{ required: "", message: "" }]}
                        >
                          <InputNumber id="price_to" placeholder="Цена до" initialValues={0} className="w-100 mb-2" />
                        </Form.Item>
                      </div>
                      <div className="col-xl-6">
                        <Form.Item
                          key={"currency_id"}
                          label={"Валюта:"}
                          name={"currency_id"}
                          rules={[{ required: "", message: "" }]}
                        >
                          <Select value={selectedCurrencyId} onChange={(value) => setSelectedCurrencyId(value)} className="select-after">
                            {currencies.map((item) => {
                              return (<Option value={item.id}>{item.symbol}</Option>);
                            })}
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3">
                  <Form.Item
                    key="region_id"
                    label="Регион"
                    name="region_id"
                    rules={[{ required: true, message: 'Выберите регион!' }]}
                  >
                    <Select
                      placeholder="Выберите регион"
                      onChange={(item) => {
                        const region = regions.find(o => o.id === item);
                        selectRegion(region);
                      }}
                    >
                      {regions.map((item) =>
                        (<Option value={item.id}>{item.name}</Option>)
                      )}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-xl-3">
                  <Form.Item
                    key="city_id"
                    label="Город"
                    name="city_id"
                    rules={[{ required: true, message: 'Выберите город!' }]}
                  >
                    <Select
                      placeholder="Выберите город"
                      onChange={(item) => {
                        const city = cities.find(o => o.id === item);
                        selectCity(city);
                      }}
                    >
                      {cities.map((item) =>
                        (<Option value={item.id}>{item.name}</Option>)
                      )}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-xl-12 d-xl-flex justify-content-end">
                  <Button className="col-12 col-xl-2" onClick={onChange} style={{ backgroundColor: "#184d9f", color: "#fff" }}>Поиск</Button>
                </div>
              </Form>
            </Modal>
          </div>
          <div className="col-md-12 py-0 py-md-2 bg-light d-none d-md-block">
            <label>По категориям</label>
            <div className="row">
              {category?.children?.map((category) =>
                <div className="col-3 col-md-2 mt-2 mt-md-2">
                  <Link className="cat-link text-primary" onClick={() => newCategory(`/category/${category.id}`)}>
                    {category.name}
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-12 py-2 bg-light d-block d-md-none">
            <label>По категориям</label>
            <div className="col-12">
              {options.length > 0 ? 
                <Select
                  defaultValue={category.name}
                  size="default"
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChange}
                  options={category?.children ? options : <></>}
                />
                : <></>
              }
            </div>
          </div>
        </>
        :
        <></>
      }
    </>
  );

};
export default SubCategories;