/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Search({ gridList }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const api = `/api/product/allProducts?description=${searchTerm.toLowerCase()}`;
      try {
        const response = await fetch(api, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.log(response.message);
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProducts();
  }, [searchTerm]);

  // const filteredProducts = products.filter((product) => {
  //   product.description.toLowerCase().includes(searchTerm.toLowerCase());
  // });

  return (
    <div className="widget widget-search">
      <form action="" className="search-wrapper mb-3">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="search..."
          defaultValue={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <i className="icofont-search-2"></i>
        </button>
      </form>
      {/* showing reseach result */}
      <div>
        {searchTerm &&
          products.map((product, i) => (
            <Link to={`/shop/${product._id}`} key={i}>
              <div className="d-flex gap-3 p-2">
                <div>
                  {/* <div className="pro-thumb h-25">
                    <img
                      src={product.imageUrls[0]}
                      alt=""
                      width={70}
                      className="flex-{grow|shrink}-0"
                    />
                  </div> */}
                  <div className="product-content">
                    <p>
                      <Link to={`/shop/${product._id}`}>{product.name}</Link>
                    </p>
                    <h6>Rs. {product.price}</h6>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
