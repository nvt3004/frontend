package com.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.Product;
import com.repositories.ProductJPA;


@Service
public class ProductService {

	@Autowired
	private ProductJPA productJpa;

	public Product saveProduct(Product product) {
		return productJpa.save(product);
	}

	public Product findProductById(Integer productId) {
        Optional<Product> product = productJpa.findById(productId);
        if (product.isPresent()) {
            return product.get();
        } else {
            throw new RuntimeException("Product not found with id: " + productId);
        }
    }
}
