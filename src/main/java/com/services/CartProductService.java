package com.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.CartProduct;
import com.entities.ProductVersion;
import com.repositories.CartProductJPA;
import com.repositories.ProductVersionJPA;
import com.responsedto.CartDetailResponse;
import com.responsedto.ProductCartResponse;
import com.responsedto.VersionCart;

@Service
public class CartProductService {
	@Autowired
	CartProductJPA cartProductJPA;
	
	
	public ProductCartResponse addProductToCart(CartProduct cartProduct) {
		int versionId = cartProduct.getProductVersionBean().getId();
		int userId = cartProduct.getCart().getUser().getUserId();
		CartProduct cartSaved;
		
		CartProduct cartProductTemp = cartProductJPA.getVersionInCartByUser(versionId, userId);
		
		if(cartProductTemp != null) {
			cartProductTemp.setQuantity(cartProductTemp.getQuantity()+cartProduct.getQuantity());
			cartSaved = cartProductJPA.save(cartProductTemp);
		}else {
			cartSaved = cartProductJPA.save(cartProduct);
		}
		
		ProductCartResponse cartResponse = new ProductCartResponse();
		VersionCart versionCart = new VersionCart(userId, cartSaved.getProductVersionBean().getVersionName(), cartSaved.getProductVersionBean().getRetailPrice());
		CartDetailResponse cartDetail = new CartDetailResponse(versionCart,cartSaved.getQuantity());
		
		cartResponse.setCartId(cartSaved.getCart().getCartId());
		cartResponse.setUserId(cartSaved.getCart().getUser().getUserId());
		cartResponse.setCartItem(cartDetail);
		
		return cartResponse;
	}
}
