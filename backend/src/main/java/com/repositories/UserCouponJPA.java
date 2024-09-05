package com.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.entities.UserCoupon;

public interface UserCouponJPA extends JpaRepository<UserCoupon, Integer> {

    @Query("SELECT CASE WHEN COUNT(uc) > 0 THEN true ELSE false END FROM UserCoupon uc WHERE uc.coupon.id = :couponId")
    boolean existsByCouponId(@Param("couponId") Integer couponId);
}