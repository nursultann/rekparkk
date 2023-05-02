import ApiClient from "./ApiClient";

export const fetchBussinessPlans = async () => {
    try {
        const response = await ApiClient.get('/business/plans');
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching product error ', error);
    }

    return null;
};

export const setBussinessPlan = async (params) => {
    try {
        const response = await ApiClient.post('/business/account', params, 'multipart/form-data');
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('business account api error ', error);
    }

    return null;
};

export const setBussinessSettings = async (id,params) => {
    try {
        const response = await ApiClient.post(`/business/${id}/update`, params, 'multipart/form-data');
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('business account api error ', error);
    }
    return null;
};

export const cancelBussinessAccount = async () =>{
    try {
        const response = await ApiClient.post(`/business/account/cancel`);
        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('business account api error ', error);
    }
    return null;
};

export const sendPhotoGallery = async (params) => {
    try {
        const response = await ApiClient.post('/business/account/photogallery', params, 'multipart/form-data');
        if (response.status == 200 || response.status == 201) {
            return response.data;
        }
    } catch (error) {
        console.log('photogallery ', error.response);
    }

    return null;
};
export const deleteGallery = async (id) => {
    try {
        const response = await ApiClient.delete('business/account/photogallery/' + id);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetch user details error ', error.response);
    }
    return null;
};