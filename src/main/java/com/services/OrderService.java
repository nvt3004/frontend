package com.services;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.entities.Order;
import com.entities.OrderDetail;
import com.entities.OrderStatus;
import com.entities.ProductVersion;
import com.errors.ApiResponse;
import com.models.OrderDTO;
import com.models.OrderDetailDTO;
import com.repositories.OrderDetailJPA;
import com.repositories.OrderJPA;
import com.repositories.OrderStatusJPA;
import com.repositories.ProductVersionJPA;

@Service
public class OrderService {
	@Autowired
	private OrderJPA orderJpa;

	@Autowired
	private OrderStatusJPA orderStatusJpa;

	@Autowired
	ProductVersionJPA productVersionJpa;

	@Autowired
	private OrderDetailJPA orderDetailJpa;

	@Autowired
	private OrderUtilsService orderUtilsService;

	@Autowired
	private OrderDetailService orderDetailService;

	public ApiResponse<PageImpl<OrderDTO>> getOrders(String name, String address, String status, int page, int size) {
		if (name == null) {
			name = "";
		}
		if (address == null) {
			address = "";
		}
		if (status == null) {
			status = "";
		}

		Pageable pageable = PageRequest.of(page, size);
		Page<Order> ordersPage = orderJpa.findOrdersByCriteria(name, address, status, pageable);

		if (ordersPage.isEmpty()) {
			return new ApiResponse<>(404, "No orders found", null);
		}

		List<OrderDTO> orderDtos = ordersPage.stream().map(this::createOrderDTO).collect(Collectors.toList());
		PageImpl<OrderDTO> resultPage = new PageImpl<>(orderDtos, pageable, ordersPage.getTotalElements());
		return new ApiResponse<>(200, "Orders fetched successfully", resultPage);
	}

	private OrderDTO createOrderDTO(Order order) {
		BigDecimal total = orderUtilsService.calculateOrderTotal(order);
		String paymentMethod = orderUtilsService.getPaymentMethod(order);
		String numberPhone = orderUtilsService.getPhoneNumber(order);

		String statusName = order.getOrderStatus().getStatusName();
		return new OrderDTO(order.getOrderId(), order.getAddress(), order.getCouponId(), order.getDeliveryDate(),
				order.getFullname(), order.getOrderDate(), order.getPaymentStatus(), order.getPhone(), statusName,
				total, paymentMethod, numberPhone);
	}

	public ApiResponse<Map<String, Object>> getOrderDetails(Integer orderId) {
		List<OrderDetail> orderDetailList = orderDetailJpa.findByOrderDetailByOrderId(orderId);

		if (orderDetailList == null || orderDetailList.isEmpty()) {
			return new ApiResponse<>(404, "Order details not found", null);
		}

		OrderDetailDTO orderDetailDTO = orderDetailService.convertToOrderDetailDTO(orderDetailList);

		Map<String, Object> responseMap = new HashMap<>();
		responseMap.put("orderDetail", Collections.singletonList(orderDetailDTO));

		return new ApiResponse<>(200, "Order details fetched successfully", responseMap);
	}

	public ApiResponse<?> updateOrderStatus(int orderId, String statusName) {
		if (statusName == null || statusName.isEmpty()) {
			return new ApiResponse<>(400, "Invalid status name", "Status name is required.");
		}

		Optional<OrderStatus> newOrderStatus = orderStatusJpa.findByStatusName(statusName);
		if (newOrderStatus.isEmpty()) {
			return new ApiResponse<>(400, "Invalid status name", "The provided status name does not exist.");
		}

		Optional<Order> updatedOrder = orderJpa.findById(orderId);
		if (updatedOrder.isEmpty()) {
			return new ApiResponse<>(404, "Order not found", "The order with the provided ID does not exist.");
		}

		Order order = updatedOrder.get();
		if (isOrderStatusChanged(order, statusName)) {
			order.setOrderStatus(newOrderStatus.get());
			orderJpa.save(order);

			if ("Processing".equalsIgnoreCase(statusName)) {
				updateProductVersionsForOrder(order.getOrderDetails());
			} else if ("Cancelled".equalsIgnoreCase(statusName)) {
				revertProductVersionsForCancelledOrder(order.getOrderDetails());
			}
		}

		return new ApiResponse<>(200, "Order status updated successfully", null);
	}

	private boolean isOrderStatusChanged(Order order, String statusName) {
		return !statusName.equalsIgnoreCase(order.getOrderStatus().getStatusName());
	}

	private void updateProductVersionsForOrder(List<OrderDetail> orderDetailList) {
		for (OrderDetail orderDetail : orderDetailList) {
			if (!orderDetail.getOrder().getOrderStatus().getStatusName().equalsIgnoreCase("Processing")) {
				Integer orderDetailProductQuantity = orderDetail.getQuantity();
				List<ProductVersion> productVersionList = productVersionJpa
						.findProductVersionById(orderDetail.getProductVersionBean().getId());
				for (ProductVersion productVersion : productVersionList) {
					Integer productVersionQuantity = productVersion.getQuantity();
					Integer newProductVersionQuantity = productVersionQuantity - orderDetailProductQuantity;
					productVersion.setQuantity(newProductVersionQuantity);
					productVersionJpa.save(productVersion);
				}
			}
		}
	}

	private void revertProductVersionsForCancelledOrder(List<OrderDetail> orderDetailList) {
		for (OrderDetail orderDetail : orderDetailList) {
			Integer orderDetailProductQuantity = orderDetail.getQuantity();
			List<ProductVersion> productVersionList = productVersionJpa
					.findProductVersionById(orderDetail.getProductVersionBean().getId());
			for (ProductVersion productVersion : productVersionList) {
				Integer productVersionQuantity = productVersion.getQuantity();
				Integer newProductVersionQuantity = productVersionQuantity + orderDetailProductQuantity;
				productVersion.setQuantity(newProductVersionQuantity);
				productVersionJpa.save(productVersion);
			}
		}
	}

	public ApiResponse<?> deleteOrderDetail(Integer orderId, Integer orderDetailId) {
		try {
			Optional<Order> optionalOrder = orderJpa.findById(orderId);
			if (optionalOrder.isEmpty()) {
				return new ApiResponse<>(404, "Order not found", null);
			}

			Order order = optionalOrder.get();
			String status = order.getOrderStatus().getStatusName();

			List<String> restrictedStatuses = Arrays.asList("Processing", "Shipped", "Delivered", "Cancelled");

			if (restrictedStatuses.contains(status)) {
				return new ApiResponse<>(400, "Cannot delete order details for an order with status " + status, null);
			}

			int rowsAffected = orderDetailJpa.deleteOrderDetailsByOrderDetailId(orderDetailId);

			if (rowsAffected != 0) {
				return new ApiResponse<>(200, "Product deleted successfully.", null);
			} else {
				return new ApiResponse<>(404, "OrderDetail with ID " + orderDetailId + " not found.", null);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ApiResponse<>(500, "An error occurred while deleting the OrderDetail. Please try again.", null);
		}
	}
}
