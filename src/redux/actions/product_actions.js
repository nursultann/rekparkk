import { ActionTypes } from "../../constants/action_types";

export const setProducts = (products) => {
    return {
        type: ActionTypes.SET_PRODUCTS,
        payload: products,
    }
}

export const setProductDetails = (product) => {
    return {
        type: ActionTypes.SET_SELECTED_PRODUCT,
        payload: product,
    }
}
export const setArticleDetails = (product) => {
    return {
        type: ActionTypes.SET_SELECTED_ARTICLE,
        payload: product,
    }
}
export const setFavoriteProducts = (products)=>{
    return{
        type: ActionTypes.SET_FAVORITES,
        payload: products,
    }
}

export const setCategoryProducts = (products) => {
    return {
        type: ActionTypes.SET_CATEGORY_PRODUCTS,
        payload: products,
    }
}
