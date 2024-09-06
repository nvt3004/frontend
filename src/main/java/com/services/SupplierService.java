package com.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.Supplier;
import com.models.SupplierModel;
import com.repositories.SupplierJPA;

@Service
public class SupplierService {

    @Autowired
    private SupplierJPA supplierRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Optional<Supplier> getSupplierById(int id) {
        return supplierRepository.findById(id);
    }

    public Supplier createSupplier(SupplierModel supplierDetails) {
        Supplier supplier = new Supplier();
        supplier.setSupplierId(supplierDetails.getSupplierId());
        supplier.setAddress(supplierDetails.getAddress());
        supplier.setContactName(supplierDetails.getContactName());
        supplier.setEmail(supplierDetails.getEmail());
        supplier.setStatus(supplierDetails.isActive());
        supplier.setPhone(supplierDetails.getPhone());
        supplier.setSupplierName(supplierDetails.getSupplierName());
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(int id, SupplierModel supplierDetails) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));
        supplier.setAddress(supplierDetails.getAddress());
        supplier.setContactName(supplierDetails.getContactName());
        supplier.setEmail(supplierDetails.getEmail());
        supplier.setStatus(supplierDetails.isActive());
        supplier.setPhone(supplierDetails.getPhone());
        supplier.setSupplierName(supplierDetails.getSupplierName());
        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(int id) {
        supplierRepository.deleteById(id);
    }
}
