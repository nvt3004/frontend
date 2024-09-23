import axiosInstance from "../axiosConfig";

// Lấy danh sách sản phẩm (GET)
export const getProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Lấy danh sách sản phẩm có phân trang và giới hạn (GET)
export const getProductLimit = async (params) => {
  try {
    const response = await axiosInstance.get("/products", { params });
    return response;
  } catch (error) {
    console.error("Error fetching products with pagination:", error);
    throw error;
  }
};

// Lấy chi tiết sản phẩm theo ID (GET)
export const getProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};

// Thêm sản phẩm mới (POST)
export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post("/products", productData);
    return response;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Cập nhật sản phẩm theo ID (PUT)
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axiosInstance.put(
      `/products/${productId}`,
      productData
    );
    return response;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw error;
  }
};

// Xóa sản phẩm theo ID (DELETE)
export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response;
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
    throw error;
  }
};

