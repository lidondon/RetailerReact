import { intIds2Strings } from '../../utilities/util';

const CLEAR_FAVORITES = "CLEAR_FAVORITES";
const GET_LIQUOR_CATEGORIES = "GET_LIQUOR_CATEGORIES";
const GET_LIQUOR_CATEGORIES_URL = "/api/v1/retailer/liquor/categories";
const GET_LIQUORS = "GET_LIQUORS";
const GET_LIQUORS_URL = categoryId => `/api/v1/retailer/liquors?categoryId=${categoryId}`;
const GET_FAVORITES = "GET_FAVORITES";
const GET_FAVORITES_URL = "/api/v1/retailer/favorites";
const ADD_FAVORITE = "ADD_FAVORITE";
const ADD_FAVORITE_URL = "/api/v1/retailer/favorite/add";
const REMOVE_FAVORITE = "REMOVE_FAVORITE";
const REMOVE_FAVORITE_URL = "/api/v1/retailer/favorite/remove";

const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
const INT_2_STRING_PROPS = ["id", "liquorId", "categoryId"];

const initialState = {
    isLoading: false,
    categories: [],
    liquors: {},
    favorites: [],

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
        url: GET_LIQUOR_CATEGORIES_URL
    };
}

export const getFavorites = () => {
    return {
        type: GET_FAVORITES,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_FAVORITES_URL
    };
}

export const addFavorite = item => {
    return {
        type: ADD_FAVORITE,
        method: "post",
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: ADD_FAVORITE_URL,
        params: {
            liquorId: parseInt(item.id)
        },
        categoryId: item.categoryId
    };
}

export const removeFavorite = item => {
    return {
        type: REMOVE_FAVORITE,
        method: "post",
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: REMOVE_FAVORITE_URL,
        params: {
            favoriteId: parseInt(item.favoriteId)
        },
        categoryId: item.categoryId
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
        GET_LIQUORS: processGetLiquors,
        GET_FAVORITES: processGetFavorites,
        ADD_FAVORITE: processAddFavorite,
        REMOVE_FAVORITE: processRemoveFavorite
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
        result.liquors[action.categoryId] = intIds2Strings(action.payload, INT_2_STRING_PROPS);
        bindFavoritesOnCategory(result.liquors[action.categoryId], state.favorites);
    } 

    return result;
}

const processGetFavorites = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS && action.payload) {
        result.favorites = intIds2Strings(action.payload, INT_2_STRING_PROPS);
        if (result.refreshCategory) {
            bindFavoritesOnCategory(result.liquors[state.refreshCategory], result.favorites);
            result.refreshCategory = null;
        } else {
            bindFavorites(state.liquors, result.favorites);
        }
    } 

    return result;
}

const bindFavorites = (liquors, favorites) => {
    for (let c in liquors) {
        bindFavoritesOnCategory(liquors[c], favorites);
    }
}

const bindFavoritesOnCategory = (items, favorites) => {
    items.forEach(i => {
        let f = favorites.find(f => f.liquorId === i.id);

        if (f) {
            i.favoriteId = f.id;
        } else {
            delete(i.favoriteId);
        }
    });
}

const processAddFavorite = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS) {
        result.refreshCategory = action.categoryId
    } 

    return result;
}

const processRemoveFavorite = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS) {
        result.refreshCategory = action.categoryId
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