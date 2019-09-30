import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import 'antd/dist/antd.css';
import './app.css'

import AxiosMiddleware from './middlewares/AxiosMiddleware';
import reducers from './redux/rootReducers';
import Frame from './layouts/Frame';
import Home from './views/Home';
import Login from './views/Login';
import CreateOrders from './views/CreateOrders';
import Orders from './views/Orders';

const store = createStore(reducers, applyMiddleware(AxiosMiddleware));

class App extends React.Component {
    render () {
        return (
            <HashRouter>
                <div className="background text">
                    <Frame />
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/orders/new" component={CreateOrders}/>
                    <Route exact path="/orders" component={Orders}/>
                </div>
            </HashRouter>
        );
    }
}

render(
    <Provider store={store}>
        <App />
    </Provider>
, document.getElementById('app'));