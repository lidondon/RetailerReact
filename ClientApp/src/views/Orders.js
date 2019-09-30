import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//import './CreateOrders.css';

// import { actions } from './CreateOrdersRedux';
// import NewOrders from '../components/CreateOrders/NewOrders';

class Orders extends Component {

    render() {
        const { newOrders, newOrdersActions, menu, menuActions } = this.props;

        return (
            <div className="container sub-page" >
                Orders
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { newOrders, menu } = state.createOrders;

    return {
        // newOrders,
        // menu
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // newOrdersActions: bindActionCreators(actions.newOrdersActions, dispatch),
        // menuActions: bindActionCreators(actions.menuActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);