package com.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.UserCoupon;
import com.repositories.UserCouponJPA;

@Service
public class UserCouponService {
	@Autowired
	UserCouponJPA userCouponJPA;

	public UserCoupon createUserCoupon(UserCoupon userCoupon) {
		return userCouponJPA.save(userCoupon);
	}
	
	public boolean deleteUserCoupon(UserCoupon userCoupon) {
		try {
			userCouponJPA.delete(userCoupon);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
}
