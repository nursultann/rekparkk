import client from "../config/axios_config";

class ApiClient {
    get = async (url, body, contentType = 'application/json') => {
        setContentType(contentType);
        const req = await client.get(url, {params: {...body}});
        console.log(url, 'cached', req.headers)
        return req
    };
    post = (url, body, contentType = 'application/json') => {
        setContentType(contentType);
        return client.post(url, body);
    };
    put = (url, body, contentType = 'application/json') => {
        setContentType(contentType);
        return client.put(url, body);
    };
    patch = (url, body, contentType = 'application/json') => {
        setContentType(contentType);
        return client.patch(url, body);
    };
    delete = (url, body, contentType = 'application/json') => {
        setContentType(contentType);
        return client.delete(url, body);
    };
}

const setContentType = (contentType) => {
    client.defaults.headers['Content-Type'] = contentType;
};

export default new ApiClient();