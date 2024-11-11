import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productApi from "../../services/api/ProductApi"; // Import API service
import Wish from "../../components/client/ProdWish/Wish";
import { useDispatch } from "react-redux";
const WishList = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]); // State to hold wishlist products

  // Fetch wishlist products on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await productApi.getProductWish(); // Call API to get wishlist
        setProducts(data); // Set products in state
      } catch (error) {
        console.log("Failed to fetch wishlist products", error);
      }
    };

    fetchWishlist(); // Fetch wishlist when the component is mounted
  }, []);

  // Handlers for adding/removing items from wishlist
  const handleAddWishlist = async (id) => {
    try {
      await productApi.addWishlist(id, dispatch);
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === id
            ? { ...prod, like: true } // Đánh dấu sản phẩm là 'liked'
            : prod
        )
      );
    } catch (error) {
      console.error("Error adding to Wishlist:", error.message);
    }
  };
  const handleRemoveWishlist = async (id) => {
    try {
      await productApi.removeWishlist(id, dispatch);
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === id
            ? { ...prod, like: false } // Gỡ dấu 'liked' khỏi sản phẩm
            : prod
        )
      );
    } catch (error) {
      console.error("Error removing from Wishlist:", error.message);
    }
  };

  const style = {
    m: { marginTop: "80px", minHeight: "80vh" },
    h: { minHeight: "60vh" },
  };

  return (
    <div style={style.m}>
      <section className="bg0 p-t-23 p-b-140">
        <div className="container">
          <div className="p-b-10 mb-4">
            <h3 className="ltext-103 cl5">Wish Lists</h3>
          </div>
          <div className="row isotope-grid" style={style.h}>
            {products && products?.length > 0 ? (
              products?.map((product) => (
                <div
                  key={product.id} // Unique key for each product
                  className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women"
                >
                  <div className="block2">
                    <div className="block2-pic hov-img0">
                      <img src={product?.imgName} alt="IMG-PRODUCT" />
                      <button
                        type="button"
                        className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 text-decoration-none"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Quick View
                      </button>
                    </div>

                    <div className="block2-txt flex-w flex-t p-t-14">
                      <div className="block2-txt-child1 flex-col-l">
                        <Link
                          to={`/product-detail/${product?.id}`}
                          className="text-decoration-none stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                        >
                          {product?.name}
                        </Link>

                        <span className="stext-105 cl3">
                          {`${product?.minPrice} VND ~ ${product?.maxPrice} VND`}
                        </span>
                      </div>

                      <div className="block2-txt-child2 flex-r p-t-3">
                        <Wish
                          prodID={product?.id}
                          isWish={product?.like}
                          handleAddWish={() => handleAddWishlist(product?.id)}
                          handleRemoveWish={() =>
                            handleRemoveWishlist(product?.id)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-100 d-flex align-items-center justify-content-center fs-4 text-muted">
                No products in wishlist...
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WishList;
