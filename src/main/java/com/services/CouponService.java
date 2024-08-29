package com.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

import com.entities.Coupon;
import com.errors.FieldErrorDTO;
import com.errors.InvalidException;
import com.models.CouponCreate;
import com.repositories.CouponJPA;

@Service
public class CouponService {

	@Autowired
	private CouponJPA couponJpa;

	public List<FieldErrorDTO> validateCoupon(CouponCreate couponCreate, BindingResult errors) {
	    List<FieldErrorDTO> fieldErrors = new ArrayList<>();

	    if (errors.hasErrors()) {
	        for (ObjectError error : errors.getAllErrors()) {
	            String field = ((FieldError) error).getField();
	            String errorMessage = error.getDefaultMessage();
	            fieldErrors.add(new FieldErrorDTO(field, errorMessage));
	        }
	    }

	    if (!couponCreate.isDatesValid()) {
	        fieldErrors.add(new FieldErrorDTO("startDate", "Start date must be before the end date."));
	    }
	    if (!couponCreate.isDiscountValid()) {
	        fieldErrors.add(new FieldErrorDTO("discount", "Only one discount type (percentage or price) can be applied."));
	    }

	    return fieldErrors;
	}

	public Coupon saveCoupon(CouponCreate couponCreate) {
		Coupon coupon = new Coupon();
		coupon.setCouponCode(couponCreate.getCouponCode());
		BigDecimal disPercent = null;
	    BigDecimal disPrice = null;

	    coupon.setDisPercent(disPercent);
	    coupon.setDisPrice(disPrice);
		coupon.setDescription(couponCreate.getDescription());
		coupon.setStartDate(couponCreate.getStartDate());
		coupon.setEndDate(couponCreate.getEndDate());
		coupon.setQuantity(couponCreate.getQuantity());

		return couponJpa.save(coupon);
	}
	
	public Coupon updateCoupon(Integer id, CouponCreate couponCreate) throws InvalidException {
        // Find the coupon by ID
        Coupon existingCoupon = couponJpa.findById(id)
                .orElseThrow(() -> new InvalidException("Coupon with ID " + id + " not found"));

        // Update the existing coupon with new values
        existingCoupon.setCouponCode(couponCreate.getCouponCode());
        existingCoupon.setDisPercent(couponCreate.getDisPercent());
        existingCoupon.setDisPrice(couponCreate.getDisPrice());
        existingCoupon.setDescription(couponCreate.getDescription());
        existingCoupon.setStartDate(couponCreate.getStartDate());
        existingCoupon.setEndDate(couponCreate.getEndDate());
        existingCoupon.setQuantity(couponCreate.getQuantity());

        // Save the updated coupon back to the database
        return couponJpa.save(existingCoupon);
    }
}
