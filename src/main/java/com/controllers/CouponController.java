package com.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.entities.Coupon;
import com.errors.ApiResponse;
import com.errors.FieldErrorDTO;
import com.errors.InvalidException;
import com.models.CouponCreate;
import com.services.CouponService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

	@Autowired
	private CouponService couponService;

	@PostMapping
	public ResponseEntity<ApiResponse<?>> createCoupon(@Valid @RequestBody CouponCreate couponCreate, BindingResult errors) {
	    List<FieldErrorDTO> fieldErrors = couponService.validateCoupon(couponCreate, errors);

	    if (!fieldErrors.isEmpty()) {
	        ApiResponse<List<FieldErrorDTO>> errorResponse = new ApiResponse<>(
	                HttpStatus.BAD_REQUEST.value(),
	                "Validation failed",
	                fieldErrors
	        );
	        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	    }

	    try {
	        Coupon savedCoupon = couponService.saveCoupon(couponCreate);
	        ApiResponse<Coupon> response = new ApiResponse<>(
	                HttpStatus.OK.value(),
	                "Success",
	                savedCoupon
	        );
	        return new ResponseEntity<>(response, HttpStatus.OK);
	    } catch (Exception e) {
	        ApiResponse<String> errorResponse = new ApiResponse<>(
	                HttpStatus.INTERNAL_SERVER_ERROR.value(),
	                "An error occurred while creating the coupon",
	                e.getMessage()
	        );
	        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	@PutMapping
	public ResponseEntity<ApiResponse<?>> updateCoupon(
			@RequestParam("id") Integer id,
	        @Valid @RequestBody CouponCreate couponCreate,
	        BindingResult errors) {

	    List<FieldErrorDTO> fieldErrors = couponService.validateCoupon(couponCreate, errors);

	    if (!fieldErrors.isEmpty()) {
	        ApiResponse<List<FieldErrorDTO>> errorResponse = new ApiResponse<>(
	                HttpStatus.BAD_REQUEST.value(),
	                "Validation failed",
	                fieldErrors
	        );
	        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	    }

	    try {
	        Coupon updatedCoupon = couponService.updateCoupon(id, couponCreate);
	        ApiResponse<Coupon> response = new ApiResponse<>(
	                HttpStatus.OK.value(),
	                "Success",
	                updatedCoupon
	        );
	        return new ResponseEntity<>(response, HttpStatus.OK);
	    } catch (InvalidException e) {
	        ApiResponse<String> errorResponse = new ApiResponse<>(
	                HttpStatus.NOT_FOUND.value(),
	                "Coupon not found",
	                e.getMessage()
	        );
	        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
	    } catch (Exception e) {
	        ApiResponse<String> errorResponse = new ApiResponse<>(
	                HttpStatus.INTERNAL_SERVER_ERROR.value(),
	                "An error occurred while updating the coupon",
	                e.getMessage()
	        );
	        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

}
