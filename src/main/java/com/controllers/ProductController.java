package com.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.responsedto.CartItemResponse;
import com.responsedto.ProductCartResponse;
import com.responsedto.ProductDTO;
import com.services.AlgoliaProductService;
import com.services.ProductInforService;
import com.utils.RemoveDiacritics;
import com.algolia.search.models.indexing.Query;
import com.algolia.search.models.indexing.SearchResult;
import com.entities.AttributeOption;
import com.entities.Category;
import com.errors.ResponseAPI;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/product")
@CrossOrigin("*")
public class ProductController {

	@Autowired
	ProductInforService inforService;

	private final AlgoliaProductService algoliaProductService;

	@Autowired
	public ProductController(AlgoliaProductService algoliaProductService) {
		this.algoliaProductService = algoliaProductService;
	}
	@GetMapping("/getAllSize")
	public ResponseEntity<ResponseAPI<List<AttributeOption>>> getAllSize() {
		ResponseAPI<List<AttributeOption>> response = new ResponseAPI<>();
		try {
			// Lấy danh sách sản phẩm
			List<AttributeOption> items = inforService.getListSize();
			if (items.isEmpty()) {
				response.setCode(204); // 204 No Content
				response.setMessage("No products found");
			} else {
				response.setCode(200); // 200 OK
				response.setMessage("Success");
				response.setData(items);
			}
		} catch (Exception e) {
			// Xử lý ngoại lệ
			response.setCode(500); // 500 Internal Server Error
			response.setMessage("An error occurred while fetching products: " + e.getMessage());
			response.setData(null);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
		return ResponseEntity.ok(response);
	}
	@GetMapping("/getAllColor")
	public ResponseEntity<ResponseAPI<List<AttributeOption>>> getAllColor() {
		ResponseAPI<List<AttributeOption>> response = new ResponseAPI<>();
		try {
			// Lấy danh sách sản phẩm
			List<AttributeOption> items = inforService.getListColor();
			if (items.isEmpty()) {
				response.setCode(204); // 204 No Content
				response.setMessage("No products found");
			} else {
				response.setCode(200); // 200 OK
				response.setMessage("Success");
				response.setData(items);
			}
		} catch (Exception e) {
			// Xử lý ngoại lệ
			response.setCode(500); // 500 Internal Server Error
			response.setMessage("An error occurred while fetching colors: " + e.getMessage());
			response.setData(null);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
		return ResponseEntity.ok(response);
	}
	@GetMapping("/getAllProductByCategory")
	public ResponseEntity<ResponseAPI<List<ProductDTO>>> getAllProductByCategory(@RequestParam("id") int id) {
		ResponseAPI<List<ProductDTO>> response = new ResponseAPI<>();
		try {
			// Lấy danh sách sản phẩm
			List<ProductDTO> items = inforService.getListProductByCategoryId(id);
			if (items.isEmpty()) {
				response.setCode(204); // 204 No Content
				response.setMessage("No products found");
			} else {
				response.setCode(200); 
				response.setMessage("Success");
				response.setData(items);
			}
		} catch (Exception e) {
			response.setCode(500); // 500 Internal Server Error
			response.setMessage("An error occurred while fetching products: " + e.getMessage());
			response.setData(null);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
		return ResponseEntity.ok(response);
	}
	@GetMapping("/getAllCategory")
	public ResponseEntity<ResponseAPI<List<Category>>> getAllCategory() {
		ResponseAPI<List<Category>> response = new ResponseAPI<>();
		try {
			// Lấy danh sách sản phẩm
			List<Category> items = inforService.getListCategory();
			if (items.isEmpty()) {
				response.setCode(204); // 204 No Content
				response.setMessage("No products found");
			} else {
				response.setCode(200); // 200 OK
				response.setMessage("Success");
				response.setData(items);
			}
		} catch (Exception e) {
			// Xử lý ngoại lệ
			response.setCode(500); // 500 Internal Server Error
			response.setMessage("An error occurred while fetching products: " + e.getMessage());
			response.setData(null);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
		return ResponseEntity.ok(response);
	}
	@GetMapping("/getAllProduct")
	public ResponseEntity<ResponseAPI<List<ProductDTO>>> getAllProduct() {
		ResponseAPI<List<ProductDTO>> response = new ResponseAPI<>();
		try {
			// Lấy danh sách sản phẩm
			List<ProductDTO> items = inforService.getALLProduct();
			if (items.isEmpty()) {
				response.setCode(204); // 204 No Content
				response.setMessage("No products found");
			} else {
				response.setCode(200); // 200 OK
				response.setMessage("Success");
				response.setData(items);
			}
		} catch (Exception e) {
			// Xử lý ngoại lệ
			response.setCode(500); // 500 Internal Server Error
			response.setMessage("An error occurred while fetching products: " + e.getMessage());
			response.setData(null);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
		return ResponseEntity.ok(response);
	}

	// Tìm kiếm sản phẩm từ Algolia
	@GetMapping("/search")
	public ResponseEntity<ResponseAPI<List<ProductDTO>>> searchProducts(@RequestParam String query) {
		ResponseAPI<List<ProductDTO>> response = new ResponseAPI<>();
		try {
			RemoveDiacritics diacritics = new RemoveDiacritics();
			Query algoliaQuery = new Query(diacritics.removeDiacritics(query));
			List<ProductDTO> products = algoliaProductService.searchProducts(algoliaQuery);
			if (products.isEmpty()) {
				response.setCode(204); 
				response.setMessage("No products found for the search query: " + query);
			} else {
				response.setCode(200); 
				response.setMessage("Success");
				response.setData(products);
			}
		} catch (Exception e) {
			response.setCode(500); 
			response.setMessage("An error occurred during product search: " + e.getMessage());
			response.setData(null);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
		return ResponseEntity.ok(response);
	}

}
