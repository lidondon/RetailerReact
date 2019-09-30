const AUTH_TOKEN = "authToken";

export const isLogin = () => {
    return (sessionStorage.getItem(AUTH_TOKEN)) ? true : false;
}

export const setAuthToken = token => {
    sessionStorage.setItem(AUTH_TOKEN, token);
}

export const getAuthToken = () => {
    return sessionStorage.getItem("authToken");
}