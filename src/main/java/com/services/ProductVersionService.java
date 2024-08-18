package com.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.ProductVersion;
import com.repositories.ProductVersionJPA;


@Service
public class ProductVersionService {
	@Autowired
	ProductVersionJPA versionJPA;

	public ProductVersion getProductVersionById(int id) {
		return versionJPA.findById(id).orElse(null);
	}
	
	public boolean isValidProductVersion(ProductVersion version) {	
		if(version !=  null && version.getProduct().isStatus()) {
			return true;
		}
		
		return false;
	}
}
