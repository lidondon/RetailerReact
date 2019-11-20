import 'antd/dist/antd.css';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import './app.css'
import Frame from './layouts/Frame';
import Home from './views/Home';
import Login from './views/Login';
import CreateOrders from './views/CreateOrders';
import Orders from './views/Orders';
import Favorites from './views/Favorites';
import { isLogin } from './utilities/authentication';
import Store from './redux/store';

class App extends React.Component {
    render () {
        return (
            <HashRouter>
                {/* <div className="background text"> */}
                <div>
                    <Frame />
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/login" component={Login}/>
                    <PrivateRoute exact path="/orders/new" component={CreateOrders}/>
                    <PrivateRoute exact path="/orders" component={Orders}/>
                    <PrivateRoute exact path="/favorites" component={Favorites}/>
                </div>
            </HashRouter>
        );
    }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => isLogin()  ? <Component {...props} /> : <Redirect to='/login' />} />
)

render(
    <Provider store={Store}>
        <App />
    </Provider>
, document.getElementById('app'));