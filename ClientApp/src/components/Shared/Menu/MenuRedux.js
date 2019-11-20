import { intIds2Strings } from '../../../utilities/util';

const GET_MENU_CATEGORIES = "GET_MENU_CATEGORIES";
const GET_MENU_CATEGORIES_URL = menuId => `/api/v1/retailer/activemenu/${menuId}/categories`;
const GET_MENU_ITEMS = "GET_MENU_ITEMS";
const GET_MENU_ITEMS_URL = (menuId, categoryId) => `/api/v1/retailer/activemenu/${menuId}/items?categoryId=${categoryId}`;

const CLEAR_MENU = "CLEAR_MENU";
const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
const INT_2_STRING_PROPS = ["id", "liquorId"];


const initialState = {
    isLoading: false,
    categories: [],
    items: {}
}

export const clear = () => {
    return {
        type: CLEAR_MENU
    };
}

export const getMenuCategories = id => {
    return {
        type: GET_MENU_CATEGORIES,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_MENU_CATEGORIES_URL(id),
    };
}

export const getMenuItems = (menuId, categoryId) => {
    return {
        type: GET_MENU_ITEMS,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_MENU_ITEMS_URL(menuId, categoryId),
        categoryId
    };
}

const reducer = (state = initialState, action) => {
    let resultCase = {
        CLEAR_MENU: processClear,
        GET_MENU_CATEGORIES: processGetMenuCategories,
        GET_MENU_ITEMS: processGetMenuItems
    }

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
}

const processClear = (state, action) => {
    return {
        isLoading: false,
        categories: [],
        items: {}
    };
}

const processGetMenuCategories = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS && action.payload) {
    
        result.categories = intIds2Strings(action.payload);
    }

    return result;
}

const processGetMenuItems = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS && action.payload) {
        result.items[action.categoryId] = intIds2Strings(action.payload, INT_2_STRING_PROPS);
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