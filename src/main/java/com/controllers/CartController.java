package com.controllers;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.entities.Cart;
import com.entities.CartProduct;
import com.entities.ProductVersion;
import com.entities.User;
import com.errors.ResponseAPI;
import com.models.ProductCartModel;
import com.responsedto.ProductCartResponse;
import com.services.AuthService;
import com.services.CartProductService;
import com.services.CartService;
import com.services.JWTService;
import com.services.ProductService;
import com.services.ProductVersionService;
import com.services.UserService;

@RestController
@RequestMapping("user/cart")
@CrossOrigin("*")
public class CartController {
	@Autowired
	AuthService authService;

	@Autowired
	JWTService jwtService;

	@Autowired
	ProductService productService;

	@Autowired
	UserService userService;

	@Autowired
	ProductVersionService versionService;

	@Autowired
	CartProductService cartProductService;

	@Autowired
	CartService cartService;

	// @RequestHeader("Authorization") Optional<String> authHeader
	@PostMapping("/add")
	public ResponseEntity<ResponseAPI<ProductCartResponse>> addCart(
			@RequestHeader("Authorization") Optional<String> authHeader,
			@RequestBody ProductCartModel productCartModel) {
		ResponseAPI<ProductCartResponse> response = new ResponseAPI<>();

		String token = authService.readTokenFromHeader(authHeader);
		if (token == null && !jwtService.isSignature(token)) {
			response.setCode(400);
			response.setMessage("Invalid token format");

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}

		if (jwtService.isTokenExpired(token)) {
			response.setCode(401);
			response.setMessage("Token expired");

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
		}

		String username = jwtService.extractUsername(token);
		User user = userService.getUserByUsername(username);
		if (user == null) {
			response.setCode(404);
			response.setMessage("Account not found");

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}

		if (!user.isStatus()) {
			response.setCode(403);
			response.setMessage("Account locked");

			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
		}

		if (productCartModel.getQuantity() <= 0) {
			response.setCode(422);
			response.setMessage("Quantity invalid");

			return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(response);
		}

		ProductVersion version = versionService.getProductVersionById(productCartModel.getVersionId());
		// False: nếu sản phẩm gốc bị xóa hoặc phiên bản sản phẩm này không tồn tại
		if (!versionService.isValidProductVersion(version)) {
			response.setCode(404);
			response.setMessage("Products not found");

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}

		if (productCartModel.getQuantity() > version.getQuantity()) {
			response.setCode(422);
			response.setMessage("Products that exceed the quantity in stock");

			return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(response);
		}

		Cart cartEntity = new Cart();
		cartEntity.setUser(user);

		Cart cart = cartService.addCart(cartEntity);

		CartProduct cartProductEntity = new CartProduct();
		cartProductEntity.setCart(cart);
		cartProductEntity.setProductVersionBean(version);
		cartProductEntity.setQuantity(productCartModel.getQuantity());
		cartProductEntity.setAddedDate(new Date());

		ProductCartResponse productCartResponse = cartProductService.addProductToCart(cartProductEntity);
		response.setCode(200);
		response.setMessage("Success");
		response.setData(productCartResponse);

		return ResponseEntity.ok(response);
	}

}
