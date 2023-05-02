import React, { useEffect, useState } from "react";
import Ad from "./ad";
import Navbar from "../components/navbar";
import SearchBar from "../components/search-bar";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../redux/actions/product_actions";
import { Link } from "react-router-dom";
import * as api from "../api";
import Footer from "../components/footer";
import { Skeleton, Grid } from "@mui/material";
import ProductItem from "../components/product/product_item";
import { Button } from "@mui/material";

const Ads = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  const limit = 20;
  const [offset, setOffset] = useState(0);


  const fetchInitProducts = async () => {
    let _products = await api.fetchProducts({ 'with': 'user' });
    if (_products != null) {
      dispatch(setProducts(_products));
      setOffset(offset + limit);
    }
  };

  const fetchProducts = async () => {
    let prods = products.concat(await api.fetchProducts({ offset: offset, 'with': 'user' }));
    if (prods != null) {
      dispatch(setProducts(prods));
      setOffset(offset + limit);
    }
  };

  useEffect(() => {
    fetchInitProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <SearchBar />
      <div className="col-md-12">
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
                <div className="col-md-4 mt-3">
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

export default Ads;