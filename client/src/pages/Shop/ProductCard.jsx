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
                <div className="product-thumb">
                  <div className="pro-thumb">
                    <Link to={`/shop/${product._id}`}>
                      <img src={product.imageUrls[0]} alt="" />
                    </Link>
                  </div>
                  {/* product actions */}
                </div>
                {/* product content */}
                <div className="product-content">
                  <h5
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      maxHeight: "3rem", // Adjust the value according to your requirement
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2, // Adjust the value to limit the lines
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    <Link to={`/shop/${product._id}`}>{product.name}</Link>
                  </h5>
                  <p className="productRating d-flex align-items-center justify-content-center">
                    <Rating product={product} />
                  </p>
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
