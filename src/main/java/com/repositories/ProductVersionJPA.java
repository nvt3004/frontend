package com.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.entities.CartProduct;
import com.entities.ProductVersion;

public interface ProductVersionJPA extends JpaRepository<ProductVersion, Integer> {
	
}
