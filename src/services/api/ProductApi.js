import axiosInstance from "../axiosConfig";
const searchProduct = async (keyword) => {
    try {
        const response = await axiosInstance.get(`/product/search?query=${keyword}`);
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
        console.warn("No categories found");
      } else {
        console.error("An unexpected error occurred");
      }
    }
};
const productApi = {
    searchProduct,
    getAllCategory,
    getAllProduct
  };
export default productApi;