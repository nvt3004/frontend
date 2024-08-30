package com.services;

import java.math.BigDecimal;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

import com.entities.Coupon;
import com.entities.UserCoupon;
import com.errors.FieldErrorDTO;
import com.errors.InvalidException;
import com.models.CouponCreate;
import com.models.CouponDTO;
import com.repositories.CouponJPA;
import com.repositories.OrderJPA;
import com.repositories.UserCouponJPA;

@Service
public class CouponService {

	@Autowired
	private CouponJPA couponJpa;

	@Autowired
	private OrderJPA orderJpa;

	@Autowired
	private UserCouponJPA userCouponJpa;

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
			fieldErrors
					.add(new FieldErrorDTO("discount", "Only one discount type (percentage or price) can be applied."));
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

		Coupon existingCoupon = couponJpa.findById(id)
				.orElseThrow(() -> new InvalidException("Coupon with ID " + id + " not found"));

		existingCoupon.setCouponCode(couponCreate.getCouponCode());
		existingCoupon.setDisPercent(couponCreate.getDisPercent());
		existingCoupon.setDisPrice(couponCreate.getDisPrice());
		existingCoupon.setDescription(couponCreate.getDescription());
		existingCoupon.setStartDate(couponCreate.getStartDate());
		existingCoupon.setEndDate(couponCreate.getEndDate());
		existingCoupon.setQuantity(couponCreate.getQuantity());

		return couponJpa.save(existingCoupon);
	}

	public void deleteCoupon(Integer id) {
		if (!couponJpa.existsById(id)) {
			throw new InvalidException("Coupon with ID " + id + " does not exist.");
		}

		if (userCouponJpa.existsByCouponId(id)) {
			throw new InvalidException("This coupon cannot be deleted because it has been used by a user.");
		}

		if (orderJpa.existsByCouponId(id)) {
			throw new InvalidException("This coupon cannot be deleted because it is associated with an order.");
		}

		couponJpa.deleteById(id);
	}

	public Page<CouponDTO> getCoupons(LocalDateTime startDate, LocalDateTime endDate, String discountType,
			Pageable pageable) throws ParseException {

		Page<Coupon> couponPage = couponJpa.findActiveCoupons(startDate, endDate, discountType, pageable);

		List<CouponDTO> couponDTOs = new ArrayList<>();
		for (Coupon coupon : couponPage.getContent()) {
			CouponDTO dto = new CouponDTO();
			dto.setId(coupon.getCouponId());
			dto.setCode(coupon.getCouponCode());
			dto.setDescription(coupon.getDescription());
			dto.setStartDate(coupon.getStartDate());
			dto.setEndDate(coupon.getEndDate());
			dto.setDisPercent(coupon.getDisPercent());
			dto.setDisPrice(coupon.getDisPrice());
			couponDTOs.add(dto);
		}

		return new PageImpl<>(couponDTOs, pageable, couponPage.getTotalElements());
	}

}
