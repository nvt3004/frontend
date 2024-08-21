// src/components/YourComponent.js
import { getProducts, getProductLimit, createProduct } from "../api/ExamProdApi";

const fetchProducts = async () => {
  try {
    const products = await getProducts();
    console.log("Products:", products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const fetchProductLimit = async () => {
  try {
    const params = { _page: 1, _limit: 10 };
    const products = await getProductLimit(params);
    console.log("Products with pagination:", products);
  } catch (error) {
    console.error("Error fetching products with pagination:", error);
  }
};

const addNewProduct = async () => {
  const newProduct = {
    name: "New Product",
    price: 100,
  };

  try {
    const createdProduct = await createProduct(newProduct);
    console.log("Created Product:", createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
  }
};
