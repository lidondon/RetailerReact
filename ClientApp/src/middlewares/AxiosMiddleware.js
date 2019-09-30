import axios from 'axios';
import { isLogin, getAuthToken } from '../utilities/authentication';

const BASE_URL = "http://ec2-3-112-213-86.ap-northeast-1.compute.amazonaws.com:8082";

const axiosMiddelware = store => next => action => {
    if (!action.url || !Array.isArray(action.statuses)) return next(action);
    const [ LOADING, SUCCESS, ERROR ] = action.statuses;
    const axiosConfig = {
        baseURL: (action.baseUrl) ? action.baseUrl : BASE_URL,
        method: (action.method) ? action.method : "get",
        url: action.url,
        headers: { 
            "Content-Type": "application/json",
            ...action.headers
        },
        data: action.params
    }
    
    addTokenInHeader(axiosConfig.headers);
    next({
        type: action.type,
        status: LOADING,
        isLoading: true,
        ...action,
    });
    axios(axiosConfig).then(response => {
        next({
            type: action.type,
            status: SUCCESS,
            isLoading: false,
            payload: response.data,
            ...action
        });
    }).catch (error => {
        next({
            type: action.type,
            status: ERROR,
            isLoading: false,
            error
        })
    });
}

const addTokenInHeader = headers => {
    if (isLogin()) {
        headers.authToken = getAuthToken();
    }
}

export default axiosMiddelware;