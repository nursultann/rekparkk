import ApiClient from "./ApiClient";
export const fetchProducts = async (params = { limit: 20, offset: 0 }) => {
    try {
        if (!params.hasOwnProperty('offset')) params['offset'] = 0;
        if (!params.hasOwnProperty('limit')) params['limit'] = 20;

        const response = await ApiClient.get('/products-list', params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }
    return null;
};
export const fetchProduct = async (id, params) => {
    try {
        const response = await ApiClient.get(`/products/${id}`, params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching product error ', error);
    }

    return null;
};

export const createProduct = async (params) => {
    try {
        const response = await ApiClient.post('/products', params, 'multipart/form-data');
        if (response.status == 200 || response.status == 201) {
            return response.data;
        }
    } catch (error) {
        console.log('create product error ', error.response);
    }

    return null;
};

export const createComment = async (text, productId, userId, parentId = null) => {
    try {
        const response = await ApiClient.post('/comments', { 'text': text, 'advertisement_id': productId, 'user_id': userId, 'parent_id': parentId });
        if (response.status == 200 || response.status == 201) {
            return response.data;
        }
    } catch (error) {
        console.log('create product error ', error.response);
    }

    return null;
};
export const deleteComments = async (id) => {
    try {
        const response = await ApiClient.delete(`/comments/${id}`);
        if (response.status == 200 || response.status == 201) {
            return response.data;
        }
    } catch (error) {
        console.log('create product error ', error.response);
    }

    return null;
};
export const answerComment = async (text, productId, userId, parentId) => {
    try {
        console.log(parentId);
        const response = await ApiClient.post(`/comments`, { 'text': text, 'advertisement_id': productId, 'user_id': userId, 'parent_id': parentId });
        if (response.status == 200 || response.status == 201) {
            return response.data;
        }
    } catch (error) {
        console.log('create product error ', error.response);
    }

    return null;
};

export const updateProduct = async (id, params) => {
    try {
        if (params instanceof FormData && !params.has('_method')) {
            params.append('_method', 'PATCH');
        } else if (typeof params === 'Object' && !params.hasOwnProperty('_method')) {
            params['_method'] = 'PATCH';
        } else {
            console.log('params not object');
        }

        const response = await ApiClient.post(`/products/${id}`, params, 'multipart/form-data');
        if (response.status == 200 || response.status == 201) {
            return response.data;
        }
    } catch (error) {
        console.log('fetching products error ', error.response);
    }

    return null;
};

export const fetchUserProducts = async (params = { limit: 20, offset: 0 }) => {
    try {
        if (!params.hasOwnProperty('offset')) params['offset'] = 0;
        if (!params.hasOwnProperty('limit')) params['limit'] = 20;
        // params['orderBy'] = 'id';
        // params['sortedBy'] = 'desc';
        
        const response = await ApiClient.get('/user-products', params);
        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
};
export const fetchUserFavorites = async (params = { limit: 20, offset: 0 }) => {
    try {
        if (!params.hasOwnProperty('sub')) {
            if (!params.hasOwnProperty('offset')) params['offset'] = 0;
            if (!params.hasOwnProperty('limit')) params['limit'] = 20;
        }
        params['orderBy'] = 'id';
        params['sortedBy'] = 'desc';
        
        const response = await ApiClient.get('/favorites', params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
};

export const fetchSearchProducts = async (params)=>{
    try {
        if (!params.hasOwnProperty('sub')) {
            if (!params.hasOwnProperty('offset')) params['offset'] = 0;
            if (!params.hasOwnProperty('limit')) params['limit'] = 20;
        }

        const response = await ApiClient.get('/products', params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
}

export const addToFavorites = async (id) => {
    try {
        const response = await ApiClient.post(`/products/${id}/addtofav`);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('addToFavoritesError ', error.response);
    }

    return null;
}

export const removeFromFavorites = async (id) => {
    try {
        const response = await ApiClient.post(`/products/${id}/remfromfav`);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('removeFromFavoritesError ', error.response);
    }

    return null;
}
export const postComplaints = async (params)=>{
    try {
        console.log('params ', params);
        const response = await ApiClient.post(`/complaints`,params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('comments err ', error.response);
    }

    return null;
}
export const getComplaints = async ()=>{
    try {
        // console.log('params ', params);
        const response = await ApiClient.get("/complaints/types");
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('comments err ', error.response);
    }

    return null;
}
export const deactivate = async (id)=>{
    try {
        console.log('params ', id);
        const response = await ApiClient.post(`/products/${id}/deactivate`);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('comments err ', error.response);
    }

    return null;
}
export const activate = async (id)=>{
    try {
        console.log('params ', id);
        const response = await ApiClient.post(`/products/${id}/activate`);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('comments err ', error.response);
    }

    return null;
}
export const fetchUsersProducts = async (params) => {
    try {
        if (!params.hasOwnProperty('sub')) {
            if (!params.hasOwnProperty('offset')) params['offset'] = 0;
            if (!params.hasOwnProperty('limit')) params['limit'] = 20;
        }
        params['orderBy'] = 'id';
        params['sortedBy'] = 'desc';
        // params['with'] = 'user';
        const response = await ApiClient.get('/products', params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
};
export const productMakeVip = async (id, params) => {
    console.log(params)
    try {
        const response = await ApiClient.post(`/products/${id}/makevip`, params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('makevip error ', error.response);
    }
    return null;
};
export const productMakeTop = async (id,params) => {
    try {
        const response = await ApiClient.post(`/products/${id}/maketop`,params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }
    return null;
};
export const productMakeUrgent = async (id,params) => {
    try {
        const response = await ApiClient.post(`/products/${id}/makeurgent`,params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
};
export const productMakeAutoUp = async (id,params) => {
    try {
        const response = await ApiClient.post(`/products/${id}/makeautoup`,params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
};
export const productMakeColored = async (id, params) => {
    console.log(params)
    try {
        const response = await ApiClient.post(`/products/${id}/makecolored`, params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('makevip error ', error.response);
    }
    return null;
};
export const subscriptions = async ()=>{
    try {
        const response = await ApiClient.get(`/subscription/plans`);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }
    return null;
}
export const bussinessAccount = async (params)=>{
    try {
        const response = await ApiClient.get(`/business/account`,params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }
    return null;
}