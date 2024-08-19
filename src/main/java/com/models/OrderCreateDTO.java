package com.models;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

@Data
public class OrderCreateDTO {
	private int orderId;
	private String fullname;
	private String phone;
	private BigDecimal disPercent;
	private BigDecimal disPrice;
	private Date orderDate;
	private String address;
	private Integer statusId;
	private Integer couponId;
	private Date deliveryDate;
	private boolean paymentStatus;
	private String paymentMethod;
	private OrderDetailCreateDTO orderDetailCreateDTO;

	public OrderCreateDTO(int orderId, String fullname, String phone, BigDecimal disPercent, BigDecimal disPrice,
			Date orderDate, String address, Integer statusId, Integer couponId, Date deliveryDate,
			boolean paymentStatus, String paymentMethod, OrderDetailCreateDTO orderDetailCreateDTO) {
		this.orderId = orderId;
		this.fullname = fullname;
		this.phone = phone;
		this.disPercent = disPercent;
		this.disPrice = disPrice;
		this.orderDate = orderDate;
		this.address = address;
		this.statusId = statusId;
		this.couponId = couponId;
		this.deliveryDate = deliveryDate;
		this.paymentStatus = paymentStatus;
		this.paymentMethod = paymentMethod;
		this.orderDetailCreateDTO = orderDetailCreateDTO;
	}

}