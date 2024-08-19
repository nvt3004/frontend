package com.models;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class OrderDetailCreateDTO {

	private List<Integer> productVersionId;
	private Integer quantity;
	private BigDecimal price;

	public OrderDetailCreateDTO(List<Integer> productVersionId, Integer quantity, BigDecimal price) {
		this.productVersionId = productVersionId;
		this.quantity = quantity;
		this.price = price;
	}

}
