import { intIds2Strings } from '../../utilities/util';

const CLEAR_FAVORITES = "CLEAR_FAVORITES";
const GET_LIQUOR_CATEGORIES = "GET_LIQUOR_CATEGORIES";
const GET_LIQUOR_CATEGORIES_URL = "/api/v1/cellarer/liquor/categories";
const GET_LIQUORS = "GET_LIQUORS";
const GET_LIQUORS_URL = categoryId => `/api/v1/cellarer/liquors?categoryId=${categoryId}`;

const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";


const initialState = {
    isLoading: false,
    categories: [],
    liquors: {}
}

export const clear = () => {
    return {
        type: CLEAR_FAVORITES
    };
}

export const getLiquorCategories = id => {
    return {
        type: GET_LIQUOR_CATEGORIES,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_LIQUOR_CATEGORIES_URL,
    };
}

export const getLiquors = categoryId => {
    return {
        type: GET_LIQUORS,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_LIQUORS_URL(categoryId),
        categoryId
    };
}

const reducer = (state = initialState, action) => {
    let resultCase = {
        CLEAR_FAVORITES: processClear,
        GET_LIQUOR_CATEGORIES: processGetLiquorCategories,
        GET_LIQUORS: processGetLiquors
    }

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
}

const processClear = (state, action) => {
    return {
        isLoading: false,
        categories: [],
        liquors: {}
    };
}

const processGetLiquorCategories = (state, action) => {
    let result = getBaseAxiosResult(state, action);

    if (action.status === SUCCESS && action.payload) {
        result.categories = intIds2Strings(action.payload);
    }

    return result;
}

const processGetLiquors = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS && action.payload) {
        result.liquors[action.categoryId] = intIds2Strings(action.payload);
    } 

    return result;
}


const getBaseAxiosResult = (state, action) => {
    return {
        ...state,
        isLoading: action.isLoading,
        error: action.error
    };
}

export default reducer;