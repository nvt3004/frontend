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

    public Optional<ProductVersion> getProductVersionByAttributes(Integer productVersionId, String color, String size) {
        return productVersionJpa.findByProductAttributes(productVersionId, color, size);
    }

    public ProductVersion saveProductVersion(ProductVersion productVersion) {
        return productVersionJpa.save(productVersion);
    }
}