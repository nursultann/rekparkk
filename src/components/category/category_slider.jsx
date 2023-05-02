import { useSelector, useDispatch } from "react-redux";
import * as api from "../../api";
import { Link } from "react-router-dom";
import { setCategories } from "../../redux/actions/category_actions";
import React, { useEffect } from "react";
import Slider from "react-slick";
import { Popover } from 'antd';

function SampleArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

const CategorySlider = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const fetchCategoriesTree = async () => {
    const categories = await api.fetchCategoriesTree();
    if (categories != null) {
      dispatch(setCategories(categories));
    }
  };
    const sliderSettings = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 11,
        slidesToScroll: 1,
        nextArrow: <SampleArrow />,
        prevArrow: <SampleArrow />,
        
        responsive: [
          {
            breakpoint: 1280,
            settings: {
              slidesToShow: 8,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },  
          {
              breakpoint: 1024,
              settings: {
                slidesToShow: 8,
                slidesToScroll: 3,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 6,
                slidesToScroll: 3,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 2,
                initialSlide: 2,
                arrows: true,
                speed: 500,
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: true,
                speed: 500,
              }
            }
          ]
    };

  useEffect(() => {
    fetchCategoriesTree();
  }, []);

  const popoverContent = (children) => (
    <div style={{ width: '250px' }}>
      {children.map((item) => (<><a className="cat-link" style={{color: "rgb(9, 72, 130)"}} href={`/category/${item.id}`}>{item.name}</a><br /></>))}
    </div>
  );
  console.log('categories', categories);
  const content = (category) => {
    const image = category.image != null
      ? category.image
      : 'https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg';
    return (
      <div id={category.id}>
        <Link className="cat-link" to={`category/${category.id}`} style={{ color: "black" }}>
          <div className="col-md-12 px-0 mb-3 d-flex flex-column align-items-center justify-content-center">
            <img className="mx-3 mb-1 rounded-circle" src={image} width="50px" height="50px" />
            <p style={{ fontSize: 13, width: 100 }}>{category.name}</p>
          </div>
        </Link>
      </div>
    );
  };

    return (
        <Slider {...sliderSettings}>
            {categories.map((category) => {
                return (
                    category.children != null && category.children.length > 0 ?
                        <Popover
                            key={category.id}
                            className="col-md-4"
                            content={() => popoverContent(category.children)}
                            placement="bottom"
                        >
                            {content(category)}
                        </Popover>
                        : <div className="col-md-4" key={category.id}>
                            {content(category)}
                        </div>
                )
            })}
        </Slider>
    );

};

export default CategorySlider;