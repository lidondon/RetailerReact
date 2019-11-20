import { combineReducers } from 'redux';

import createOrdersReducers from '../views/CreateOrdersRedux';
import ordersReducers from '../views/OrdersRedux';
import favoritesReducers from '../views/FavoritesRedux';
import loginReducers from '../views/LoginRedux';
import baseViewReducers from '../views/BaseViewRedux';

const reducers = {
    createOrders: createOrdersReducers,
    orders: ordersReducers,
    favorites: favoritesReducers,
    login: loginReducers,
    baseView: baseViewReducers
}

export default combineReducers(reducers);