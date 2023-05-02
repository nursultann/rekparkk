import ApiClient from './ApiClient';
export const fetchSettings = async (params) => {
    try {
        const response = await ApiClient.get('/settings', params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetch settings error ', error);
    }
    return null;
};
export const fetchRegions = async (params = { }) => {
    try {
        if (!params.hasOwnProperty('with')) params['with'] = 'cities.districts';      
        const response = await ApiClient.get('/regions', params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching regions error ', error);
    }
    return null;
};
export const fetchCurrencies = async (params = {}) => {
    try {
        const response = await ApiClient.get('/currencies', params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetch currencies error', error);
    }
    return null;
};