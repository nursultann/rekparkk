import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCategories } from "../../redux/actions/category_actions";
import { setCurrencies, setRegions } from "../../redux/actions/main_actions";
import * as api from "../../api";
import { CustomAttributeField } from "../custom_components";
import DragAndDropUploader from "../drag_and_drop_uploader";
import {
  Form,
  Button,
  Input,
  InputNumber,
  Select,
  TreeSelect
} from "antd";

const { TreeNode } = TreeSelect;
const { Option } = Select;

const ProductFields = ({ form, loading = false, onSend }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { currencies, regions } = useSelector((state) => state.main);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [files, setFiles] = useState([]);
  const [phoneOptions, setPhoneOptions] = useState([]);
  const [map1, setMap1] = useState(<div id="map" style={{ width: "100%", height: "400px" }}></div>);
  const fetchCategoriesTree = async () => {
    const categories = await api.fetchCategoriesTree();
    if (categories != null) {
      dispatch(setCategories(categories));
      console.log('cateogry_id', form.getFieldValue("category_id"));
      if (form.getFieldValue("category_id")) {
        const category = categories.find(o => o.id === form.getFieldValue("category_id"));
        setSelectedCategory(category);
      }
    }
  };
  const fetchData = async () => {
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
  };

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
  };

  const selectCity = (city) => {
    form.setFieldsValue({
      city_id: city.id
    });
    setDistricts(city.districts);
  };
  useEffect(() => {
    if (categories == null || !categories.length) {
      fetchCategoriesTree();
    }
    fetchData();
  }, []);
  const currencySelect = (
    <Select value={selectedCurrencyId} onChange={(value) => setSelectedCurrencyId(value)} className="select-after">
      {currencies.map((item) => {
        return (<Option value={item.id}>{item.symbol}</Option>);
      })}
    </Select>
  );
  const categoryTree = (tree) => {
    if (!tree?.length) return;
    return tree.map((item) => (<TreeNode value={item.id} title={item.name}>{categoryTree(item.children)}</TreeNode>));
  };
  console.log('custom',selectedCategory);
  return (
    <>
      <Form
        form={form}
        name="product_create"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <center>
          <DragAndDropUploader
            className="mb-3 p-2"
            style={{ maxWidth: 500 }}
            onChange={(file) => {
              setFiles([...files, file]);
            }}
            onRemove={(f) => {
              const index = files.indexOf(f);
              if (index !== -1) {
                const f = files.splice(index, 1);
                setFiles(f);
              }
            }}
          />
        </center>
        <Form.Item
          key="name"
          label="Категория"
          name="category_id"
          rules={[{ required: true, message: 'Выберите категорию!' }]}
          className="mt-2"
        >
          <TreeSelect
            showSearch
            placeholder="Выберите категорию"
            onChange={(item) => {
              const category = categories.find(o => o.id === item);
              setSelectedCategory(category);
            }}
            allowClear
            value={selectedCategory?.id}
            filterTreeNode={(search, item) => {
              return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
            }}
          >
            {categories.map((item) => {
              return (
                <TreeNode value={item.id} title={item.name}>
                  {categoryTree(item.children)}
                </TreeNode>
              );
            })}
          </TreeSelect>
        </Form.Item>
        <Form.Item
          key="title"
          label="Загаловок"
          name="title"
          rules={[{ required: true, message: 'Введите загаловок!' }]}
        >
          <Input allowClear placeholder="Введите загаловок" />
        </Form.Item>
        <Form.Item
          key="price"
          label="Цена"
          name="price"
          rules={[{ required: true, message: 'Введите цену!' }]}
        >
          <InputNumber placeholder="Введите цену" addonAfter={currencySelect} />
        </Form.Item>
        <Form.Item
          key="description"
          label="Описание"
          name="description"
          rules={[{ required: true, message: 'Введите описание!' }]}
        >
          <Input.TextArea placeholder="Введите описание" rows={4} />
        </Form.Item>
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
        <Form.Item
          key="district"
          label="Район"
          name="district"
        >
          <Select placeholder="Выберите район">
            {districts.map((item) =>
              (<Option value={item.name}>{item.name}</Option>)
            )}
          </Select>
        </Form.Item>
        {
          selectedCategory != null ?
            <>
              {selectedCategory.custom_attribute?.map((item) => (
                <Form.Item
                  key={item.name}
                  label={item.title}
                  name={item.name}
                  rules={[{ required: item.is_required, message: item.placeholder }]}
                >
                  {CustomAttributeField(item)}
                </Form.Item>
              ))}
            </>
            : 
            <>
            
            </>
        }
        <Form.Item
          key="can_comment"
          label="Комментарии"
          name="can_comment"
        >
          <Select placeholder="Кто может комментировать" value="all">
            <Option value="all">Все</Option>
            <Option value="none">Никто</Option>
          </Select>
        </Form.Item>
        <Form.Item
          key="phones"
          label="Телефон"
          name="phones"
          rules={[{ required: true, message: 'Введите телефон!' }]}
        >
          <Select mode="tags" placeholder="Введите телефон" tokenSeparators={[',']}>
            {phoneOptions}
          </Select>
        </Form.Item>
        <Form.Item
          key="video"
          label="Прямая ссылка на видео"
          name="video"
        >
          <Input allowClear placeholder="Прямая ссылка на видео" />
        </Form.Item>
        <Form.Item
          label="Местоположение"
        >
          <span className="ant-form-text mt-1 text-primary">Поставьте курсор на карте о местоположении товара или услуги</span>
          {map1}
          {/* <Input type="text" value={JSON.stringify(location)} /> */}
        </Form.Item>
        <center>
          <Button
            className="btn"
            style={{ backgroundColor: '#184d9f', color: "#fff" }}
            loading={loading}
            onClick={async () => {
              if (onSend != null) onSend({ files: files, currency_id: selectedCurrencyId });
            }
            }>
            Опубликовать
          </Button>
        </center>
      </Form>
    </>
  );
};

export default ProductFields;