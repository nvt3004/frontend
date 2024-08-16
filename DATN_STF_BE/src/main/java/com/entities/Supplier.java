package com.entities;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.List;


/**
 * The persistent class for the suppliers database table.
 * 
 */
@Entity
@Table(name="suppliers")
@NamedQuery(name="Supplier.findAll", query="SELECT s FROM Supplier s")
public class Supplier implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="supplier_id")
	private int supplierId;

	@Lob
	private String address;

	@Column(name="contact_name")
	private String contactName;

	private String email;

	private String phone;

	private byte status;

	@Column(name="supplier_name")
	private String supplierName;

	//bi-directional many-to-one association to Warehous
	@OneToMany(mappedBy="supplier")
	private List<Warehous> warehouses;

	public Supplier() {
	}

	public int getSupplierId() {
		return this.supplierId;
	}

	public void setSupplierId(int supplierId) {
		this.supplierId = supplierId;
	}

	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getContactName() {
		return this.contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public byte getStatus() {
		return this.status;
	}

	public void setStatus(byte status) {
		this.status = status;
	}

	public String getSupplierName() {
		return this.supplierName;
	}

	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
	}

	public List<Warehous> getWarehouses() {
		return this.warehouses;
	}

	public void setWarehouses(List<Warehous> warehouses) {
		this.warehouses = warehouses;
	}

	public Warehous addWarehous(Warehous warehous) {
		getWarehouses().add(warehous);
		warehous.setSupplier(this);

		return warehous;
	}

	public Warehous removeWarehous(Warehous warehous) {
		getWarehouses().remove(warehous);
		warehous.setSupplier(null);

		return warehous;
	}

}