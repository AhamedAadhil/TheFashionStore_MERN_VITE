import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { VscVerifiedFilled } from "react-icons/vsc";
import { MdDateRange } from "react-icons/md";
import { BsCash } from "react-icons/bs";
import { Spinner, Offcanvas } from "react-bootstrap";
import toast from "react-hot-toast";
import { Pagination } from "swiper/modules";
import Rating from "../../components/Rating";
import Review from "./Review";
import SingleProductSkull from "../../components/LoadSkulls/SingleProductSkull";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";

export default function SingleProduct() {
  const [product, setProduct] = useState({});
  const [wload, setWload] = useState(false);
  const [isOnWishList, setIsOnWishList] = useState(false);
  const [useEffectLoading, setUseEffectLoading] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false); // State variable to manage the visibility of the offcanvas
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const location = useLocation();

  const toggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const fetchProduct = async () => {
    try {
      setUseEffectLoading(true);
      const response = await fetch(`/api/product/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        setUseEffectLoading(false);
        console.log(response.message);
        return;
      }
      setUseEffectLoading(false);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setUseEffectLoading(false);
      toast.error(error.message);
    }
  };

  console.log(product);

  const getBuyerWishList = async () => {
    if (!currentUser || currentUser === null) {
      console.log("User Not Login!");
      return;
    }
    try {
      setUseEffectLoading(true);
      const response = await fetch("/api/buyer/actions/getWishList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        setUseEffectLoading(false);
        console.log(response.message);
        return;
      }
      const data = await response.json();
      const isProductInWishlist = data.some((item) => item._id === id);
      setIsOnWishList(isProductInWishlist);
      setUseEffectLoading(false);
    } catch (error) {
      setUseEffectLoading(false);
      console.log(error.message);
    }
  };

  // Fetch the product data when the component mounts.
  useEffect(() => {
    fetchProduct();
    getBuyerWishList();
  }, [id]);

  const addToWishlist = async (id) => {
    try {
      setWload(true);
      if (!currentUser || currentUser === null) {
        toast.error("Please Login To Add This Product in Wishlist!");
        navigate("/login");
        setWload(false);
        return;
      }
      const response = await fetch("/api/product/addToWishlist", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id }),
      });
      const data = await response.json();

      const response2 = await fetch(`/api/product/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data2 = await response2.json();

      if (data.message === "UnAuthorized!") {
        setWload(false);
        navigate("/login");
        return;
      }
      if (!response.ok) {
        setWload(false);
        toast.error(data.message);
        return;
      }
      setWload(false);
      toast.success(data);
      setIsOnWishList(data === "Added To Wishlist!");
      setProduct(data2);
    } catch (error) {
      setWload(false);
      toast.error(error.message);
    }
  };

  const [productQuantity, setProductQuantity] = useState(1);
  const [productCoupon, setProductCoupon] = useState(1);
  const [productColor, setProductColor] = useState("Select Color");
  const [productSize, setProductSize] = useState("Select Size");
  const [loading, setLoading] = useState(false);

  const FormData = {
    item: {
      count: productQuantity,
      color: productColor,
      size: productSize,
      product: id,
    },
  };

  const handleSizeChange = (size) => {
    setProductSize(size);
  };

  const handleColorChange = (event) => {
    setProductColor(event.target.value);
  };

  const handleDecreseCount = () => {
    if (productQuantity > 1) {
      setProductQuantity((prevProdQty) => prevProdQty - 1);
    }
  };
  const handleIncreaseCount = () => {
    if (productQuantity < product?.stock) {
      setProductQuantity((prevProdQty) => prevProdQty + 1);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      if (!currentUser) {
        setLoading(false);
        navigate("/login");
        return;
      }
      if (FormData.item.color === "Select Color") {
        setLoading(false);
        toast.error("Please Select a Color!");
        return;
      }
      if (FormData.item.size === "Select Size") {
        setLoading(false);
        toast.error("Please Select a Size!");
        return;
      }
      if (FormData.item.count <= 0) {
        setLoading(false);
        toast.error("Please select a valid quantity");
        return;
      }
      const response = await fetch("/api/buyer/actions/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FormData),
      });

      const data = await response.json();
      if (data.success == false) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      toast.success("Product Added To Cart!");
      navigate("/cart");
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const buyNow = async (e) => {
  //   try {
  //     e.preventDefault();
  //     setLoading(true);
  //     if (!currentUser) {
  //       setLoading(false);
  //       navigate("/login");
  //       return;
  //     }
  //     if (FormData.item.color === "Select Color") {
  //       setLoading(false);
  //       toast.error("Please Select a Color!");
  //       return;
  //     }
  //     if (FormData.item.size === "Select Size") {
  //       setLoading(false);
  //       toast.error("Please Select a Size!");
  //       return;
  //     }
  //     if (FormData.item.count <= 0) {
  //       setLoading(false);
  //       toast.error("Please select a valid quantity");
  //       return;
  //     }

  //     // Check if the user has a cart
  //     let cartInfo = await fetch("/api/buyer/actions/getUserCart", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (!cartInfo.ok) {
  //       // Add the product to the cart
  //       const addToCartResponse = await fetch("/api/buyer/actions/addToCart", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(FormData),
  //       });
  //       const addToCartData = await addToCartResponse.json();
  //       if (addToCartData.success === false) {
  //         setLoading(false);
  //         toast.error(addToCartData.message);
  //         return;
  //       }
  //       toast.success("Product Added To Cart!");
  //       navigate("/cart");
  //       setLoading(false);
  //       return;
  //     }

  //     const cartData = await cartInfo.json();
  //     console.log(cartData);

  //     // If the user has a cart, delete it
  //     if (cartData && cartData.length > 0) {
  //       const deleteCartResponse = await fetch("/api/buyer/actions/emptyCart", {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       const deleteCartData = await deleteCartResponse.json();
  //       if (deleteCartData.success === false) {
  //         setLoading(false);
  //         toast.error(deleteCartData.message);
  //         return;
  //       }
  //     }

  //     // Add the product to the cart
  //     const addToCartResponse = await fetch("/api/buyer/actions/addToCart", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(FormData),
  //     });
  //     const addToCartData = await addToCartResponse.json();
  //     if (addToCartData.success === false) {
  //       setLoading(false);
  //       toast.error(addToCartData.message);
  //       return;
  //     }
  //     toast.success("Product Added To Cart!");
  //     navigate("/cart");
  //     setLoading(false);
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  // Function to handle updating product data after adding a review
  const handleProductUpdate = () => {
    fetchProduct();
  };

  if (useEffectLoading) {
    return <SingleProductSkull />; // Render skeleton component while loading
  }

  return (
    <div
      className="shop-single padding-tb aside-bg"
      style={{ paddingTop: "80px" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-12">
            <article>
              <div className="product-details">
                <div className="row align-items-center">
                  <div className="col-md-6 col-12">
                    <div className="product-thumb">
                      <div className="lws">
                        {/* Show Low Stock banner if stock is 0 */}
                        {product.stock === 0 && (
                          <div className="low-stock-banner">Out Of Stock</div>
                        )}
                        <div className="swiper-container pro-single-top">
                          {product && product.imageUrls && (
                            <Swiper
                              pagination={{
                                type: "fraction",
                                style: { color: "red" },
                              }}
                              modules={[Pagination]}
                              className="mySwiper"
                            >
                              {product &&
                                product.imageUrls.map((imageUrl, index) => (
                                  <SwiperSlide key={index}>
                                    <div className="single-thumb text-center">
                                      <div className="heart-icon">
                                        <>
                                          {" "}
                                          {isOnWishList ? (
                                            <span style={{ color: "red" }}>
                                              {wload && (
                                                <Spinner
                                                  style={{
                                                    width: "1rem",
                                                    height: "1rem",
                                                  }}
                                                  animation="border"
                                                />
                                              )}
                                              <FaHeart
                                                style={{
                                                  color: "red",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                  addToWishlist(id)
                                                }
                                              />{" "}
                                              {product.likes}
                                            </span>
                                          ) : (
                                            <span style={{ color: "red" }}>
                                              {wload && (
                                                <Spinner
                                                  style={{
                                                    width: "1rem",
                                                    height: "1rem",
                                                  }}
                                                  animation="border"
                                                />
                                              )}
                                              <FaRegHeart
                                                style={{
                                                  color: "red",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                  addToWishlist(id)
                                                }
                                              />
                                              {product.likes}
                                            </span>
                                          )}
                                        </>
                                      </div>
                                      <img
                                        src={imageUrl}
                                        alt="product"
                                        style={{
                                          maxHeight: "326px",
                                          maxWidth: "326px",
                                        }}
                                      />
                                    </div>
                                  </SwiperSlide>
                                ))}
                            </Swiper>
                          )}
                          {/* <div className="pro-single-prev">
                          <i className="icofont-rounded-right"></i>
                        </div>
                        <div className="pro-single-next">
                          <i className="icofont-rounded-left"></i>
                        </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="post-content">
                      {product && (
                        <div>
                          <h4>{product?.name}</h4>
                          <h4 className="rating">
                            {product && <Rating product={product} />}
                          </h4>
                          <h4>Rs. {product?.price?.toFixed(2)}</h4>
                          {product && product.brand && (
                            <h6>
                              {" "}
                              <b>Brand:</b>&nbsp;
                              <span style={{ color: "#F16126" }}>
                                {product?.brand?.title === "Others"
                                  ? "Non-Specified"
                                  : product?.brand?.title?.toUpperCase()}
                              </span>
                            </h6>
                          )}
                          <h6>
                            <b> Quality:</b>&nbsp;
                            <span style={{ color: "#F16126" }}>
                              {product?.quality === "a_grade"
                                ? "A-GRADE"
                                : "ORIGINAL"}
                            </span>
                          </h6>

                          <h6
                            onClick={toggleOffcanvas}
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                              color: "#F16126",
                            }}
                          >
                            View Description &gt;
                          </h6>

                          {/* Offcanvas component */}
                          <Offcanvas
                            show={showOffcanvas}
                            onHide={toggleOffcanvas}
                            placement="bottom"
                          >
                            <Offcanvas.Header closeButton>
                              <Offcanvas.Title>
                                Product Description
                              </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body style={{ whiteSpace: "pre-wrap" }}>
                              <p>{product?.description}</p>
                            </Offcanvas.Body>
                          </Offcanvas>
                        </div>
                      )}
                      {/* cart component */}
                      <div>
                        <form>
                          {/* select size */}
                          <div className="select-product size d-flex align-items-center">
                            <p className="m-0 me-2">
                              <b>Size:</b>
                            </p>
                            <div className="btn-group horizontal-scroll">
                              {product &&
                                product.size &&
                                product.size.map((size, i) => (
                                  <button
                                    style={{ borderColor: "#F16126" }}
                                    key={i}
                                    disabled={product.stock === 0}
                                    type="button"
                                    className={`btn btn-outline ${
                                      size === productSize
                                        ? "btn-selected-size"
                                        : ""
                                    }`}
                                    onClick={() => handleSizeChange(size)}
                                  >
                                    {size}
                                  </button>
                                ))}
                            </div>
                          </div>
                          {/* select color */}
                          <div className="select-product color">
                            <select
                              style={{ borderColor: "#F16126" }}
                              onChange={handleColorChange}
                              value={productColor}
                            >
                              <option value="Select Color" disabled>
                                Select Color
                              </option>
                              {product &&
                                product.color &&
                                product.color.map((color, i) => (
                                  <option
                                    value={color}
                                    key={i}
                                    disabled={product.stock === 0}
                                  >
                                    {color}
                                  </option>
                                ))}
                            </select>
                            <i className="icofont-rounded-down"></i>
                          </div>
                          {/* select quantity */}
                          <div
                            className="cart-plus-minus"
                            style={{ borderColor: "#F16126" }}
                          >
                            <div
                              style={{ borderRightColor: " #F16126" }}
                              className="dec qtybutton"
                              onClick={handleDecreseCount}
                            >
                              -
                            </div>
                            <input
                              className="cart-plus-minus-box"
                              type="text"
                              name="qtybutton"
                              id="qtybutton"
                              value={productQuantity}
                              onChange={(e) =>
                                setProductQuantity(
                                  parseInt(e.target.value, product?.stock)
                                )
                              }
                            />
                            <div
                              style={{ borderLeftColor: " #F16126" }}
                              className="inc qtybutton"
                              onClick={handleIncreaseCount}
                            >
                              +
                            </div>
                          </div>
                          {/* apply coupon */}
                          <div className="discount-code mb-2">
                            <input
                              type="text"
                              placeholder="Coupon Code"
                              style={{
                                textTransform: "uppercase",
                                borderColor: " #F16126",
                              }}
                              onChange={(e) => setProductCoupon(e.target.value)}
                            />
                          </div>
                        </form>
                      </div>
                      <div
                        style={{
                          borderTop: "1px solid lightgrey",
                        }}
                        className="mt-3 pt-3"
                      >
                        <p
                          style={{
                            color: "white",
                            backgroundColor: "green",
                            fontSize: "1rem",
                          }}
                          className="py-2 px-2 "
                        >
                          <BsCash /> &nbsp; Cash-On-Delivery Available. <br />
                          <TbTruckDelivery /> &nbsp; All Island Free Delivery.
                          <br />
                          <MdDateRange /> &nbsp;Deliver Within 3 to 5 Working
                          Days.
                        </p>
                      </div>
                      {product && product.seller && (
                        <h6
                          onClick={() =>
                            navigate(`/seller/${product.seller._id}`, {
                              state: { seller: product.seller },
                            })
                          }
                          style={{
                            borderTop: "1px solid lightgrey",
                          }}
                          className="mt-3 pt-3"
                        >
                          <b>Seller:</b> &nbsp;
                          <span
                            style={{
                              textDecoration: "underline",
                              cursor: "pointer",
                              color: "#F16126",
                            }}
                          >
                            {product?.seller.shopname}
                            {product?.seller.verified && (
                              <VscVerifiedFilled
                                style={{
                                  margin: "0 5px",
                                  color: "blue",
                                  verticalAlign: "middle",
                                }}
                              />
                            )}
                          </span>
                        </h6>
                      )}

                      {/* button section */}
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          disabled={loading || product.stock === 0}
                          type="submit"
                          className="lab-btn mt-4"
                          onClick={handleSubmit}
                        >
                          <span>{loading ? "Loading..." : "Add To Cart"}</span>
                        </button>
                        <Link
                          to="/cart"
                          // onClick={buyNow}
                          className="lab-btn bg-primary mt-4"
                        >
                          <span>Check Out</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* review */}
              <div className="review">
                <Review id={id} onUpdate={handleProductUpdate} />
              </div>
            </article>
          </div>
          {/* <div className="col-lg-8 col-12">Right Side</div> */}
        </div>
      </div>
    </div>
  );
}
