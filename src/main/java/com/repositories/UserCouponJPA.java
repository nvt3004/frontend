package com.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entities.UserCoupon;

public interface UserCouponJPA extends JpaRepository<UserCoupon, Integer>{

}
