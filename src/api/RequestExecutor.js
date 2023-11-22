import axios from "axios/index";
import {getToken} from "../utils/AsyncStorageUtils";


const API_LOG = true;

const requestType = {
    POST: 'post',
    GET: 'get',
    PUT: 'put',
    DELETE:'delete'
};



axios.interceptors.request.use(request => {
    if (API_LOG)
        console.log('====>request<====', request);
    return request
});

export async function executeRequest(method: string, url: string, headers: any, params: any, data: any) {
    let response = await axios({
        method: method,
        url: url,
        headers: headers,
        params: params,
        data: data,
    })
        .then(async function (response) {
            if (response.data)
                return response.data;
            else
                return response;
        })
        .catch(function (error) {
            if (error.response) {
                if (API_LOG)
                    console.warn('====>Error<====', error.response.data);
                return error.response.data;
            } else if (error.request) {
                if (API_LOG)
                    console.warn('====>Error<====', error);
                return {};
            } else {
                if (API_LOG)
                    console.warn('====>Error<====', "Something went wrong");
                return {};
            }
        });

    if (API_LOG)
        console.log('====>response<====', response);

    return response;
}

export async function makePostRequest(url, data) {
    let response = await executeRequest(requestType.POST, url, null, null, data);
    return response;
}

export async function makePostRequestWithHeader(url, data) {
    let authToken = await getToken();
    authToken = 'bearer '+ authToken;
    let response = await executeRequest(requestType.POST, url, {Authorization: authToken}, null, data);
    return response;
}

export async function makeGetRequest(url) {
    let authToken = await getToken();
    authToken = 'bearer '+ authToken;
    let response = await executeRequest(requestType.GET, url, {Authorization: authToken}, null, null);
    return response;
}

export async function makeGetRequestWithQueryParameters(url, data) {
    let authToken = await getToken();
    let response = await executeRequest(requestType.GET, url, {authorization: authToken}, data, null);
    return response;
}

export async function makePutRequest(url, data) {
    let authToken = await getToken();
    authToken = 'bearer '+ authToken;
    let response = await executeRequest(requestType.PUT, url, {authorization: authToken}, null, data);
    return response;
}

export async function makeDeleteRequest(url, data) {
    let authToken = await getToken();
    authToken = 'bearer '+ authToken;
    let response = await executeRequest(requestType.DELETE, url, {authorization: authToken}, null, data);
    return response;
}


