package com.models;
import java.util.Date;

import lombok.Data;

@Data
public class OrderCreateDTO {
	private int orderId;
	private String fullname;
	private String phone;
	private Integer address;
	private Integer statusId;
	private Integer couponId;
	private Date deliveryDate;
	private Integer paymentMethodId;
	private OrderDetailCreateDTO orderDetailCreateDTO;

}