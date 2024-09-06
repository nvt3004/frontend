package com.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.entities.Supplier;

@Repository
public interface SupplierJPA extends JpaRepository<Supplier, Integer> {
}
