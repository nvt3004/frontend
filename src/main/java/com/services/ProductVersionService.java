package com.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.ProductVersion;
import com.repositories.ProductVersionJPA;

@Service
public class ProductVersionService {

	@Autowired
    private ProductVersionJPA productVersionJpa;

    public Optional<ProductVersion> getProductVersionByAttributes(Integer productVersionId, Integer colorId, Integer sizeId) {
        return productVersionJpa.findByProductAttributes(productVersionId, colorId, sizeId);
    }
}