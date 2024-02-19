import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { Autoplay } from "swiper/modules";
import Rating from "../../components/Rating";
import Review from "./Review";

export default function SingleProduct() {
  const [product, setProduct] = useState(undefined);

  const { id } = useParams();

  // Fetch the product data when the component mounts.
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.log(response.message);
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProduct();
  }, [id]);

  const [productQuantity, setProductQuantity] = useState(1);
  const [productCoupon, setProductCoupon] = useState(1);
  const [productColor, setProductColor] = useState("Select Color");
  const [productSize, setProductSize] = useState("Select Size");

  const handleSizeChange = (size) => {
    setProductSize(size); // Set the selected product size to the state variable
  };

  const handleColorChange = (event) => {
    setProductColor(event.target.value); // Set the selected product size to the state variable
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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="shop-single padding-tb aside-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-12">
            <article>
              <div className="product-details">
                <div className="row align-items-center">
                  <div className="col-md-6 col-12">
                    <div className="product-thumb">
                      <div className="swiper-container pro-single-top">
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
                                <div className="single-thumb"></div>
                                <img src={imageUrl} alt="product" />
                              </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className="pro-single-prev">
                          <i className="icofont-rounded-right"></i>
                        </div>
                        <div className="pro-single-next">
                          <i className="icofont-rounded-left"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="post-content">
                      <div>
                        <h4>{product?.name}</h4>
                        <p className="rating">
                          {product && <Rating product={product} />}
                        </p>

                        <h4>Rs. {product?.price}</h4>

                        <h6>
                          {" "}
                          <b>Brand:</b> {product?.brand.title.toUpperCase()}
                        </h6>
                        <h6>
                          <b> Quality:</b>
                          {product?.quality === "a_grade"
                            ? "A-GRADE"
                            : "ORIGINAL"}
                        </h6>
                        <h6>
                          <b>Seller:</b> {product?.seller.shopname}
                        </h6>

                        {/* <p>
                          <b>Description:</b> {product?.description}
                        </p> */}
                      </div>
                      {/* cart component */}
                      <div>
                        <form onSubmit={handleSubmit}>
                          {/* select size */}
                          <div className="select-product size d-flex align-items-center">
                            <p className="m-0 me-2">Size:</p>
                            <div className="btn-group gap-2">
                              {product &&
                                product.size.map((size, i) => (
                                  <button
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
                                product.color.map((color, i) => (
                                  <option value={color} key={i}>
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
                          <button type="submit" className="lab-btn">
                            <span>Add to Cart</span>
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
                <Review id={id} desc={product?.description} />
              </div>
            </article>
          </div>
          {/* <div className="col-lg-8 col-12">Right Side</div> */}
        </div>
      </div>
    </div>
  );
}
