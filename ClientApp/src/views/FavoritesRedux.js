import { combineReducers } from 'redux';

import favorites from '../components/Favorites/FavoritesEditRedux';
import * as favoritesActions from '../components/Favorites/FavoritesEditRedux';

export const actions = {
    favoritesActions
}

export default combineReducers({
    favorites
});