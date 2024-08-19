package com.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.entities.Order;
import com.entities.OrderStatus;

public interface OrderJPA extends JpaRepository<Order, Integer> {

	@Query("SELECT o FROM Order o "
	        + "WHERE o.isAdminOrder = false AND "
	        + "(:name IS NULL OR :name = '' OR o.fullname LIKE %:name%) AND "
	        + "(:address IS NULL OR :address = '' OR o.address LIKE %:address%) AND "
	        + "(:status IS NULL OR :status = '' OR o.orderStatus.statusName = :status) "
	        + "ORDER BY o.orderStatus.sortOrder ASC")
	Page<Order> findOrdersClientByCriteria(@Param("name") String name, @Param("address") String address,
	        @Param("status") String status, Pageable pageable);


	@Query("SELECT o FROM Order o "
	        + "WHERE o.isAdminOrder = true AND "
	        + "(:name IS NULL OR :name = '' OR o.fullname LIKE %:name%) AND "
	        + "(:address IS NULL OR :address = '' OR o.address LIKE %:address%) AND "
	        + "(:status IS NULL OR :status = '' OR o.orderStatus.statusName = :status) "
	        + "ORDER BY o.orderStatus.sortOrder ASC")
	Page<Order> findOrdersAdminByCriteria(@Param("name") String name, @Param("address") String address,
	        @Param("status") String status, Pageable pageable);


	@Transactional
	@Modifying
	@Query("UPDATE Order o SET o.orderStatus = :newOrderStatus WHERE o.orderId = :orderId")
	int updateOrderStatus(@Param("orderId") int orderId, @Param("newOrderStatus") OrderStatus newOrderStatus);
}
