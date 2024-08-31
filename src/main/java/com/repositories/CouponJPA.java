package com.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.entities.Coupon;

public interface CouponJPA extends JpaRepository<Coupon, Integer> {

	@Query("SELECT o FROM Coupon o WHERE o.couponCode =:code")
	public Coupon getCouponByCode(@Param("code") String code);
}
