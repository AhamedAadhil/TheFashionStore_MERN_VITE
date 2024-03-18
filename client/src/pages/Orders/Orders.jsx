import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Badge } from "react-bootstrap";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getBuyerOrders = async () => {
      try {
        const response = await fetch("/api/buyer/actions/getOrders", {
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
        setOrders(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getBuyerOrders();
  }, []);

  return (
    <div className="padding-tb" style={{ backgroundColor: "#F4F4F4" }}>
      <div className="container">
        <h4 className="text-center" style={{ color: "#F16126" }}>
          Your Orders
        </h4>
        <div className="row">
          {orders && orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={order._id} className="col-md-6 mb-4">
                <div className="card shadow" style={{ borderColor: "#F16126" }}>
                  <div
                    className="card-header d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: "#F16126", color: "white" }}
                  >
                    <h6 className="card-title text-nowrap"># {index + 1}</h6>
                    <Badge bg="primary" pill className="px-2 py-2">
                      Status: {order.orderstatus}
                    </Badge>
                  </div>
                  <div className=" card-body">
                    <div className="delivery-info d-flex justify-content-between">
                      <p>
                        Deliver to:
                        <br /> <b>{currentUser.username}</b> <br />
                        <b>Mobile: {order?.deliveryaddress?.mobile}</b>
                        <br /> {order?.deliveryaddress?.address?.street},{" "}
                        {order?.deliveryaddress?.address?.city},{" "}
                        {order?.deliveryaddress?.address?.state}
                      </p>
                      <span>
                        <p
                          style={{ backgroundColor: "#F16126", color: "white" }}
                          className="px-2 rounded text-nowrap"
                        >
                          {" "}
                          Rs. {order.paymentintent.amount.toFixed(2)}
                        </p>
                      </span>
                    </div>
                    <div className="delivery-info">
                      <p>
                        From:
                        <br /> <b>{order?.seller?.shopname}</b> <br />
                      </p>
                    </div>
                    <div
                      style={{ backgroundColor: "#F16126" }}
                      className="rounded px-3 py-1 pb-0 my-3"
                    >
                      <p style={{ color: "white", fontSize: "1rem" }}>
                        Order ID: {order.paymentintent.id}
                      </p>
                      <p style={{ color: "white", fontSize: "1rem" }}>
                        Placed On:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p style={{ color: "white", fontSize: "1rem" }}>
                        Last Update On:{" "}
                        {new Date(order.lastupdate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Color</th>
                            <th>Size</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.products.map((product) => (
                            <tr
                              key={product._id}
                              onClick={() =>
                                navigate(`/shop/${product?.product?._id}`)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <td>
                                <img
                                  src={product?.product?.imageUrls[0]}
                                  alt={product?.product?.name}
                                  style={{ width: "50px", height: "50px" }}
                                />
                              </td>
                              <td>x{product.count}</td>
                              <td>{product.color}</td>
                              <td>{product.size}</td>
                              <td>{product?.product?.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="d-flex flex-column justify-content-center align-items-center py-2">
              <Alert variant="warning" className="no-products-message">
                You Don&apos;t Have Any Order History
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
                  Start Shopping
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
