package com.services;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Array;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.AttributeOption;
import com.entities.AttributeOptionsVersion;
import com.entities.Product;
import com.entities.ProductSale;
import com.entities.ProductVersion;
import com.repositories.ProductCustomJPA;
import com.repositories.ProductJPA;
import com.responsedto.Attribute;
import com.responsedto.PageCustom;
import com.responsedto.ProductDetailResponse;
import com.responsedto.ProductHomeResponse;
import com.responsedto.Version;
import com.utils.UploadService;

@Service
public class ProductService {
	@Autowired
	ProductCustomJPA productCustomJPA;

	@Autowired
	ProductJPA productJPA;

	@Autowired
	UploadService uploadService;

	public PageCustom<ProductHomeResponse> getProducts(int page, int size) {
		return productCustomJPA.getAllProducts(page, size);
	}

	public PageCustom<ProductHomeResponse> getProducts(int page, int size, int categoryId) {
		return productCustomJPA.getAllProductsByCategory(page, size, categoryId);
	}

	public ProductDetailResponse getProductDetail(int idProduct) {
		Product product = productJPA.findById(idProduct).get();
		List<Version> versions = new ArrayList<>();

		ProductHomeResponse productParrent = new ProductHomeResponse();
		List<ProductSale> sales = product.getProductSales();

		productParrent.setId(product.getProductId());
		productParrent.setProductName(product.getProductName());
		productParrent.setPrice(product.getProductPrice());
		productParrent.setImage(uploadService.getUrlImage(product.getProductImg()));
		productParrent.setDiscount(sales.size() <= 0 ? 0 : sales.get(0).getDiscount());

		for (ProductVersion vs : product.getProductVersions()) {
			Version versionDto = new Version();

			List<Attribute> attributes = getAllAttributeByVersion(vs);
			List<String> images = vs.getImages().stream().map((img) -> {
				return img.getImageUrl();
			}).toList();

			versionDto.setId(vs.getId());
			versionDto.setVersionName((vs.getVersionName()));
			versionDto.setPrice(vs.getRetailPrice());
			versionDto.setInStock(vs.getQuantity() > 0);
			versionDto.setImages(images);
			versionDto.setAttributes(attributes);

			versions.add(versionDto);
		}

		return new ProductDetailResponse(productParrent, versions);
	}

	public Product getProductById(int id) {
		Product product = productJPA.findById(id).get();

		return product != null && product.isStatus() ? product : null;
	}

	private List<Attribute> getAllAttributeByVersion(ProductVersion version) {
		List<Attribute> list = new ArrayList<>();
		for (AttributeOptionsVersion options : version.getAttributeOptionsVersions()) {
			String key = options.getAttributeOption().getAttribute().getAttributeName();
			String value = options.getAttributeOption().getAttributeValue();

			list.add(new Attribute(key, value));
		}

		return list;
	}
}
