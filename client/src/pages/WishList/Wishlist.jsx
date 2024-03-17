import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import WishlistProductCard from "./WishListProductCard";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getBuyerWishList = async () => {
      try {
        const response = await fetch("/api/buyer/actions/getWishList", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.log(response.message);
          return;
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getBuyerWishList();
  }, []);

  return (
    <div className="container padding-tb">
      <h4 className="text-center">My Wishlist</h4>
      <div className="row justify-content-center">
        {products && products.length > 0 ? (
          <WishlistProductCard products={products} />
        ) : (
          <div className="d-flex flex-column justify-content-center align-items-center py-2">
            <Alert variant="warning" className="no-products-message">
              Oops, Your Wishlist is Empty!
            </Alert>
            <Link to="/shop">
              <button
                className="rounded"
                style={{
                  color: "white",
                  backgroundColor: "#F16126",
                  width: "10rem",
                }}
              >
                Explore Products
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
