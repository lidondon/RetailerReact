import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Prompt } from "react-router-dom";

import './CreateOrders.css';

import { actions } from './CreateOrdersRedux';
import NewOrders from '../components/CreateOrders/NewOrders';

class CreateOrders extends Component {

    render() {
        const { newOrders, newOrdersActions, menu, menuActions } = this.props;

        return (
            <div className="view sub-page" >
                <Prompt when={false} message={location => "尚未存擋，確定要離開？"} />
                <NewOrders newOrdersR={newOrders} newOrdersActions={newOrdersActions} menuR={menu} menuActions={menuActions} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { newOrders, menu } = state.createOrders;

    return {
        newOrders,
        menu
    };
}

function mapDispatchToProps(dispatch) {
    return {
        newOrdersActions: bindActionCreators(actions.newOrdersActions, dispatch),
        menuActions: bindActionCreators(actions.menuActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrders);