import { useSelector, useDispatch } from "react-redux";
import * as api from "../../api";
import { setCategories } from "../../redux/actions/category_actions";
import React, { useEffect } from "react";
import Slider from "react-slick";

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
const Bussiness_Slider = () => {
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
        arrows: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <SampleArrow />,
        prevArrow: <SampleArrow />
    };

    useEffect(() => {
        fetchCategoriesTree();
    }, []);

    return (
        <Slider {...sliderSettings}>
            {categories.map((category) => {
                const image = category.media.length > 0
                    ? category.media[0].original_url
                    : 'https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg';

                return (
                    <div className="col-md-4">
                        <div id={category.id}>
                            <a href={`/category/${category.id}`}>
                                <div className="col-md-12 px-2 mb-3 d-flex flex-column align-items-center justify-content-center">
                                    <img className="mx-3 mb-1 rounded-circle" src={image} width="70px" height="70px" />
                                    <a className="" href={`/category/${category.id}`}>{category.name}</a>
                                </div>
                            </a>
                        </div>
                    </div>
                )
            })}
        </Slider>
    );

};

export default Bussiness_Slider;