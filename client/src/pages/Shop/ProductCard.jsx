/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Rating from "../../components/Rating";
// eslint-disable-next-line react/prop-types
export default function ProductCard({ gridList, products }) {
  return (
    <div
      className={`shop-product-wrap row justify-content-center ${
        gridList ? "grid" : "list"
      }`}
    >
      {
        // eslint-disable-next-line react/prop-types
        products &&
          // eslint-disable-next-line react/prop-types
          products.map((product, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-6">
              <div className="product-item">
                {/* product images */}
                <div className="product-thumb lws">
                  <div className="pro-thumb">
                    <Link to={`/shop/${product._id}`}>
                      <img src={product.imageUrls[0]} alt="" />
                    </Link>
                  </div>
                  {/* product actions */}
                  {product.stock === 0 && (
                    <div
                      className="low-stock-banner"
                      style={{ fontSize: "1rem" }}
                    >
                      Out Of Stock
                    </div>
                  )}
                </div>
                {/* product content */}
                <div className="product-content">
                  <h5
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: 2,
                      lineHeight: "1.5rem",
                      maxHeight: "3rem",
                    }}
                  >
                    <Link to={`/shop/${product._id}`}>{product.name}</Link>
                  </h5>
                  <div className="productRating d-flex align-items-center justify-content-center">
                    <Rating product={product} />
                  </div>
                  <h6>Rs. {product.price}</h6>
                </div>
              </div>
              {/* list style */}
              <div className="product-list-item">
                {/* product images */}
                <div className="product-thumb">
                  <div className="pro-thumb">
                    <img src={product.img} alt="" height="auto" width="auto" />
                  </div>
                  {/* product actions */}
                </div>
                {/* product content */}
                <div className="product-content">
                  <h5>
                    <Link to={`/shop/${product._id}`}>{product.name}</Link>
                  </h5>
                  <p className="productRating">
                    {/* <Rating product={product._id} /> */}
                  </p>
                  <h6>Rs. {product.price}</h6>
                </div>
              </div>
            </div>
          ))
      }
    </div>
  );
}
