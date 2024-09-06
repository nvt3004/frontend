package com.models;

import com.entities.ProductVersion;
import com.entities.Supplier;
import com.entities.Warehous;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseUltraPlusModel {
	private Warehous warehous; 
	private ProductVersion productVersion;
	private Supplier supplier;

}
