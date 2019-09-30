import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Prompt } from "react-router-dom";

import { isEmptyObject } from '../utilities/util';
import Items from '../components/Menu/Items';
import { actions } from './MenuRedux';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillUnmount() {
        this.props.itemsActions.clear();
        this.props.liquorsActions.clear();
    }

    isChanged = () => {
        const { changes } = this.props.items; 
        const { itemsToUpdate, itemsidToDelete } = changes;

        return !isEmptyObject(changes) &&
            (!isEmptyObject(itemsToUpdate) || (!isEmptyObject(itemsidToDelete) && itemsidToDelete.length > 0));
    }

    render() {
        const { items, liquors, itemsActions, liquorsActions } = this.props; 
        
        return (
            <div className="container">
                <Prompt when={this.isChanged()} message={location => "尚未存擋，確定要離開？"} />
                <Items menuId={this.props.match.params.id}
                    itemsR={items}
                    itemsActions={itemsActions}
                    liquorsR={liquors}
                    liquorsActions={liquorsActions}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        items: state.menu.items,
        liquors: state.menu.liquors
    };
}

function mapDispatchToProps(dispatch) {
    return {
        itemsActions: bindActionCreators(actions.itemsActions, dispatch),
        liquorsActions: bindActionCreators(actions.liquorsActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);