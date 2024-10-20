import { INCREMENT_CART, DECREMENT_CART, SET_CART_COUNT } from '../actions/cartActions';

const initialState = {
    cartCount: 0
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case INCREMENT_CART:
            return {
                ...state,
                cartCount: state.cartCount + 1
            };
        case DECREMENT_CART:
            return {
                ...state,
                cartCount: state.cartCount > 0 ? state.cartCount - 1 : 0
            };
        case SET_CART_COUNT:
            return {
                ...state,
                cartCount: action.payload 
            };
        default:
            return state;
    }
};

export default cartReducer;
