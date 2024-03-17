/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import Rating from "../../components/Rating";

export default function WishlistProductCard({ products }) {
  return (
    <section style={{ backgroundColor: "#F16126" }}>
      <div className="container py-5">
        {products.map((product, index) => (
          <div key={index} className="row justify-content-center mb-3">
            <div className="col-md-12 col-xl-10">
              <div className="card shadow-0 border rounded-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12 col-lg-3 col-xl-3 mb-4 mb-lg-0">
                      <div className="bg-image hover-zoom ripple rounded ripple-surface">
                        <img
                          src={product.imageUrls[0]}
                          className="w-100"
                          height="150px"
                          width="150px"
                          alt={product.name}
                        />
                        <a href="#!">
                          <div className="hover-overlay">
                            <div
                              className="mask"
                              style={{
                                backgroundColor: "rgba(253, 253, 253, 0.15)",
                              }}
                            ></div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-6">
                      <h5 style={{ color: "#F16126" }}>{product.name}</h5>
                      <Rating product={product} />
                      <p className="text-truncate pb-3 mb-md-0 border-bottom">
                        <b>Available Colors:</b> {product.color.join(", ")}{" "}
                        <br />
                        <b>Available Sizes:</b> {product.size.join(", ")}
                      </p>

                      <div className="mt-1 mb-2 text-muted small ">
                        <span>Seller:{product.seller.shopname}</span>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start ">
                      <div className="d-flex flex-row align-items-center mb-1">
                        <h4 className="mb-1 me-1">
                          Rs.{product.price.toFixed(2)}
                        </h4>
                        {product.totalsold && (
                          <span className="text-danger">
                            <s>${product.totalsold}</s>
                          </span>
                        )}
                      </div>
                      <h6
                        style={{ color: product.stock === 0 ? "red" : "green" }}
                      >
                        {product.stock === 0
                          ? `Out Of Stock`
                          : `Stock Available:${product.stock}`}
                      </h6>
                      <div className="d-flex flex-column mt-4">
                        <Link
                          to={`/shop/${product._id}`}
                          className="lab-btn text-center"
                          style={{ color: "white" }}
                          type="button"
                        >
                          View Details
                        </Link>
                        {/* <button
                          className="btn btn-outline-primary btn-sm mt-2"
                          type="button"
                        >
                          Add to wishlist
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
