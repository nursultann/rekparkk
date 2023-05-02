import { ActionTypes } from "../../constants/action_types";

export const setCurrencies = (currencies) => {
    return {
        type: ActionTypes.SET_CURRENCIES,
        payload: currencies,
    }
}

export const setRegions = (regions) => {
    return {
        type: ActionTypes.SET_REGIONS,
        payload: regions,
    }
}

export const setCities = (cities) => {
    return {
        type: ActionTypes.SET_CITIES,
        payload: cities,
    }
}

export const setDistricts = (districts) => {
    return {
        type: ActionTypes.SET_DISTRICTS,
        payload: districts,
    }
}