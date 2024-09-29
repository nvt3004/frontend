import axiosInstance from "../axiosConfig";
const searchProduct = async (query, page) => {
  try {
    const response = await axiosInstance.get("/product/search", {
      params: {
        query,
        page,
      },
    });
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
const getFilterAttribute = async () => {
  try {
    const response = await axiosInstance.get("/product/FilterAttribute");
    return response;
  } catch (error) {
    console.error("Error fetching FilterAttribute:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No FilterAttribute found");
    } else {
      console.error("An unexpected error occurred");
    }
  }
};

const filter = async (
  categoryName,
  minPrice,
  maxPrice,
  color,
  size,
  sortPrice,
  page
) => {
  try {
    const response = await axiosInstance.get("/product/filtered", {
      params: {
        categoryName,
        minPrice,
        maxPrice,
        color,
        size,
        sortPrice,
        page,
      },
    });
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
const getTopProducts = async () => {
  try {
    const response = await axiosInstance.get("/product/getTopProducts");
    return response;
  } catch (error) {
    console.error("Error fetching Products:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No Products found");
    } else {
      console.error("An unexpected error occurred");
    }
  }
};
const getProductDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/home/product/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching Products:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No Products found");
    } else {
      console.error("An unexpected error occurred");
    }
  }
};
const productApi = {
  searchProduct,
  getFilterAttribute,
  filter,
  getTopProducts,
  getProductDetail,
};
export default productApi;
