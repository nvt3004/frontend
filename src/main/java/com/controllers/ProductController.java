package com.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.responsedto.ProductDTO;
import com.services.AlgoliaProductService;
import com.services.ProductInforService;
import com.utils.RemoveDiacritics;
import com.algolia.search.models.indexing.Query;
import com.algolia.search.models.indexing.SearchResult;

import java.util.List;

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

    // Thêm sản phẩm vào Algolia
    @PostMapping("/add")
    public ResponseEntity<String> addProduct(@RequestBody ProductDTO product) {
        try {
        	for (ProductDTO dto : inforService.getALLInforProduct()) {
        		 algoliaProductService.addProduct(dto);
			}
            return ResponseEntity.ok("Sản phẩm đã được thêm thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi thêm sản phẩm: " + e.getMessage());
        }
    }

    // Tìm kiếm sản phẩm từ Algolia
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String query) {
        try {
        	RemoveDiacritics diacritics =  new RemoveDiacritics();
            Query algoliaQuery = new Query(diacritics.removeDiacritics(query));
            List<ProductDTO> products = algoliaProductService.searchProducts(algoliaQuery);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(List.of());
        }
    }
}
