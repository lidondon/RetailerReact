import { intIds2Strings, pushNewObjectsNoDuplicate, replaceNewObject } from '../../utilities/util';

const GET_CELLARERS = "GET_CELLARERS";
const GET_CELLARERS_URL = "/api/v1/retailer/coopcellarers";
const GET_MENU_INFO = "GET_MENU_INFO";
const GET_MENU_INFO_URL = cellarerId => `/api/v1/retailer/coopcellarer/${cellarerId}/activemenu`;
const SAVE_ORDER = "SAVE_ORDER";
const SAVE_ORDER_URL = "/api/v1/retailer/order/create";

const CLEAR_NEW_ORDERS = "CLEAR_NEW_ORDERS";
const ADD_ITEMS = "ADD_ITEMS";
const BATCH_DELETE = "BATCH_DELETE";
const SAVE_ITEM = "SAVE_ITEM";
const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
const INT_2_STRING_PROPS = ["id", "liquorId"];


const initialState = {
    isLoading: false,
    error: "",
    cellarers: [],
    currentCellarer: {},
    orders: {},
    errorRowSet: {}
}

export const clear = () => {
    return {
        type: CLEAR_NEW_ORDERS
    };
}

export const getCellarers = id => {
    return {
        type: GET_CELLARERS,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_CELLARERS_URL,
    };
}

export const getMenuInfo = cellarerId => {
    return {
        type: GET_MENU_INFO,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_MENU_INFO_URL(parseInt(cellarerId)),
        cellarerId
    };
}

export const addItems = addedItems => {
    return {
        type: ADD_ITEMS,
        addedItems
    }
}

export const batchDelete = (cellarerId, selectedRowKeys) => {
    return {
        type: BATCH_DELETE,
        cellarerId,
        selectedRowKeys
    }
}

export const saveItem = (cellarerId, row, error) => {
    return {
        type: SAVE_ITEM,
        cellarerId,
        row, 
        error
    };
}

export const saveOrder = cellarerId => {
    return {
        type: SAVE_ORDER,
        method: "post",
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: SAVE_ORDER_URL,
        params: {
            merchantId: parseInt(cellarerId),
            consumerId: 0
        }
    };
}

const reducer = (state = initialState, action) => {
    let resultCase = {
        CLEAR_LIQUOR: processClear,
        GET_CELLARERS: processGetCellarers,
        GET_MENU_INFO: processGetMenuInfo,
        ADD_ITEMS: processAddItems,
        BATCH_DELETE: processBatchDelete,
        SAVE_ITEM: processSaveItem,
        SAVE_ORDER: processSaveOrder
    }

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
}

const processClear = (state, action) => {
    return {
        
    };
}

const processGetCellarers = (state, action) => {
    let result = getBaseAxiosResult(state, action);

    if (action.status === SUCCESS && action.payload) {
        result.cellarers = intIds2Strings(action.payload);
    }

    return result;
}

const processGetMenuInfo = (state, action) => {
    let result = getBaseAxiosResult(state, action);

    if (action.status === SUCCESS && action.payload) {
        result.currentCellarer = { id: action.cellarerId, menuId: String(action.payload.id) };
    }
    
    return result;
}

const processAddItems = (state, action) => {
    const { currentCellarer, orders } = state;
    const { addedItems } = action;

    if (addedItems && addedItems.length > 0) {
        let theOrders = orders[currentCellarer.id];
        let newOrders = getIemsFromMenuItems(addedItems);

        if (theOrders && theOrders.length > 0) {
            pushNewObjectsNoDuplicate(theOrders, newOrders, "liquorId");
        } else {
            theOrders = newOrders;
        }
        orders[currentCellarer.id] = theOrders;
    }
    
    return { ...state, orders };
}

const getIemsFromMenuItems = menuItems => {
    return menuItems.map(m => {
        let item = Object.assign({}, m);

        item.id = "0";
        item.menuItemDesc = m.itemDesc;
        delete item.itemDesc;

        return item;
    });
}

const processBatchDelete = (state, action) => {
    let { orders, errorRowSet } = state;
    let { cellarerId, selectedRowKeys } = action;
    
    deleteFromErrorRowSet(errorRowSet, selectedRowKeys, cellarerId);
    orders[cellarerId] = orders[cellarerId].filter(o => !selectedRowKeys.includes(o.liquorId));
    if (orders[cellarerId].length === 0) delete orders[cellarerId];

    return { ...state, orders, errorRowSet };
}

const deleteFromErrorRowSet = (errorRowSet, selectedRowKeys, cellarerId) => {
    selectedRowKeys.forEach(id => errorRowSet[cellarerId].delete(id));
}

const processSaveItem = (state, action) => {
    const { cellarerId, row, error } = action;
    const { orders, errorRowSet } = state;
    let newDatas = orders[cellarerId];

    replaceNewObject(newDatas, row, "liquorId");
    if(error) {
        if (!errorRowSet[cellarerId]) errorRowSet[cellarerId] = new Set();
        errorRowSet[cellarerId].add(row.liquorId);
    } else {
        errorRowSet[cellarerId].delete(row.liquorId);
        if (errorRowSet[cellarerId].size === 0) deleteFromErrorRowSet[cellarerId];
    }

    return { ...state, orders, errorRowSet };
}

const processSaveOrder = (state, action) => {
    const { cellarerId } = action;
    const { orders } = state;
    let result = getBaseAxiosResult(state, action);

    console.log("processSaveOrder", action);
    if (action.status === SUCCESS && action.payload) {
        delete orders[cellarerId];
        result.orders = orders;
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