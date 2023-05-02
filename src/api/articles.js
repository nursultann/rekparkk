import ApiClient from "./ApiClient";

export const fetchArticles = async (params = { limit: 20, offset: 0 }) => {
    try {
        if (!params.hasOwnProperty('sub')) {
            if (!params.hasOwnProperty('offset')) params['offset'] = 0;
            if (!params.hasOwnProperty('limit')) params['limit'] = 20;
        }
        params['orderBy'] = 'id';
        params['sortedBy'] = 'desc';

        const response = await ApiClient.get('/articles', params);
        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
};

export const fetchArticleCategories = async () => {
    try {
        const response = await ApiClient.get('/articles/categories');
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
};
export const fetchArticle = async (id) =>{
    try {
        const response = await ApiClient.get('/articles/'+id);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
}
export const fetchArticlesByCategories = async (id,params={'with':'articles'}) =>{
    try {
        const response = await ApiClient.get(`/articles/categories/${id}`,params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
}