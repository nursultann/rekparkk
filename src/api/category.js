import ApiClient from "./ApiClient";

export const fetchCategoriesTree = async (params = {}) => {
    try {
        const response = await ApiClient.get('/categories/tree', { ...params, cache: { maxAge: 60 * 60 * 1000, } });
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('FetchCategoriesErr', error);
    }

    return null;
};

export const fetchCategoryProducts = async (id, params = { limit: 20, offset: 0 }) => {
    try {
        if (!params.hasOwnProperty('sub')) {
            if (!params.hasOwnProperty('offset')) params['offset'] = 0;
            if (!params.hasOwnProperty('limit')) params['limit'] = 20;
        }
        params['with'] = 'user';
        // params['search'] = `category_id:${id}`;
        // params['searchFields'] = `category_id:=`;
        params['categories'] = `${id}`;

        console.log('fetchCategoryProductsParams', params);

        const response = await ApiClient.get(`/products`, params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
};

export const fetchCategoryDetails = async (id) => {
    try {
        const params = { 'with': 'customAttribute;children' };
        const response = await ApiClient.get(`/categories/${id}`, params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('FetchCategoryErr', error);
    }

    return null;
};