import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import Button from "react-bootstrap/esm/Button";
import toast from "react-hot-toast";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [afterDiscount, setAfterDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCartData = async () => {
    try {
      let response = await fetch("/api/buyer/actions/getUserCart", {
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
      setCartItems(data.products);
      setCartTotal(data.carttotal);
      setAfterDiscount(data.totalafterdiscount);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/buyer/actions/deleteProductFromCart/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      setLoading(false);
      toast.success("Product Deleted From Cart!");
      // Refetch cart data after successful deletion
      fetchCartData();
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="shop-cart padding-tb">
      <div className="container">
        <div className="section-wrapper">
          {cartItems.length > 0 ? (
            <>
              {/* cart top */}
              <div className="cart-top">
                <table>
                  <thead>
                    <tr>
                      <th className="cat-product">Product</th>
                      <th className="cat-price">Price</th>
                      <th
                        className="cat-quantity"
                        style={{
                          float: "left",
                        }}
                      >
                        Quantity
                      </th>
                      <th className="cat-toprice">Total</th>
                      <th className="cat-edit">Edit</th>
                    </tr>
                  </thead>
                  {/* table body */}
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={index}>
                        <td className="product-item cat-product">
                          <div className="p-thumb">
                            <Link to="/shop">
                              {" "}
                              <img src={item.product.imageUrls[0]} alt="" />
                            </Link>
                          </div>
                          <div className="p-content">
                            <Link to="/shop">{item.product.name}</Link>
                          </div>
                        </td>
                        <td className="cat-price">Rs. {item.product.price}</td>
                        <td className="cat-quantity">{item.count}</td>
                        <td className="cat-toprice">
                          {item.price * item.count}
                        </td>
                        <td className="cat-edit">
                          <Link onClick={() => handleDelete(item._id)}>
                            <MdDeleteOutline
                              style={{ color: "red", fontSize: "1.5rem" }}
                            />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* cart top ends */}
              {/* cart bottom */}
              <div className="cart-bottom">
                <div className="cart-checkout-box">
                  <form className="coupon">
                    <input
                      type="text"
                      name="coupon"
                      id="coupon"
                      className="cart-page-input-text"
                      placeholder="Coupon Code"
                      style={{ textTransform: "uppercase" }}
                    />
                    <input type="submit" value="Apply Coupon" />
                  </form>
                  <form action="" className="cart-checkout">
                    {/* <input type="text" value="Update Cart" /> */}
                    <div>
                      <Button
                        variant="primary"
                        className="py-2"
                        // onClick={handleCheckout}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </form>
                </div>
                {/* checkout box end */}
                {/* Shopping box */}
                <div className="shiping-box">
                  <div className="row ">
                    <div className="col-md-6 col-12">
                      <div className="calculate-shiping">
                        <h3>Calculate Shiping</h3>
                        <div className="outline-select">
                          <select>
                            <option value="uk">United Kingdom (UK)</option>
                            <option value="uk">VBangalaDesh</option>
                            <option value="uk">United Pakistan (UK)</option>
                            <option value="uk">India</option>
                          </select>
                          <span className="select-icon">
                            <i className="icofont-rounded-down"></i>
                          </span>
                        </div>
                        <div className="outline-select shipping-select">
                          <select>
                            <option value="uk">Akp</option>
                            <option value="uk">Kalmunai</option>
                            <option value="uk">Palamunai</option>
                            <option value="uk">Pottuvil</option>
                          </select>
                          <span className="select-icon">
                            <i className="icofont-rounded-down"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          name="postalcode"
                          id="postalcode"
                          className="cart-page-input-text"
                          placeholder="PostalCode/ZIP *"
                        />
                        <button type="submit">Update Address</button>
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="cart-overview">
                        <h3>Cart Totals</h3>
                        <ul className="lab-ul">
                          <li>
                            <span className="pull-left">Cart Total</span>
                            <p className="pull-right">
                              Rs. {cartTotal.toFixed(2)}
                            </p>
                          </li>
                          <li>
                            <span className="pull-left">Coupon Discount</span>
                            <p className="pull-right">
                              Rs.{" "}
                              {Number(cartTotal.toFixed(2)) -
                                Number(afterDiscount.toFixed(2))}
                            </p>
                          </li>
                          <li>
                            <span className="pull-left">Shipping Fee</span>
                            <p
                              className="pull-right"
                              style={{ color: "green" }}
                            >
                              Free Shipping
                            </p>
                          </li>
                          <li>
                            <span className="pull-left">Order Total</span>
                            <p className="pull-right">
                              Rs. {afterDiscount.toFixed(2)}
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p
              className="text-center my-4"
              style={{
                fontSize: "2rem",
                color: "orange",
                fontWeight: "600",
              }}
            >
              Your cart is empty
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
