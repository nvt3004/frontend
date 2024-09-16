package com.models;

import java.util.List;

import com.entities.Receipt;
import com.entities.Supplier;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptDTO {
	private Receipt receipt;
    private Supplier supplier; 
    private List<ReceiptDetailDTO> receiptDetailDTO;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class ReceiptDetailDTO {
    	private Integer receiptDetailId;
    	private Integer quantity;
    	private ProductVersionDTO productVersionDTO;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class ProductVersionDTO {
    	private Integer productVersionId;
    	private String productVersionName;
    }
}
