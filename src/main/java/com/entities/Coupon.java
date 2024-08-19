package com.entities;

import java.io.Serializable;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;


/**
 * The persistent class for the coupons database table.
 * 
 */
@Entity
@Table(name="coupons")
@NamedQuery(name="Coupon.findAll", query="SELECT c FROM Coupon c")
public class Coupon implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="coupon_id")
	private int couponId;

	@Column(name="coupon_code")
	private String couponCode;
	
	@OneToMany(mappedBy="coupon", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

	@Lob
	private String description;

	@Column(name="dis_percent")
	private BigDecimal disPercent;

	@Column(name="dis_price")
	private BigDecimal disPrice;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="end_date")
	private Date endDate;

	private int quantity;

	@Column(name="ref_percent")
	private BigDecimal refPercent;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="start_date")
	private Date startDate;

	private byte status;

	//bi-directional many-to-one association to UserCoupon
	@OneToMany(mappedBy="coupon")
	private List<UserCoupon> userCoupons;

	public Coupon() {
	}

	public int getCouponId() {
		return this.couponId;
	}

	public void setCouponId(int couponId) {
		this.couponId = couponId;
	}

	public String getCouponCode() {
		return this.couponCode;
	}

	public void setCouponCode(String couponCode) {
		this.couponCode = couponCode;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	public Date getEndDate() {
		return this.endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public int getQuantity() {
		return this.quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public BigDecimal getRefPercent() {
		return this.refPercent;
	}

	public void setRefPercent(BigDecimal refPercent) {
		this.refPercent = refPercent;
	}

	public Date getStartDate() {
		return this.startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public byte getStatus() {
		return this.status;
	}

	public void setStatus(byte status) {
		this.status = status;
	}

	public List<UserCoupon> getUserCoupons() {
		return this.userCoupons;
	}

	public void setUserCoupons(List<UserCoupon> userCoupons) {
		this.userCoupons = userCoupons;
	}

	public UserCoupon addUserCoupon(UserCoupon userCoupon) {
		getUserCoupons().add(userCoupon);
		userCoupon.setCoupon(this);

		return userCoupon;
	}

	public UserCoupon removeUserCoupon(UserCoupon userCoupon) {
		getUserCoupons().remove(userCoupon);
		userCoupon.setCoupon(null);

		return userCoupon;
	}

}