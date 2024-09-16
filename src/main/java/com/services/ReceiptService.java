package com.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

import com.entities.ProductVersion;
import com.entities.Receipt;
import com.entities.ReceiptDetail;
import com.entities.Supplier;
import com.errors.ApiResponse;
import com.errors.FieldErrorDTO;
import com.models.ReceiptCreateDTO;
import com.models.ReceiptDTO;
import com.repositories.ReceiptDetailJPA;
import com.repositories.ReceiptJPA;

@Service
public class ReceiptService {
//
//	@Autowired
//	private WarehousJPA warehousJpa;

	@Autowired
	private ReceiptJPA receiptJpa;

	@Autowired
	private ReceiptDetailJPA receiptDetailJpa;

	@Autowired
	private ProductVersionService productVersionService;

	@Autowired
	private SupplierService supplierService;

	public Optional<Receipt> getWarehousById(int id) {
		return receiptJpa.findById(id);
	}

	public Page<ReceiptDTO> getAllWarehouses(int page, int size) {
	    Pageable pageable = PageRequest.of(page, size);
	    Page<Receipt> receiptPage = receiptJpa.findAll(pageable);

	    List<ReceiptDTO> receiptDTOList = new ArrayList<>();
	    
	    for (Receipt receipt : receiptPage.getContent()) {
	        ReceiptDTO receiptDTO = convertReceipt(receipt);
	        receiptDTOList.add(receiptDTO);
	    }

	    return new PageImpl<>(receiptDTOList, pageable, receiptPage.getTotalElements());
	}



	public ReceiptDTO getWarehouseById(Integer id) {
		Receipt receipt = receiptJpa.findById(id).orElse(null);
		if (receipt == null) {
			return null;
		}
		return convertReceipt(receipt);
	}

	private ReceiptDTO convertReceipt(Receipt receipt) {
		ReceiptDTO receiptDTO = new ReceiptDTO();
		receiptDTO.setReceipt(receipt);

		List<ReceiptDetail> receiptDetails = receipt.getReceiptDetails();
		List<ReceiptDTO.ReceiptDetailDTO> receiptDetailDTOs = new ArrayList<>();

		for (ReceiptDetail detail : receiptDetails) {
			ReceiptDTO.ReceiptDetailDTO dto = receiptDTO.new ReceiptDetailDTO();
			dto.setReceiptDetailId(detail.getReceiptDetailId());
			dto.setQuantity(detail.getQuantity());

			ReceiptDTO.ProductVersionDTO productDTO = receiptDTO.new ProductVersionDTO();
			ProductVersion productVersion = detail.getProductVersion();
			if (productVersion != null) {
				productDTO.setProductVersionId(productVersion.getId());
				productDTO.setProductVersionName(productVersion.getVersionName());
			}
			dto.setProductVersionDTO(productDTO);
			receiptDetailDTOs.add(dto);
		}

		receiptDTO.setReceiptDetailDTO(receiptDetailDTOs);
		receiptDTO.setSupplier(receipt.getSupplier());

		return receiptDTO;
	}

	public List<FieldErrorDTO> validateWarehouse(ReceiptCreateDTO receiptCreateDTO, BindingResult errors) {
	    List<FieldErrorDTO> fieldErrors = new ArrayList<>();

		if (errors.hasErrors()) {
			for (ObjectError error : errors.getAllErrors()) {
				String field = ((FieldError) error).getField();
				String errorMessage = error.getDefaultMessage();
				fieldErrors.add(new FieldErrorDTO(field, errorMessage));
			}
		}

	    return fieldErrors;
	}


	public ApiResponse<?> createReceipt(ReceiptCreateDTO dto) {
		ApiResponse<?> errorResponse = new ApiResponse<>();

		Integer supplierId = dto.getSupplierId();
		BigDecimal totalPrice = BigDecimal.ZERO;

		Optional<Supplier> supp = supplierService.getSupplierById(supplierId);
		if (!supp.isPresent()) {
			errorResponse.setErrorCode(400);
			errorResponse.setMessage("Supplier không tồn tại.");
			return errorResponse;
		}

		Supplier supplier = supp.get();

		Receipt receipt = new Receipt();
		receipt.setSupplier(supplier);
		receipt.setReceiptDate(LocalDateTime.now());
		receiptJpa.save(receipt);

		for (ReceiptCreateDTO.ProductVersionDTO pvDto : dto.getProductVersions()) {
			Integer productVersionId = pvDto.getProductVersionId();
			Integer quantity = pvDto.getQuantity();
			BigDecimal importPrice;

			ProductVersion prodVer = productVersionService.getProductVersionByID(productVersionId);
			if (prodVer == null) {
				errorResponse.setErrorCode(400);
				errorResponse.setMessage("ProductVersion với ID " + productVersionId + " không tồn tại.");
				return errorResponse;
			}

			// Tính tổng giá trị = giá nhập * số lượng
			importPrice = prodVer.getImportPrice();
			BigDecimal productTotalPrice = importPrice.multiply(BigDecimal.valueOf(quantity));
			totalPrice = totalPrice.add(productTotalPrice); // Cộng dồn giá trị

			// Xử lý cập nhật tồn kho cho sản phẩm
			int inventoryProductVersion = prodVer.getQuantity();
			prodVer.setQuantity(inventoryProductVersion + quantity);
			productVersionService.updateProdVerSion(prodVer);

			// Lưu chi tiết phiếu nhập
			ReceiptDetail receiptDetail = new ReceiptDetail();
			receiptDetail.setReceipt(receipt);
			receiptDetail.setProductVersion(prodVer);
			receiptDetail.setQuantity(quantity);
			receiptDetailJpa.save(receiptDetail);

		}

		ApiResponse<?> response = new ApiResponse<>(200, "Warehouse created successfully, total value: " + totalPrice,
				null);
		return response;
	}

}
