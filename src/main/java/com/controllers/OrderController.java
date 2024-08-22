package com.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.entities.OrderDetail;
import com.entities.OrderStatus;
import com.errors.ApiResponse;
import com.models.AttributeDTO;
import com.models.OrderCreateDTO;
import com.models.OrderDTO;
import com.services.AttributesService;
import com.services.OrderDetailService;
import com.services.OrderService;
import com.services.OrderStatusService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

	@Autowired
	private OrderService orderService;

	@Autowired
	private OrderDetailService orderDetailService;

	@Autowired
	private AttributesService attributeService;

	@Autowired
	private OrderStatusService orderStatusService;

	@PostMapping
	public ResponseEntity<ApiResponse<?>> createOrder(@RequestBody OrderCreateDTO orderCreateDTO) {
		ApiResponse<?> response = orderService.createOrder(orderCreateDTO);
		return ResponseEntity.status(HttpStatus.valueOf(response.getErrorCode())).body(response);
	}

	@GetMapping
	public ResponseEntity<ApiResponse<?>> getAllOrders(@RequestParam(value = "name", required = false) String name,
			@RequestParam(value = "address", required = false) String address,
			@RequestParam(value = "status", required = false) String status,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "5") int size) {

		ApiResponse<PageImpl<OrderDTO>> response = orderService.getAllOrders(name, address, status, page, size);

		return ResponseEntity.status(HttpStatus.valueOf(response.getErrorCode())).body(response);
	}

	@GetMapping("/client")
	public ResponseEntity<ApiResponse<?>> getClientOrders(@RequestParam(value = "name", required = false) String name,
			@RequestParam(value = "address", required = false) String address,
			@RequestParam(value = "status", required = false) String status,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "5") int size) {

		ApiResponse<PageImpl<OrderDTO>> response = orderService.getClientOrders(name, address, status, page, size);

		return ResponseEntity.status(HttpStatus.valueOf(response.getErrorCode())).body(response);
	}

	@GetMapping("/admin")
	public ResponseEntity<ApiResponse<?>> getAdminOrders(@RequestParam(value = "name", required = false) String name,
			@RequestParam(value = "address", required = false) String address,
			@RequestParam(value = "status", required = false) String status,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "5") int size) {

		ApiResponse<PageImpl<OrderDTO>> response = orderService.getAdminOrders(name, address, status, page, size);

		return ResponseEntity.status(HttpStatus.valueOf(response.getErrorCode())).body(response);
	}

//	@GetMapping("/product-version")
//	public ResponseEntity<AttributeDTO> getAttributes(@RequestParam("productVersionId") Integer productVersionId) {
//		if (productVersionId == null) {
//			return ResponseEntity.badRequest().body(null);
//		}
//
//		AttributeDTO attributes = attributeService.getAttributesByProductVersionId(productVersionId);
//		return ResponseEntity.ok(attributes);
//	}

	@GetMapping("/statuses")
	public ResponseEntity<ApiResponse<List<OrderStatus>>> getOrderStatus() {
		List<OrderStatus> orderStatuses = orderStatusService.getAllOrderStatuses();
		ApiResponse<List<OrderStatus>> response = new ApiResponse<>(200, "Order statuses fetched successfully",
				orderStatuses);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/update-order-detail")
	public ResponseEntity<ApiResponse<?>> updateOrderDetail(@RequestParam("orderDetailId") Integer orderDetailId,
			@RequestParam("productId") Integer productId, @RequestParam("colorName") String colorName,
			@RequestParam("sizeName") String sizeName) {

		if (orderDetailId == null || productId == null || colorName == null || sizeName == null) {
			return ResponseEntity.badRequest()
					.body(new ApiResponse<>(400, "Invalid parameters", "Some required parameters are missing."));
		}

		ApiResponse<OrderDetail> response = orderDetailService.updateOrderDetail(orderDetailId, productId, colorName,
				sizeName);

		if (response.getErrorCode() == 200) {
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.status(HttpStatus.valueOf(response.getErrorCode())).body(response);
		}
	}

	@PutMapping("/update-order-detail-quantity")
	public ResponseEntity<ApiResponse<?>> updateOrderDetailQuantity(
			@RequestParam("orderDetailId") Integer orderDetailId, @RequestParam("quantity") Integer quantity) {

		if (orderDetailId == null || quantity == null) {
			return ResponseEntity.badRequest()
					.body(new ApiResponse<>(400, "Invalid parameters", "Some required parameters are missing."));
		}

		ApiResponse<OrderDetail> validationResponse = orderDetailService.validateAndPrepareUpdate(orderDetailId,
				quantity);

		if (validationResponse.getErrorCode() != 200) {
			return ResponseEntity.status(HttpStatus.valueOf(validationResponse.getErrorCode()))
					.body(validationResponse);
		}

		OrderDetail orderDetail = validationResponse.getData();
		OrderDetail updatedOrderDetail = orderDetailService.updateOrderDetailQuantity(orderDetail, quantity);

		return ResponseEntity
				.ok(new ApiResponse<>(200, "Order detail quantity updated successfully", updatedOrderDetail));
	}

	@PutMapping("/update-status")
	public ResponseEntity<ApiResponse<?>> updateOrderStatus(@RequestParam("orderId") int orderId,
			@RequestParam("statusName") String statusName) {

		ApiResponse<?> response = orderService.updateOrderStatus(orderId, statusName);

		if (response.getErrorCode() == 200) {
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.status(HttpStatus.valueOf(response.getErrorCode())).body(response);
		}
	}

	@GetMapping("/order-details")
	public ResponseEntity<ApiResponse<?>> getOrder(@RequestParam Integer orderId) {
		if (orderId == null) {
			ApiResponse<String> response = new ApiResponse<>(400, "Order ID is required", null);
			return ResponseEntity.badRequest().body(response);
		}

		ApiResponse<Map<String, Object>> response = orderService.getOrderDetails(orderId);

		if (response.getErrorCode() == 200) {
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.status(HttpStatus.valueOf(response.getErrorCode())).body(response);
		}
	}

	@DeleteMapping("/remove-orderdetail")
	public ResponseEntity<ApiResponse<?>> deleteOrderDetailsByOrderDetailId(@RequestParam Integer orderId,
			@RequestParam Integer orderDetailId) {

		if (orderId == null || orderDetailId == null) {
			ApiResponse<String> response = new ApiResponse<>(400, "Order ID and Order Detail ID are required", null);
			return ResponseEntity.badRequest().body(response);
		}

		ApiResponse<?> response = orderService.deleteOrderDetail(orderId, orderDetailId);

		return ResponseEntity.status(HttpStatus.valueOf(response.getErrorCode())).body(response);
	}

}
