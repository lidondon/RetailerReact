import { combineReducers } from 'redux';

import createOrdersReducers from '../views/CreateOrdersRedux';
import ordersReducers from '../views/OrdersRedux';
import favoritesReducers from '../views/FavoritesRedux';

const reducers = {
    createOrders: createOrdersReducers,
    orders: ordersReducers,
    favorites: favoritesReducers
}

export default combineReducers(reducers);