package com.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.entities.Attribute;

public interface AttributeJPA extends JpaRepository<Attribute, Integer> {

	@Query("SELECT o.attributeOption.attribute FROM AttributeOptionsVersion o WHERE o.productVersion.product.productId =:productId")
	public List<Attribute> getAttributeByProduct(@Param("productId") int productId);
}
