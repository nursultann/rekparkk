import { ActionTypes } from "../../constants/action_types"

const initialState = {
    products: [],
    productDetails: null,
    categoryProducts: [],
}

export const productReducer = (state = initialState, {type, payload}) => {
    switch(type) {
        case ActionTypes.SET_PRODUCTS:
            return { ...state, products: payload };
        case ActionTypes.SET_SELECTED_PRODUCT:
            return { ...state, productDetails: payload };
        case ActionTypes.SET_CATEGORY_PRODUCTS:
                return { ...state, categoryProducts: payload };
        default: 
            return state;
    }
}