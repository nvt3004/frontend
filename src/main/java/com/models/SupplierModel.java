package com.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierModel {
	  private int supplierId;
	    private String address;
	    private String contactName;
	    private String email;
	    private boolean isActive;
	    private String phone;
	    private String supplierName;
}
