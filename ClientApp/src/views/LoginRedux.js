import { setAuthToken } from '../utilities/authentication';

const LOGIN = "LOGIN";
const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";

const initialState = {
    loading: false,
    error: ""
}

export function login(account, password) {
    return {
        type: LOGIN,
        statuses: [ LOADING, SUCCESS, ERROR ],
        method: "post",
        url: "fakeapi/login",
        params: {
            account,
            password
        }
    };
}

function reducer(state = initialState, action) {
    let resultCase = {
        LOGIN: processLogin
    }

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
}

const processLogin = (state, action) => {
    if (action.status === SUCCESS && action.payload) setAuthToken(action.payload.token);
    console.log("login reducer", action);
    return {
        ...state,
        loading: action.loading,
        error: action.error
    };
}

export default reducer;