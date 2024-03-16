/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Search({ products }) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts([]);
      return;
    }
    const filtered = products.filter((product) =>
      product.name.toLowerCase().trim().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <div className="widget widget-search">
      <form action="" className="search-wrapper mb-3">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <i className="icofont-search-2"></i>
        </button>
      </form>
      {/* showing research result */}
      <div>
        {filteredProducts.map((product, i) => (
          <Link
            to={`/shop/${product._id}`}
            key={i}
            className="product-link"
            style={{ textDecoration: "none" }}
          >
            <div
              className="d-flex align-items-center mb-3 gap-2 px-2 py-2"
              style={{
                border: "1px solid #dee2e6", // Border color
                borderRadius: "8px", // Border radius
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", // Shadow effect
              }}
            >
              <img
                src={product.imageUrls[0]} // Displaying the first image URL
                alt={product.name} // Alt text for the image
                className="mr-3 rounded"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <div>
                <p style={{ fontSize: "1rem", color: "#F16126" }}>
                  {product.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
