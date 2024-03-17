import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

export default function Orders() {
  const [orders, setOrders] = useState([]);

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
    <div className="padding-tb">
      <div className="container">
        <h4 className=" text-center">Your Orders</h4>
        <div className="row">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="col-md-6 mb-4">
                <div className="card shadow">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="card-title">
                      Order ID: {order.paymentintent.id}
                    </h6>
                    <span
                      className="card-text rounded px-2"
                      style={{ border: "2px solid green" }}
                    >
                      {order.orderstatus}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <p>Payment Method: {order.paymentintent.method}</p>
                      <p>Amount: {order.paymentintent.amount}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>
                        Order Date:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        Last Update:{" "}
                        {new Date(order.lastupdate).toLocaleDateString()}
                      </p>
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
