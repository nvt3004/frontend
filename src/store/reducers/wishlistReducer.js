import {
  INCREMENT_WISHLIST,
  DECREMENT_WISHLIST,
  SET_WISHLIST_COUNT,
} from "../actions/wishlistActions";

const initialState = {
  wishlistCount: 0,
};

const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_WISHLIST:
      return {
        ...state,
        wishlistCount: state.wishlistCount + 1,
      };
    case DECREMENT_WISHLIST:
      return {
        ...state,
        wishlistCount: state.wishlistCount > 0 ? state.wishlistCount - 1 : 0,
      };
    case SET_WISHLIST_COUNT:
      return {
        ...state,
        wishlistCount: action.payload,
      };
    default:
      return state;
  }
};

export default wishlistReducer;
