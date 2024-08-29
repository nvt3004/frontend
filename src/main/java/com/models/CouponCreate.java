package com.models;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CouponCreate {
    @NotNull(message = "Coupon code cannot be null.")
    @Size(min = 1, max = 50, message = "Coupon code must be between 1 and 50 characters.")
    private String couponCode;

    @DecimalMin(value = "0.0", message = "Discount percentage must be a positive value.")
    private BigDecimal disPercent;

    @DecimalMin(value = "0.0", message = "Discount price must be a positive value.")
    private BigDecimal disPrice;

    @Size(max = 255, message = "Description cannot exceed 255 characters.")
    private String description;

    @NotNull(message = "Start date cannot be null.")
    @FutureOrPresent(message = "Start date must be today or in the future.")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date startDate;

    @NotNull(message = "End date cannot be null.")
    @Future(message = "End date must be in the future.")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date endDate;

    @NotNull(message = "Quantity cannot be null.")
    @Min(value = 1, message = "Quantity must be at least 1.")
    private Integer quantity;
    
    public boolean isDatesValid() {
        return startDate != null && endDate != null && startDate.before(endDate);
    }
    public boolean isDiscountValid() {
        return (disPercent == null && disPrice != null) || (disPercent != null && disPrice == null);
    }
    
}

