import axiosInstance from "../axiosConfig";
const searchProduct = async (keyword) => {
  try {
    const response = await axiosInstance.get(
      `/product/search?query=${keyword}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No products found for this query");
    } else {
      console.error("An unexpected error occurred");
    }
  }
};
const getAllCategory = async () => {
  try {
    const response = await axiosInstance.get("/product/getAllCategory");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No categories found");
    } else {
      console.error("An unexpected error occurred");
    }
  }
};

const getAllProduct = async () => {
  try {
    const response = await axiosInstance.get("/product/getAllProduct");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No products found");
    } else {
      console.error("An unexpected error occurred");
    }
  }
};
const getAllProductByCategoryId = async (categoryId) => {
  try {
    const response = await axiosInstance.get(
      `/product/getAllProductByCategory`,
      {
        params: { id: categoryId },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No products found");
    } else {
      console.error("An unexpected error occurred");
    }
  }
};
const getAllColor = async () => {
  try {
    const response = await axiosInstance.get("/product/getAllColor");
    return response;
  } catch (error) {
    console.error("Error fetching colors:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No colors found");
    } else {
      console.error("An unexpected error occurred");
    }
  }
};
const getAllSize = async () => {
  try {
    const response = await axiosInstance.get("/product/getAllSize");
    return response;
  } catch (error) {
    console.error("Error fetching Sizes:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No Sizes found");
    } else {
      console.error("An unexpected error occurred");
    }
  }
};
const productApi = {
  searchProduct,
  getAllCategory,
  getAllProduct,
  getAllProductByCategoryId,
  getAllColor,
  getAllSize,
};
export default productApi;
