import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//import './CreateOrders.css';
import BaseView from './BaseView';
import { actions } from './OrdersRedux';
import SearchOrders from '../components/Orders/SearchOrders';

class Orders extends BaseView {
    
    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
    }

    render() {
        const { searchOrders, searchOrdersActions, menu, menuActions } = this.props;

        return (
            <div className="container sub-page" >
                <SearchOrders searchOrdersR={searchOrders} searchOrdersActions={searchOrdersActions}
                    menuR={menu} menuActions={menuActions} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { searchOrders, menu } = state.orders;

    return {
        searchOrders,
        menu,
        baseView: state.baseView
    };
}

function mapDispatchToProps(dispatch) {
    return {
        searchOrdersActions: bindActionCreators(actions.searchOrdersActions, dispatch),
        menuActions: bindActionCreators(actions.menuActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);