import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { fetchSearchProducts } from "../api/product";
import { Skeleton, Grid } from "@mui/material";
import ProductItem from "../components/product/product_item";
import { Button, BackTop, Tooltip } from "antd";

const SearchResult = ({ match }) => {
    const [products, setProducts] = useState();
    const limit = 20;
    const [offset, setOffset] = useState(0);

    const fetchInitProducts = async () => {
        let _products = await fetchSearchProducts({ 'searchText': match.params.search });
        if (_products != null) {
            _products = _products.concat(await fetchSearchProducts({ 'with': 'user' }));
            setProducts(_products);
            setOffset(offset + limit);
        }
    };

    const fetchProducts = async () => {
        let prods = products.concat(await fetchSearchProducts({ offset: offset }));
        if (prods != null) {
            setProducts(prods);
            setOffset(offset + limit);
        }
    };
    document.title = "Поиск";
    useEffect(() => {
        fetchInitProducts();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="col-md-12 py-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a style={{ color: "rgb(9, 72, 130)" }} href="/"><i className="fa-solid fa-house"></i> Главная страница</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Поиск</li>
                    </ol>
                </nav>
                <label className="pt-3" style={{ fontSize: 20, color: "black" }}>Результаты поиска: {match.params.search}</label>
                <div style={{ 'width': '185px', 'height': '3px', 'backgroundColor': 'rgb(9, 72, 130)' }}></div>
                <hr className="pb-2" />
                <div className="row mt-6 mb-6">
                    {products === null || products === undefined || products.length === 0 ?
                        <Grid container spacing={2} className="pl-3 pt-4 pb-4">
                            <Grid item xs={4}>
                                <Skeleton variant="rectangular" width={'100%'} height={100} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </Grid>
                            <Grid item xs={4}>
                                <Skeleton variant="rectangular" width={'100%'} height={100} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </Grid>
                            <Grid item xs={4}>
                                <Skeleton variant="rectangular" width={'100%'} height={100} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </Grid>
                        </Grid>
                        : products.map((product) => {
                            return (
                                <div className="col-6 col-sm-6 col-xl-3 mt-3">
                                    <ProductItem product={product} />
                                </div>
                            )
                        })}
                </div>
                <center className="mt-5">
                    <Button
                        variant="outlined"
                        onClick={() => {
                            fetchProducts();
                        }}>
                        Показать еще
                    </Button>
                </center>
                <hr />
            </div>
        </div>
    );
}

export default SearchResult;