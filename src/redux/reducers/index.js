import { combineReducers } from "redux";
import { productReducer } from "./product_reducer"; 
import { categoryReducer } from "./category_reducer";
import { userReducer } from "./user_reducer";
import { ActionTypes } from "../../constants/action_types";
import { productPlansReducer } from "./product_plans";
import { bussinessPlanReducer } from "./bussiness_reducer";

const initialState = {
    currencies: [],
    regions: [],
    cities: [],
    districts: []
}

export const mainReducer = (state = initialState, {type, payload}) => {
    switch(type) {
        case ActionTypes.SET_CURRENCIES:
            return { ...state, currencies: payload };
        case ActionTypes.SET_REGIONS:
            return { ...state, regions: payload };
        case ActionTypes.SET_CITIES:
                return { ...state, cities: payload };
        case ActionTypes.SET_DISTRICTS:
                    return { ...state, districts: payload };
        default: 
            return state;
    }
}

export const reducers = combineReducers({
    product: productReducer,
    category: categoryReducer,
    user: userReducer,
    main: mainReducer,
    plans:productPlansReducer,
    bussiness: bussinessPlanReducer
});