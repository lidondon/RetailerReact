import { combineReducers } from 'redux';

import createOrdersReducers from '../views/CreateOrdersRedux';

const reducers = {
    createOrders: createOrdersReducers
}

export default combineReducers(reducers);