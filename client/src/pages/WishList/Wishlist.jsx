import { useEffect, useState } from "react";
import WishlistProductCard from "./WishListProductCard";
import { Button } from "react-bootstrap";
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
  });

  return (
    <div className="container padding-tb">
      <h4 className="text-center">Your Wishlist</h4>
      <div className="row justify-content-center">
        {products && products.length > 0 ? (
          <WishlistProductCard products={products} />
        ) : (
          <div className="col-lg-6 text-center">
            <p className="mb-4">There are no products in your wishlist.</p>
            <Link to="/shop">
              <Button variant="primary">Shop Now</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
