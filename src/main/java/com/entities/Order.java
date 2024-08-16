package com.entities;

import java.io.Serializable;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;


/**
 * The persistent class for the orders database table.
 * 
 */
@Entity
@Table(name="orders")
@NamedQuery(name="Order.findAll", query="SELECT o FROM Order o")
public class Order implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="order_id")
	private int orderId;

	private String address;

	@Column(name="coupon_id")
	private int couponId;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="delivery_date")
	private Date deliveryDate;

	@Column(name="dis_percent")
	private BigDecimal disPercent;

	@Column(name="dis_price")
	private BigDecimal disPrice;

	private String fullname;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="order_date")
	private Date orderDate;

	@Column(name="payment_status")
	private byte paymentStatus;

	private String phone;

	//bi-directional many-to-one association to OrderDetail
	@OneToMany(mappedBy="order")
	private List<OrderDetail> orderDetails;

	//bi-directional many-to-one association to OrderHistory
	@OneToMany(mappedBy="order")
	private List<OrderHistory> orderHistories;

	//bi-directional many-to-one association to OrderStatus
	@ManyToOne
	@JoinColumn(name="status_id")
	private OrderStatus orderStatus;

	//bi-directional many-to-one association to User
	@ManyToOne
	@JoinColumn(name="user_id")
	private User user;

	//bi-directional many-to-one association to Payment
	@OneToMany(mappedBy="order")
	private List<Payment> payments;

	public Order() {
	}

	public int getOrderId() {
		return this.orderId;
	}

	public void setOrderId(int orderId) {
		this.orderId = orderId;
	}

	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public int getCouponId() {
		return this.couponId;
	}

	public void setCouponId(int couponId) {
		this.couponId = couponId;
	}

	public Date getDeliveryDate() {
		return this.deliveryDate;
	}

	public void setDeliveryDate(Date deliveryDate) {
		this.deliveryDate = deliveryDate;
	}

	public BigDecimal getDisPercent() {
		return this.disPercent;
	}

	public void setDisPercent(BigDecimal disPercent) {
		this.disPercent = disPercent;
	}

	public BigDecimal getDisPrice() {
		return this.disPrice;
	}

	public void setDisPrice(BigDecimal disPrice) {
		this.disPrice = disPrice;
	}

	public String getFullname() {
		return this.fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public Date getOrderDate() {
		return this.orderDate;
	}

	public void setOrderDate(Date orderDate) {
		this.orderDate = orderDate;
	}

	public byte getPaymentStatus() {
		return this.paymentStatus;
	}

	public void setPaymentStatus(byte paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public List<OrderDetail> getOrderDetails() {
		return this.orderDetails;
	}

	public void setOrderDetails(List<OrderDetail> orderDetails) {
		this.orderDetails = orderDetails;
	}

	public OrderDetail addOrderDetail(OrderDetail orderDetail) {
		getOrderDetails().add(orderDetail);
		orderDetail.setOrder(this);

		return orderDetail;
	}

	public OrderDetail removeOrderDetail(OrderDetail orderDetail) {
		getOrderDetails().remove(orderDetail);
		orderDetail.setOrder(null);

		return orderDetail;
	}

	public List<OrderHistory> getOrderHistories() {
		return this.orderHistories;
	}

	public void setOrderHistories(List<OrderHistory> orderHistories) {
		this.orderHistories = orderHistories;
	}

	public OrderHistory addOrderHistory(OrderHistory orderHistory) {
		getOrderHistories().add(orderHistory);
		orderHistory.setOrder(this);

		return orderHistory;
	}

	public OrderHistory removeOrderHistory(OrderHistory orderHistory) {
		getOrderHistories().remove(orderHistory);
		orderHistory.setOrder(null);

		return orderHistory;
	}

	public OrderStatus getOrderStatus() {
		return this.orderStatus;
	}

	public void setOrderStatus(OrderStatus orderStatus) {
		this.orderStatus = orderStatus;
	}

	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<Payment> getPayments() {
		return this.payments;
	}

	public void setPayments(List<Payment> payments) {
		this.payments = payments;
	}

	public Payment addPayment(Payment payment) {
		getPayments().add(payment);
		payment.setOrder(this);

		return payment;
	}

	public Payment removePayment(Payment payment) {
		getPayments().remove(payment);
		payment.setOrder(null);

		return payment;
	}

}