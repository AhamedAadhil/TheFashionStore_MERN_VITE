import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Spinner from "react-bootstrap/Spinner";
import toast from "react-hot-toast";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import Rating from "../../components/Rating";
import Review from "./Review";
import SingleProductSkull from "../../components/LoadSkulls/SingleProductSkull";

export default function SingleProduct() {
  const [product, setProduct] = useState({});
  const [wload, setWload] = useState(false);
  const [isOnWishList, setIsOnWishList] = useState(false);
  const [useEffectLoading, setUseEffectLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const location = useLocation();

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
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

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
                              spaceBetween={30}
                              slidesPerView="1"
                              loop={true}
                              autoplay={{
                                delay: 2000,
                                disableOnInteraction: false,
                              }}
                              modules={[Autoplay]}
                              navigation={{
                                prevEl: ".pro-single-prev",
                                nextEl: ".pro-single-next",
                              }}
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
                                                style={{ color: "red" }}
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
                                                style={{ color: "red" }}
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
                          <h4>Rs. {product?.price}</h4>
                          {product && product.brand && (
                            <h6>
                              {" "}
                              <b>Brand:</b> {product?.brand.title.toUpperCase()}
                            </h6>
                          )}
                          <h6>
                            <b> Quality:</b>
                            {product?.quality === "a_grade"
                              ? "A-GRADE"
                              : "ORIGINAL"}
                          </h6>
                          {product && product.seller && (
                            <h6>
                              <b>Seller:</b> {product?.seller.shopname}
                            </h6>
                          )}

                          {/* <p>
                          <b>Description:</b> {product?.description}
                        </p> */}
                        </div>
                      )}
                      {/* cart component */}
                      <div>
                        <form onSubmit={handleSubmit}>
                          {/* select size */}
                          <div className="select-product size d-flex align-items-center">
                            <p className="m-0 me-2">Size:</p>
                            <div className="btn-group gap-2">
                              {product &&
                                product.size &&
                                product.size.map((size, i) => (
                                  <button
                                    disabled={product.stock === 0}
                                    type="button"
                                    key={i}
                                    className={`btn btn-outline-secondary ${
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
                          <div className="cart-plus-minus">
                            <div
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
                              style={{ textTransform: "uppercase" }}
                              onChange={(e) => setProductCoupon(e.target.value)}
                            />
                          </div>

                          {/* button section */}
                          <button
                            disabled={loading || product.stock === 0}
                            type="submit"
                            className="lab-btn mt-4"
                          >
                            <span>
                              {loading ? "Loading..." : "Add To Cart"}
                            </span>
                          </button>
                          <Link to="/cart" className="lab-btn bg-primary">
                            <span>Check Out</span>
                          </Link>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* review */}
              <div className="review">
                <Review
                  id={id}
                  desc={product?.description}
                  onUpdate={handleProductUpdate}
                />
              </div>
            </article>
          </div>
          {/* <div className="col-lg-8 col-12">Right Side</div> */}
        </div>
      </div>
    </div>
  );
}
