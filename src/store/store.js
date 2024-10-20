import { createStore, combineReducers } from 'redux';
import cartReducer from './reducers/cartReducer';
import wishlistReducer from './reducers/wishlistReducer';

const rootReducer = combineReducers({
    cart: cartReducer,
    wishlist: wishlistReducer
});

const store = createStore(rootReducer);

export default store;
