import { ActionTypes } from "../../constants/action_types"

const initialState = {
    planDetails: null,
}

export const bussinessPlanReducer = (state = initialState, {type, payload}) => {
    switch(type) {
        case ActionTypes.SET_BUSSINESS_PLAN_DETAILS:
            return { ...state, planDetails: payload };
        default: 
            return state;
    }
}