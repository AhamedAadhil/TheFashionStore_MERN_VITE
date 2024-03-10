/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import Rating from "../../components/Rating";

export default function WishlistProductCard({ products }) {
  return (
    <div className="row row-cols-2 row-cols-md-2 row-cols-lg-3 g-4">
      {products.map((product, index) => (
        <div key={index} className="col">
          <div className="card h-100">
            <Link to={`/shop/${product._id}`}>
              <img
                src={product.imageUrls[0]}
                className="card-img-top"
                alt={product.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
            </Link>
            <div
              className="card-body"
              style={{ maxHeight: "150px", overflow: "hidden" }}
            >
              <h5
                className="card-title"
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
                <Link
                  to={`/shop/${product._id}`}
                  className="text-decoration-none text-dark"
                >
                  {product.name}
                </Link>
              </h5>
              <Rating product={product} />
              <h6 className="card-subtitle mb-2 text-muted">
                Rs. {product.price}
              </h6>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
