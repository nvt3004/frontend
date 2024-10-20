export const INCREMENT_WISHLIST = 'INCREMENT_WISHLIST';
export const DECREMENT_WISHLIST = 'DECREMENT_WISHLIST';
export const SET_WISHLIST_COUNT = 'SET_WISHLIST_COUNT';

export const incrementWishlist = () => {
    return {
        type: INCREMENT_WISHLIST
    };
};

export const decrementWishlist = () => {
    return {
        type: DECREMENT_WISHLIST
    };
};


export const setWishlistCount = (count) => {
    return {
        type: SET_WISHLIST_COUNT,
        payload: count
    };
};
