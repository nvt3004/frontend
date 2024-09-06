package com.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.Warehous;
import com.repositories.WarehousJPA;

@Service
public class WarehousService {

    @Autowired
    private WarehousJPA warehousJpa;

    public List<Warehous> getAllWarehouses() {
        return warehousJpa.findAll();
    }

    public Optional<Warehous> getWarehousById(int id) {
        return warehousJpa.findById(id);
    }

    public Warehous createWarehous(Warehous warehous) {
        return warehousJpa.save(warehous);
    }

}
