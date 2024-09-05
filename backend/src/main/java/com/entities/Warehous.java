package com.entities;

import java.io.Serializable;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;


/**
 * The persistent class for the warehouses database table.
 * 
 */
@Entity
@Table(name="warehouses")
@NamedQuery(name="Warehous.findAll", query="SELECT w FROM Warehous w")
public class Warehous implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="warehouse_id")
	private int warehouseId;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="change_datetime")
	private Date changeDatetime;

	@Column(name="change_type")
	private String changeType;

	@Lob
	private String description;

	@Column(name="import_price")
	private BigDecimal importPrice;

	@Column(name="inv_quantity")
	private int invQuantity;

	//bi-directional many-to-one association to ProductVersion
	@ManyToOne
	@JoinColumn(name="product_version")
	@JsonBackReference("productVersionBean-warehouses")
	private ProductVersion productVersionBean;

	//bi-directional many-to-one association to Supplier
	@ManyToOne
	@JoinColumn(name="supplier_id")
	@JsonBackReference("supplier-warehouses")
	private Supplier supplier;

	public Warehous() {
	}

	public int getWarehouseId() {
		return this.warehouseId;
	}

	public void setWarehouseId(int warehouseId) {
		this.warehouseId = warehouseId;
	}

	public Date getChangeDatetime() {
		return this.changeDatetime;
	}

	public void setChangeDatetime(Date changeDatetime) {
		this.changeDatetime = changeDatetime;
	}

	public String getChangeType() {
		return this.changeType;
	}

	public void setChangeType(String changeType) {
		this.changeType = changeType;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getImportPrice() {
		return this.importPrice;
	}

	public void setImportPrice(BigDecimal importPrice) {
		this.importPrice = importPrice;
	}

	public int getInvQuantity() {
		return this.invQuantity;
	}

	public void setInvQuantity(int invQuantity) {
		this.invQuantity = invQuantity;
	}

	public ProductVersion getProductVersionBean() {
		return this.productVersionBean;
	}

	public void setProductVersionBean(ProductVersion productVersionBean) {
		this.productVersionBean = productVersionBean;
	}

	public Supplier getSupplier() {
		return this.supplier;
	}

	public void setSupplier(Supplier supplier) {
		this.supplier = supplier;
	}

}