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
            <div key={index} className="col-lg-4 col-md-6 col-12">
              <div className="product-item">
                {/* product images */}
                <div className="product-thumb">
                  <div className="pro-thumb">
                    <img src={product.imageUrls[0]} alt="" />
                  </div>
                  {/* product actions */}
                  <div className="product-action-link">
                    <Link to={`/shop/${product._id}`}>
                      <i className="icofont-eye"></i>
                    </Link>
                    <Link to={`/shop/${product._id}`}>
                      <i className="icofont-heart"></i>
                    </Link>
                    <Link to={"/cart-page/"}>
                      <i className="icofont-cart-alt"></i>
                    </Link>
                  </div>
                </div>
                {/* product content */}
                <div className="product-content">
                  <h5>
                    <Link to={`/shop/${product._id}`}>{product.name}</Link>
                  </h5>
                  <p className="productRating">
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
                    <img src={product.img} alt="" />
                  </div>
                  {/* product actions */}
                  <div className="product-action-link">
                    <Link to={`/shop/${product._id}`}>
                      <i className="icofont-eye"></i>
                    </Link>
                    <Link to={`/shop/${product._id}`}>
                      <i className="icofont-heart"></i>
                    </Link>
                    <Link to={"/cart-page/"}>
                      <i className="icofont-cart-alt"></i>
                    </Link>
                  </div>
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
