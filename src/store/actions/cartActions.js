export const INCREMENT_CART = 'INCREMENT_CART';
export const DECREMENT_CART = 'DECREMENT_CART';
export const SET_CART_COUNT = 'SET_CART_COUNT';

export const incrementCart = () => {
    return {
        type: INCREMENT_CART
    };
};

export const decrementCart = () => {
    return {
        type: DECREMENT_CART
    };
};
export const setCartCount = (count) => {
    return {
        type: SET_CART_COUNT,
        payload: count
    };
};
