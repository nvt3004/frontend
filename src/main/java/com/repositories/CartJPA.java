package com.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.entities.Cart;

public interface CartJPA extends JpaRepository<Cart, Integer> {
	@Query("SELECT o FROM Cart o WHERE o.user.userId=:userId")
	public Cart getCartByUser(@Param("userId") int userId);
}
