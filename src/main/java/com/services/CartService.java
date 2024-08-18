package com.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.Cart;
import com.entities.User;
import com.repositories.CartJPA;
import com.repositories.UserJPA;

@Service
public class CartService {
	@Autowired
	CartJPA cartJPA;

	@Autowired
	UserJPA userJPA;

	public Cart addCart(Cart cart) {
		Cart cartTemp = cartJPA.getCartByUser(cart.getUser().getUserId());

		if (cartTemp != null) {
			return cartTemp;
		}

		return cartJPA.save(cart);
	}
}
