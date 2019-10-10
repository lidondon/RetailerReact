import { intIds2Strings, StringIds2Ints, pushNewObjectsNoDuplicate, replaceNewObject } from '../../utilities/util';

const SEARCH_ORDER_GET_CELLARERS = "SEARCH_ORDER_GET_CELLARERS";
const GET_CELLARERS_URL = "/api/v1/retailer/coopcellarers";
const GET_ORDERS = "GET_ORDERS";
const GET_ORDERS_URL = (startDate, endDate) => `/api/v1/retailer/orders?startDate=${startDate}&endDate=${endDate}`;
const SEARCH_ORDER_GET_MENU_INFO = "SEARCH_ORDER_GET_MENU_INFO";
const GET_MENU_INFO_URL = cellarerId => `/api/v1/retailer/coopcellarer/${cellarerId}/activemenu`;
const SEARCH_ORDERS_UPDATE_ORDER = "SEARCH_ORDERS_UPDATE_ORDER";
const SEARCH_ORDERS_UPDATE_ORDER_URL = id => `/api/v1/retailer/order/${id}/update`;
const GET_ORDER_ITEMS = "GET_ORDER_ITEMS";
const GET_ORDER_ITEMS_URL = id => `/api/v1/retailer/order/${id}/items`;

const CLEAR_SEARCH_ORDERS = "CLEAR_SEARCH_ORDERS";
const CLEAR_ORDER_INFO = "CLEAR_ORDER_INFO";
const ADD_ITEMS = "ADD_ITEMS";
const SEARCH_ORDER_BATCH_DELETE = "SEARCH_ORDER_BATCH_DELETE";
const SEARCH_ORDERS_SAVE_ITEM = "SEARCH_ORDERS_SAVE_ITEM";
const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
const INT_2_STRING_PROPS = ["id", "orderStatusId", "liquorId"];
const STRING_2_INT_PROPS = ["id", "orderStatusId", "quantity"];


const initialState = {
    isLoading: false,
    cellarers: [],
    orders: [],
    orderItems: [],
    menuId: null,
    errorRowSet: new Set(),
    changes: {},
    updateOrderStatus: null,
}

export const clear = () => {
    return {
        type: CLEAR_SEARCH_ORDERS
    };
}

export const clearOrderInfo = () => {
    return {
        type: CLEAR_ORDER_INFO
    };
}

export const getCellarers = id => {
    return {
        type: SEARCH_ORDER_GET_CELLARERS,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_CELLARERS_URL,
    };
}

export const getOrders = (startDate, endDate) => {
    return {
        type: GET_ORDERS,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_ORDERS_URL(startDate, endDate),
    };
}

export const getMenuInfo = cellarerId => {
    return {
        type: SEARCH_ORDER_GET_MENU_INFO,
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

export const saveItem = (row, error) => {
    return {
        type: SEARCH_ORDERS_SAVE_ITEM,
        row, 
        error
    };
}

export const updateOrder = (id, changes) => {
    return {
        type: SEARCH_ORDERS_UPDATE_ORDER,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: SEARCH_ORDERS_UPDATE_ORDER_URL(id),
        method: "post",
        params: converStringIds2Ints(changes)
    };
}

const converStringIds2Ints = changes => {
    if (changes.itemsToUpdate) {
        StringIds2Ints(changes.itemsToUpdate, INT_2_STRING_PROPS);
    }

    if (changes.itemIdsToDelete) {
        changes.itemIdsToDelete = Array.from(changes.itemIdsToDelete).map(d => parseInt(d));
    }

    return {...changes}
}

export const getOrderItems = id => {
    return {
        type: GET_ORDER_ITEMS,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_ORDER_ITEMS_URL(id)
    };
}

export const batchDelete = selectedRowKeys => {
    return {
        type: SEARCH_ORDER_BATCH_DELETE,
        selectedRowKeys
    }
}

const reducer = (state = initialState, action) => {
    let resultCase = {
        CLEAR_SEARCH_ORDERS: processClear,
        SEARCH_ORDER_GET_CELLARERS: processGetCellarers,
        GET_ORDERS: processGetOrders,
        SEARCH_ORDER_GET_MENU_INFO: processGetMenuInfo,
        ADD_ITEMS: processAddItems,
        SEARCH_ORDERS_SAVE_ITEM: processSaveItem,
        CLEAR_ORDER_INFO: processClearOrderInfo,
        SEARCH_ORDERS_UPDATE_ORDER: processUpdateOrder,
        GET_ORDER_ITEMS: processGetOrderItems,
        SEARCH_ORDER_BATCH_DELETE: processBatchDelete
    }

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
}

const processClear = (state, action) => {
    return {
        isLoading: false,
        orders: []
    };
}

const processClearOrderInfo = (state, action) => {
    return { ...state, orderItems: [], menuId: null, errorRowSet: new Set(), changes: {} };
}

const processGetCellarers = (state, action) => {
    let result = getBaseAxiosResult(state, action);

    if (action.status === SUCCESS && action.payload) {
        result.cellarers = intIds2Strings(action.payload);
    }

    return result;
}

const processGetOrders = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS && action.payload) {
        result.orders = intIds2Strings(action.payload, INT_2_STRING_PROPS);
    }

    return result;
}

const processGetMenuInfo = (state, action) => {
    let result = getBaseAxiosResult(state, action);

    if (action.status === SUCCESS && action.payload) {
        result.menuId = String(action.payload.id);
    }
    
    return result;
}

const processAddItems = (state, action) => {
    let { orderItems } = state;
    const { addedItems } = action;

    if (addedItems && addedItems.length > 0) {
        let newOrders = getIemsFromMenuItems(addedItems);

        if (orderItems.length > 0) {
            pushNewObjectsNoDuplicate(orderItems, newOrders, "liquorId");
        } else {
            orderItems = newOrders;
        }
    }
    
    return { ...state, orderItems };
}

const getIemsFromMenuItems = menuItems => {
    return menuItems.map(m => {
        let item = Object.assign({}, m);

        item.id = "0";
        item.key = `${item.id}_${item.liquorId}`;
        item.menuItemDesc = m.itemDesc;
        delete item.itemDesc;

        return item;
    });
}

const processSaveItem = (state, action) => {
    const { row, error } = action;
    const { orderItems, errorRowSet, changes } = state;
    const newRow = replaceNewObject(orderItems, row, "liquorId");

    changes.itemsToUpdate = addItem2Updates(changes.itemsToUpdate, newRow);
    if(error) {
        errorRowSet.add(row.liquorId);
    } else {
        errorRowSet.delete(row.liquorId);
    }

    return { ...state, orderItems, errorRowSet, changes };
}

const addItem2Updates = (updates, row) => {
    updates = (updates) ? updates : [];
    let index = updates.findIndex(u => {
        if (u.id !== "0") {
            return u.id == row.id;
        } else {
            return u.liquorId == row.liquorId;
        }
    });

    if (index >= 0) {
        let orgRow = updates[index];

        updates.splice(index, 1, {...orgRow, ...row});
    } else {
        updates.push(row);
    }

    return updates;
}

const processUpdateOrder = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS) {
        result = { ...result, orderItems: [], menuId: null, errorRowSet: new Set(), changes: {} };
    }
    result.updateOrderStatus = action.status;
    
    return result;
}

const processGetOrderItems = (state, action) => {
    let result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS) {
        result.orderItems = intIds2Strings(action.payload, INT_2_STRING_PROPS);
        result.orderItems.map(i => i.key = `${i.id}_${i.liquorId}`);
    }
    
    return result;
}

const processBatchDelete = (state, action) => {
    let { orderItems, changes, errorRowSet } = state;
    let { selectedRowKeys } = action;
    let updates = changes.itemsToUpdate;
    let orgDelete = (changes.itemIdsToDelete) ? changes.itemIdsToDelete : new Set();
    let deletedIds = getIdsFromItemKeys(selectedRowKeys);
    
    //delete from error row set
    selectedRowKeys.forEach(id => errorRowSet.delete(id));
    deletedIds.ids.forEach(id => orgDelete.add(id));
    changes.itemIdsToDelete = orgDelete;
    updates = deleteFromUpdates(updates, deletedIds);
    orderItems = orderItems.filter(i => !selectedRowKeys.includes(i.key));
    if (updates && updates.length > 0) changes.itemsToUpdate = updates;

    return { ...state, orderItems, changes, errorRowSet };
}

const deleteFromUpdates = (updates, deletedIds) => {
    return !updates ? updates : updates.filter(u => {
        if (u.id !== "0") {
            return !deletedIds.ids.includes(u.id); 
        } else {
            return !deletedIds.liquorIds.includes(u.liquorId); 
        }
    });
}

const getIdsFromItemKeys = keys => {
    let result = { ids: [], liquorIds: [] };

    keys.forEach(k => {
        let ids = k.split("_");
        if (ids[0] !== "0") {
            result.ids.push(ids[0]);
        } else {
            result.liquorIds.push(ids[1]);
        }
    });

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