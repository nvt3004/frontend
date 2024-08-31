package com.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.Coupon;
import com.repositories.CouponJPA;

@Service
public class CouponService {
	@Autowired
	CouponJPA couponJPA;

	public Coupon getCouponByCode(String code) {
		if(code == null) {
			return null;
		}
		
		return couponJPA.getCouponByCode(code);
	}
}
