package com.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.errors.ApiResponse;
import com.errors.FieldErrorDTO;
import com.models.ReceiptCreateDTO;
import com.models.ReceiptDTO;
import com.services.ReceiptService;
import com.utils.ValidationUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/receipt")
public class ReceiptController {

	@Autowired
	private ReceiptService warehouseService;

	@GetMapping
	public ResponseEntity<ApiResponse<?>> getAllWarehouses(@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "5") int size) {

		Page<ReceiptDTO> receiptDTOPage = warehouseService.getAllWarehouses(page, size);

		if (receiptDTOPage.isEmpty()) {
			ApiResponse<List<ReceiptDTO>> response = new ApiResponse<>(404, "No receipts found", null);
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}

		PageImpl<ReceiptDTO> receiptDTOList = new PageImpl<>(receiptDTOPage.getContent(), receiptDTOPage.getPageable(),
				receiptDTOPage.getTotalElements());

		ApiResponse<?> response = new ApiResponse<>(200, "Success", receiptDTOList);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/receipt-detail")
	public ResponseEntity<ApiResponse<ReceiptDTO>> getWarehouseById(@RequestParam Integer id) {
		ReceiptDTO receiptDTO = warehouseService.getWarehouseById(id);

		if (receiptDTO == null) {
			ApiResponse<ReceiptDTO> response = new ApiResponse<>(404, "Not Found", null);
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}

		ApiResponse<ReceiptDTO> response = new ApiResponse<>(200, "Success", receiptDTO);
		return ResponseEntity.ok(response);
	}

	@PostMapping
	public ResponseEntity<ApiResponse<?>> createReceipt(@Valid @RequestBody ReceiptCreateDTO receiptCreateDTO,
			BindingResult errors) {

		ApiResponse<?> errorResponse = new ApiResponse<>();
		List<FieldErrorDTO> validationErrors = ValidationUtil.validateErrors(errors);
		if (!validationErrors.isEmpty()) {
			errorResponse = new ApiResponse<>(400, "Validation failed.", validationErrors);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
		}

		ApiResponse<?> response = warehouseService.createReceipt(receiptCreateDTO);
		return ResponseEntity.ok(response);
	}
}
