import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { fetchArticle, fetchArticles } from "../api/articles";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setArticleDetails } from "../redux/actions/product_actions";
import { Link } from "react-router-dom";

const Article = ({match})=>{
    const dispatch = useDispatch();
    // const { articleDetails } = useSelector((state) => state.product);
    const [article,setArticle] = useState();
    const [articles,setArticles] = useState();
    const [update, setUpdate] = useState();
    const getArticle = async () => {
        const articleDetails = await fetchArticle(match.params.id);
        if (articleDetails != null){
            dispatch(setArticleDetails(articleDetails));
            setArticle(articleDetails);
            var time = moment(articleDetails.created_at, 'YYYYMMDD, h:mm:ss a');
            moment.locale('ru');
            setUpdate(time.calendar());
    
        }
    }
    const getArticles = async () =>{
        const Articles = await fetchArticles({'limit':10,'offset':0});
        if(Articles != null){
            setArticles(Articles);
            console.log(articles);
        }
    }
    useEffect(() => {
        getArticle();
        getArticles();
        console.log(article);
    }, []);
        return (
            <div>
                <Navbar />
                <div className="col-xl-12 mt-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a className="text-primary" href="/"><i className="fa-solid fa-house"></i> Главная страница</a></li>
                        <li className="breadcrumb-item"><a className="text-primary" href="/articles">Статьи и новости</a></li>
                        <li className="breadcrumb-item">Статья</li>
                    </ol>
                </nav>
                </div>
                <div className="col-md-12 pt-3 mb-5">
                    <div className="row py-1 px-2">
                        <div className="col-md-8 shadow-sm">
                            {article != null ? 
                            <div className="col-md-12">
                                <img src={article.image} width="100%" className="rounded" />
                                <label className="text-muted pt-3">Дата публикации: {update}</label>
                                <br />
                                <label style={{ fontSize: 24 }}>{article.title}</label>
                                <p dangerouslySetInnerHTML={{
                                            __html: article.text
                                          }}></p>

                            </div>
                            :<div className="col-12 text-center"><div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                          </div></div>
                            }
                        </div>
                        <div className="col-md-4">
                            <div className="col-md-12">
                                <label className="" style={{ fontSize: 20 }}>Другие новости</label>
                            </div>
                            {articles != null ?
                                    <>
                                    {
                                    articles.map((article)=>
                                    <>
                            <Link className="nav-link" to={"/article/"+article.id}>
                                <div className="col-md-12 shadow-sm">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <img src={article.image} width="100%" className="rounded" />
                                        </div>
                                        <div className="col-md-8">
                                            <label>{article.title}</label>
                                            <p 
                                                className="text-muted"
                                                style={{
                                                display: "-webkit-box",
                                                webkitLineClamp: "3",
                                                webkitBoxOrient: "vertical",
                                                overflow: "hidden"}}
                                                dangerouslySetInnerHTML={{
                                                    __html: article.text
                                                  }}
                                            >
                                            </p>
                                        </div>
                                    </div>
                                    <hr />
                                   
                                </div>
                            </Link>
                            </>
                            )}
                            </>:<></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
}
export default Article;