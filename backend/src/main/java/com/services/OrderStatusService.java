package com.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.OrderStatus;
import com.repositories.OrderStatusJPA;

@Service
public class OrderStatusService {

    @Autowired
    private OrderStatusJPA orderStatusJpa;

    public List<OrderStatus> getAllOrderStatuses() {
        return orderStatusJpa.findAll();
    }
}
