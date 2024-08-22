package com.models;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class OrderDetailProductDetailsDTO {
	private Integer productId;
	private Integer productVersionId;
	private BigDecimal price;
	private Integer quantity;
	private String imageUrl;
	private String description;
	private BigDecimal total;
	private Integer orderDetailId;
	private String color;
	private String size;
	private List<AttributeDTO> attributeDetails;

	public OrderDetailProductDetailsDTO(Integer productId, Integer productVersionId, BigDecimal price, Integer quantity,
			String imageUrl, String description, BigDecimal total, Integer orderDetailId, String color, String size,
			List<AttributeDTO> attributeDetails) {
		this.productId = productId;
		this.productVersionId = productVersionId;
		this.price = price;
		this.quantity = quantity;
		this.imageUrl = imageUrl;
		this.description = description;
		this.total = total;
		this.orderDetailId = orderDetailId;
		this.color = color;
		this.size = size;
		this.attributeDetails = attributeDetails;
	}
}