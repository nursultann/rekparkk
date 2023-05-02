import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { fetchArticleCategories, fetchArticlesByCategories } from "../api/articles";
import $ from 'jquery';
import moment from "moment";
import { Link } from "react-router-dom";
const CategoryArticles = ({ match }) => {
    const [articles, setArticles] = useState();
    const [categories, setCategories] = useState();
    const fetchArticles = async () => {
        const _articles = await fetchArticlesByCategories(match.params.id);
        console.log(_articles);
        if (_articles != null) {
            setArticles(_articles.articles);
        }
    }
    const fetchCategories = async () => {
        const fetchCategory = await fetchArticleCategories();
        if (fetchCategory != null) {
            setCategories(fetchCategory);
        }
    }
    useEffect(() => {
        fetchCategories();
        fetchArticles();
    }, []);
    return (
        <div>
            <Navbar />
            <div className="col-xl-12 mt-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a className="text-primary" href="/">
                                <i className="fa-solid fa-house"></i> Главная страница
                            </a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Статьи и новости</li>
                    </ol>
                </nav>
            </div>
            <div className="row px-2">
                <div className="col-md-12">
                    <div className="col-md-12">
                        <label style={{ fontSize: 24 }} className="pt-1">Статьи и новости</label>
                        <hr />
                    </div>
                    <div className="col-xl-12">
                        <label style={{ fontSize: 18 }} className="text-dark bg-light py-2 px-2 rounded-pill" >Категории</label>
                        <div className="col-xl-12 py-2 rounded d-flex justify-content-between"
                            style={{ backgroundColor: "#184d9f" }}>
                            {categories != null || categories != undefined || categories?.length > 0 ?
                                <>
                                    {categories.map((category) =>
                                        <Link className="text-white p-2" to={"/articles_categories/" + category.id}>{category.name}</Link>
                                    )
                                    }
                                </>
                                :
                                <></>
                            }
                        </div>
                        <hr />
                    </div>
                    {articles != null || articles != undefined || articles?.length > 0 ?
                        <>
                            {articles.map((article) =>
                                <Link className="nav-link" to={'/article/' + article.id}>
                                    <div className="col-md-12 shadow-sm px-3 py-3">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <img src={article.image} width="100%" className="rounded" />
                                            </div>
                                            <div className="col-md-9">
                                                <label style={{ fontSize: 20 }} className="text-dark">{article.title}</label>
                                                <div style={{
                                                    display: "-webkit-box",
                                                    webkitLineClamp: "10",
                                                    webkitBoxOrient: "vertical",
                                                    overflow: "hidden"
                                                }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: article.text
                                                    }}>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                </Link>
                            )}
                        </>
                        : <>Загрузка</>
                    }
                </div>
                <div className="col-md-2">

                </div>
            </div>
        </div>
    );
}
export default CategoryArticles;