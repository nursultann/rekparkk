import { ActionTypes } from "../../constants/action_types";

export const setBussinessPlanDetails = (product) => {
    return {
        type: ActionTypes.SET_BUSSINESS_PLAN_DETAILS,
        payload: product,
    }
}