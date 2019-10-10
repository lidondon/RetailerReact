import { combineReducers } from 'redux';

import searchOrders from '../components/Orders/SearchOrdersRedux';
import * as searchOrdersActions from '../components/Orders/SearchOrdersRedux';
import menu from '../components/Shared/Menu/MenuRedux';
import * as menuActions from '../components/Shared/Menu/MenuRedux';

export const actions = {
    menuActions,
    searchOrdersActions
}

export default combineReducers({
    menu,
    searchOrders
});