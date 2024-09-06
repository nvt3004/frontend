package com.controllers;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.entities.ProductVersion;
import com.entities.Supplier;
import com.entities.Warehous;
import com.errors.InvalidException;
import com.models.WarehouseUltraPlusModel;
import com.services.ProductVersionService;
import com.services.SupplierService;
import com.services.WarehousService;


@RestController
@RequestMapping("/api/warehouses")
public class WarehousController {

	@Autowired
	private WarehousService warehousService;
	@Autowired
	private ProductVersionService prodVerService;
	@Autowired
	private SupplierService supplierService;

	@GetMapping
	public ResponseEntity<List<WarehouseUltraPlusModel>> getAllWarehouses() {
		List<WarehouseUltraPlusModel> ultraPlusModel = new ArrayList<>();
		// Lấy tất cả các thực thể Warehous cùng các liên kết với Supplier và
		// ProductVersion
		List<Warehous> wh = warehousService.getAllWarehouses();
		for (Warehous warehous : wh) {
			WarehouseUltraPlusModel whU = new WarehouseUltraPlusModel();
			// Truy xuất dữ liệu liên kết trực tiếp từ thực thể Warehous
			Supplier supplier = warehous.getSupplier();
			ProductVersion productVersion = warehous.getProductVersionBean();
			whU.setWarehous(warehous);
			whU.setProductVersion(productVersion);
			whU.setSupplier(supplier);
			ultraPlusModel.add(whU);
		}
		return ResponseEntity.ok(ultraPlusModel);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Warehous> getWarehousById(@PathVariable int id) {
		Warehous warehous = warehousService.getWarehousById(id)
				.orElseThrow(() -> new InvalidException("Warehouse not found with id " + id));
		return ResponseEntity.ok(warehous);
	}

	@PostMapping
	public ResponseEntity<?> createWarehous(@RequestParam("productVersionId") String productVerId,
			@RequestParam("quantity") String qty, @RequestParam("supplierId") String suppId,
			@RequestParam("description") String description) {
		Integer productVersionId = null;
		Integer quantity = null;
		Integer supplierId = null;
		try {
			productVersionId = Integer.valueOf(productVerId);
			quantity = Integer.valueOf(qty);
			supplierId = Integer.valueOf(suppId);

		} catch (Exception e) {
			System.out.println("Chuyển đỏi kiểu dữ liệu bị lỗi !");
		}
		if (productVersionId == null || quantity == null || supplierId == null || description == null) {
			return ResponseEntity.badRequest().body("Tất cả các tham số đều bắt buộc.");
		}
		if (quantity <= 0) {
			return ResponseEntity.badRequest().body("The quantity must be greater than 0 !");
		}
		Warehous wh = new Warehous();
		ProductVersion prodVer = prodVerService.getProductVersionByID(productVersionId);
		if (prodVer == null) {
			return ResponseEntity.badRequest().body("ProductVersion không tồn tại.");
		}
		int inventory = prodVer.getQuantity();
		prodVer.setQuantity(inventory + quantity);
		ProductVersion prodVer2 = prodVerService.updateProdVerSion(prodVer);
		Optional<Supplier> supp = supplierService.getSupplierById(supplierId);
		if (!supp.isPresent()) {
			return ResponseEntity.badRequest().body("Supplier không tồn tại.");
		}
		Supplier supplier = supp.get();
		wh.setChangeType("Unknown");
//		wh.setImportPrice(prodVer2.getImportPrice());
		wh.setInvQuantity(quantity);
		wh.setDescription(description);
		wh.setChangeDatetime(new Timestamp(System.currentTimeMillis())); // Timestamp
		wh.setProductVersionBean(prodVer2);
		wh.setSupplier(supplier);
		// Lưu Warehouse vào cơ sở dữ liệu
		Warehous createdWarehous = warehousService.createWarehous(wh);
		return ResponseEntity.ok(createdWarehous);
	}

//
//	@PutMapping("/{id}")
//	public ResponseEntity<Warehous> updateWarehous(@PathVariable int id, @RequestBody WarehousModel warehousDetails) {
//		Warehous updatedWarehous = warehousService.updateWarehous(id, warehousDetails);
//		return ResponseEntity.ok(updatedWarehous);
//	}

//	@DeleteMapping("/{id}")
//	public ResponseEntity<Void> deleteWarehous(@PathVariable int id) {
//		warehousService.deleteWarehous(id);
//		return ResponseEntity.noContent().build();
//	}
}
