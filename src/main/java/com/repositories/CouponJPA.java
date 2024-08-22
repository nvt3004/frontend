package com.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entities.Coupon;

public interface CouponJPA extends JpaRepository<Coupon, Integer> {

}
