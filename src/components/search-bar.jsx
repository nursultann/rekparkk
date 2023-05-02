import { useState, useEffect } from 'react';
import React from "react";
import CategorySlider from "./category/category_slider";
import { Button } from 'antd';
import { Input } from 'antd';
import { setCategories } from "../redux/actions/category_actions";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../api";
import { TreeSelect, Select } from 'antd';
import { useHistory } from "react-router-dom";
import BussinessProfiles from './bussiness_profiles';
const { Search } = Input;
const { TreeNode } = TreeSelect;

const SearchBar = () => {
  const [value, setValue] = useState(undefined);
  const [search, setSearch] = useState();
  const history = useHistory();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const onChange = () => {
    setValue(value);
  }

  const Search = () => {
    history.push(`search_result/${search}`);
  }
  const [options, setOptions] = useState([]);
  const fetchCategoriesTree = async () => {
    const categories = await api.fetchCategoriesTree();
    if (categories != null) {
      dispatch(setCategories(categories));
      {
        categories.map((category) => {
          category.children != null && category.children.length > 0 ?
          <>
            {setOptions(prevState => [...prevState, {
              label: category.name,
              value: category.id
              // options: [
              //   category.children.map((item)=>
              //   {
              //     label: item.name,
              //     value: item.id,
              //   },
              //   )
              // ],
            }])
            }
          </>
          :
          <>
          </>
          console.log('options', options);
        }
        )
      }
    }
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    window.location.href = "/category/"+value;
  };

  useEffect(() => {
    fetchCategoriesTree();
  }, []);

  return (
    <div>
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12">
            <div className='row pt-2 px-0 px-lg-0 d-md-flex align-items-center'>
              <div className='col-lg-12 mt-3 mt-xl-0 px-3 pt-2'>
                <div className='col-12 mr-2 alert alert-info' style={{borderRadius : "10px"}}>
                  <div className='row'>
                    <div className='col-lg-2 px-2 px-lg-1 py-2 py-lg-2 d-none d-md-block'>
                      {options != null ?
                        <Select
                          defaultValue="Категории"
                          size="default"
                          style={{
                            width: "100%",
                          }}
                          onChange={handleChange}
                          options={options}
                        />
                        : <></>
                      }
                    </div>
                    <div className="col-lg-8 px-2 px-lg-2 mt-2 mt-lg-0 py-1 py-lg-2" >
                      <input type={"search"} className='col-lg-12 form-control border-0' placeholder="Я ищу..." onChange={(e) => { setSearch(e.target.value) }} style={{ width: "100%" }} />
                    </div>
                    <div className='col-lg-2 px-2 px-lg-1 py-2 py-lg-2'>
                      <button className='btn btn-outline-light text-white col-12 rounded' type="primary" style={{ backgroundColor: 'rgb(9, 72, 130)' }} onClick={Search}>
                        Найти
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 pb-4 px-0">
          {/* <h3 style={{color : "#424242", fontSize : "19px" }}>Категории</h3> */}
          {/* <hr /> */}
          <center>
            <CategorySlider />
          </center>
        </div>
        <div className='col-xl-12'>
          {/* <Bussiness/> */}
        </div>
      </div>
      <hr />
    </div>
  );
}

export default SearchBar;