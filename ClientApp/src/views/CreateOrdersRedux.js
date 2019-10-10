import { combineReducers } from 'redux';

import newOrders from '../components/CreateOrders/NewOrdersRedux';
import * as newOrdersActions from '../components/CreateOrders/NewOrdersRedux';
import menu from '../components/Shared/Menu/MenuRedux';
import * as menuActions from '../components/Shared/Menu/MenuRedux';

export const actions = {
    newOrdersActions,
    menuActions
}

export default combineReducers({
    newOrders,
    menu
});