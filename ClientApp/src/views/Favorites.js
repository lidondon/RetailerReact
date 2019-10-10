import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//import { isEmptyObject } from '../utilities/util';
import { actions } from './FavoritesRedux';
import FavoriteEdit from '../components/Favorites/FavoritesEdit';

class CreateOrders extends Component {
    render() {
        const { favorites, favoritesActions } = this.props;

        return (
            <div className="view" >
                <FavoriteEdit favoritesR={favorites} favoritesActions={favoritesActions} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { favorites } = state.favorites;

    return {
        favorites
    };
}

function mapDispatchToProps(dispatch) {
    return {
        favoritesActions: bindActionCreators(actions.favoritesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrders);