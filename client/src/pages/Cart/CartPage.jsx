import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import Button from "react-bootstrap/esm/Button";
import toast from "react-hot-toast";
import { FaCartPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import MobileNumberModel from "../../components/MobileNumberModel";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedAddress, setSelectedAddress] = useState({});
  const [cartTotal, setCartTotal] = useState(0);
  const [afterDiscount, setAfterDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [showMobileNumberModel, setShowMobileNumberModel] = useState(false);
  const buttonText = !selectedAddressId ? "Add New Address" : "Update Address";
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleCouponChange = (e) => {
    setCoupon(e.target.value);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setSelectedAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));

    // Update formData with the changed attribute
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const fetchCartData = async () => {
    try {
      setLoading(true);
      let response = await fetch("/api/buyer/actions/getUserCart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        setLoading(false);
        console.log(response.message);
        return;
      }
      const data = await response.json();
      setLoading(false);
      setCartItems(data.products);
      setCartTotal(data.carttotal);
      setAfterDiscount(data.totalafterdiscount);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const fetchAddress = async () => {
    try {
      setLoading(true);
      let response = await fetch("/api/buyer/actions/getAllAddress", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        setLoading(false);
        console.log(response.message);
        return;
      }
      const data = await response.json();
      setLoading(false);
      setAddressList(data);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCartData();
    fetchAddress();
    if (!currentUser.mobile) {
      setShowMobileNumberModel(true);
    }
  }, [currentUser.mobile]);

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

  const updateAddress = async (addressId) => {
    if (!addressId) {
      toast.error("Please Select an Address To Update!");
      return;
    }
    if (Object.keys(formData).length === 0) {
      toast.error("Please Change Something To Update Your Address!");
      return;
    }

    if (formData === "") {
      toast.error("Please Change Something To Update Your Address!");
      return;
    }
    if (formData.label === "") {
      toast.error("Please Enter Address Label!");
      return;
    }
    if (formData.housenumber === "") {
      toast.error("Please Enter HouseNumber!");
      return;
    }
    if (formData.street === "") {
      toast.error("Please Enter the Street!");
      return;
    }
    if (formData.city === "") {
      toast.error("Please Enter the City!");
      return;
    }
    if (formData.state === "") {
      toast.error("Please Enter the State!");
      return;
    }
    try {
      setLoading(true);
      let response = await fetch(
        `/api/buyer/actions/updateAddress/${addressId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        toast.error("Failed to Update Address!");
        return;
      }
      setLoading(false);
      setAddressList(data);
      toast.success("Address Updated!");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const CreateAddress = async () => {
    if (formData === "") {
      toast.error("Please Add Details To Create Address!");
      return;
    }
    if (formData.label === "") {
      toast.error("Please Enter Address Label!");
      return;
    }
    if (formData.housenumber === "") {
      toast.error("Please Enter HouseNumber!");
      return;
    }
    if (formData.street === "") {
      toast.error("Please Enter the Street!");
      return;
    }
    if (formData.city === "") {
      toast.error("Please Enter the City!");
      return;
    }
    if (formData.state === "") {
      toast.error("Please Enter the State!");
      return;
    }
    try {
      setLoading(true);
      let response = await fetch("/api/buyer/actions/askAddress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        toast.error(response.message);
        return;
      }
      setLoading(false);
      setAddressList(data);
      toast.success("New Address Added!");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      setLoading(true);
      let response = await fetch(
        `/api/buyer/actions/deleteAddress/${addressId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        toast.error(response.message);
        return;
      }
      setLoading(false);
      toast.success(data.message);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const applyCoupon = async (e) => {
    e.preventDefault();
    if (coupon === "" || !coupon) {
      return toast.error("Please Enter Coupon Code!");
    }
    try {
      const response = await fetch("/api/buyer/actions/applyCoupon", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coupon: coupon }),
      });
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      setLoading(false);
      setCartItems(data.products);
      setCartTotal(data.carttotal);
      setAfterDiscount(data.totalafterdiscount);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const placeOrder = async (e) => {
    try {
      if (
        selectedAddressId === "" ||
        !selectedAddressId ||
        selectedAddress === "" ||
        !selectedAddress
      ) {
        return toast.error("Please Select a Delivery Address!");
      }
      if (currentUser.mobile === "" || !currentUser.mobile) {
        toast.error("Please Enter a Mobile Number!");
        setShowMobileNumberModel(true);
        return;
      }
      e.preventDefault();
      setLoading(true);
      const response = await fetch("/api/buyer/actions/order/cod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      setLoading(false);
      navigate("/");
      toast.success("Your Order Has Been Placed!");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="shop-cart padding-tb">
      {showMobileNumberModel && <MobileNumberModel currentUser={currentUser} />}
      <div className="container">
        <div className="section-wrapper">
          {cartItems?.length > 0 ? (
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
                            <Link to="/shop">
                              {item.product.name} <br /> Color: {item.color}{" "}
                              <br /> Size: {item.size}
                            </Link>
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
                      required
                      type="text"
                      name="coupon"
                      id="coupon"
                      onChange={handleCouponChange}
                      value={coupon}
                      className="cart-page-input-text"
                      placeholder="Coupon Code"
                      style={{ textTransform: "uppercase" }}
                    />
                    <input
                      type="submit"
                      value="Apply Coupon"
                      onClick={applyCoupon}
                    />
                  </form>
                  <form className="cart-checkout">
                    {/* <input type="text" value="Update Cart" /> */}
                    <div>
                      <Button
                        variant="primary"
                        className="py-2"
                        onClick={placeOrder}
                        style={{ width: "9rem" }}
                      >
                        Place Order
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
                        <h3>Shiping Details</h3>
                        <div className="outline-select">
                          <select
                            value={selectedAddressId}
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              if (selectedValue === "select") {
                                setSelectedAddress({});
                                setSelectedAddressId("");
                                setFormData({});
                                // return toast.error("Please Select an Address!");
                              } else {
                                const selectedId = selectedValue;
                                const selectedAddress = addressList.find(
                                  (address) => address._id === selectedId
                                );
                                setFormData({});
                                setSelectedAddress(selectedAddress);
                                setSelectedAddressId(selectedId);
                              }
                            }}
                          >
                            <option
                              value="select"
                              defaultChecked
                              style={{ fontWeight: "500" }}
                            >
                              Add New Address
                            </option>
                            <option
                              style={{ backgroundColor: "lightgray" }}
                              disabled
                            >
                              &nbsp;
                            </option>
                            {addressList.map((address, i) => (
                              <option value={address._id} key={i}>
                                {address.label}
                              </option>
                            ))}
                          </select>
                          <span className="select-icon">
                            <i className="icofont-rounded-down"></i>
                          </span>
                        </div>
                        <div className="d-flex  align-items-center justify-content-between">
                          <input
                            type="text"
                            name="label"
                            id="label"
                            className="cart-page-input-text"
                            placeholder="Label *"
                            value={selectedAddress.label || ""}
                            onChange={handleAddressChange}
                          />
                          <input
                            type="text"
                            name="housenumber"
                            id="housenumber"
                            className="cart-page-input-text"
                            placeholder="House Number *"
                            value={selectedAddress.housenumber || ""}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <input
                          type="text"
                          name="street"
                          id="street"
                          placeholder="Street *"
                          className="mb-4"
                          value={selectedAddress.street || ""}
                          onChange={handleAddressChange}
                        />
                        <div className="d-flex  align-items-center justify-content-between">
                          <input
                            type="text"
                            name="city"
                            id="city"
                            className="cart-page-input-text"
                            placeholder="City *"
                            value={selectedAddress.city || ""}
                            onChange={handleAddressChange}
                          />
                          <input
                            type="text"
                            name="state"
                            id="state"
                            className="cart-page-input-text"
                            placeholder="District *"
                            value={selectedAddress.state || ""}
                            onChange={handleAddressChange}
                          />
                        </div>

                        {/*  onClick={()=>updateAddress(addressId)} */}
                        <div className="d-flex justify-content-around align-items-center">
                          <button
                            onClick={() => {
                              buttonText === "Update Address"
                                ? updateAddress(selectedAddressId)
                                : CreateAddress();
                            }}
                            type="submit"
                            style={{
                              display: Object.keys(formData).length
                                ? "block"
                                : "none",
                            }}
                          >
                            {buttonText}
                          </button>

                          <MdDeleteOutline
                            onClick={() => deleteAddress(selectedAddressId)}
                            className="link-danger"
                            style={{
                              color: "red",
                              fontSize: "1.5rem",
                              display:
                                buttonText === "Update Address"
                                  ? "block"
                                  : "none",
                            }}
                          />
                        </div>
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
                            <p
                              className="pull-right"
                              style={{ color: "green" }}
                            >
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
            <div className="d-flex.flex-column justify-content-center align-items-center text-center">
              <p
                className="text-center my-4"
                style={{
                  fontSize: "1.5rem",
                  color: "orange",
                  fontWeight: "600",
                }}
              >
                <FaCartPlus className="mx-3" />
                Your cart is empty
              </p>
              <button
                className="lab-btn text-white"
                onClick={() => navigate("/shop")}
              >
                Shop Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
