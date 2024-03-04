import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Countup from "react-countup";
import { FaUsers } from "react-icons/fa";
import { PiUsersFourFill } from "react-icons/pi";
import { MdSell } from "react-icons/md";

export default function BecomeASeller() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/buyer/actions/getCount", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataFromResponse = await response.json();
        if (!response.ok) {
          console.log(response.message);
        }
        setData(dataFromResponse);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const subtitle = "Join as Merchant?";
  const title = "Become a Seller";
  const desc =
    "Register as a seller on our platform to grow your business with ease. Click the register button to get started with your registration process.";
  const btnText = "Register Now!";

  const countList = [
    {
      icon: <FaUsers />,
      count: Number(data.buyerCount) + 90,
      text: "Active Buyers",
    },
    {
      icon: <PiUsersFourFill />,
      count: Number(data.sellerCount) + 21,
      text: "Active Sellers",
    },
    {
      icon: <MdSell />,
      count: 2500,
      text: "Successful Sales",
    },
  ];
  return (
    <div className="instructor-section style-2 section-bg-ash my-3">
      <div className="container">
        <div className="section-wrapper">
          <div className="row justify-content-center align-items-center row-cols-1 row-cols-md-2 row-col-xl-1">
            {/* Count Items */}
            <div className="col">
              <div className="d-flex flex-wrap justify-content-center">
                {countList.map((val, i) => (
                  <div key={i} className="col-md-4">
                    <div className="count-item text-center">
                      <div className="count-inner">
                        <div className="count-content text-center px-3">
                          <div
                            className="text-white"
                            style={{ fontSize: "1.2rem" }}
                          >
                            {" "}
                            {val.icon}
                          </div>
                          <h2
                            className="count mb-1"
                            style={{ fontSize: "1.4rem" }}
                          >
                            <Countup end={val.count} />
                            <span>+</span>
                          </h2>
                          <p className="mb-0" style={{ fontSize: "0.8rem" }}>
                            {val.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Content for Becoming a Seller */}
            <div className="col mb-4">
              <div className="instructor-content text-center pt-2">
                <span className="subtitle" style={{ fontSize: "0.8rem" }}>
                  {subtitle}
                </span>
                <h3 className="title">{title}</h3>
                <p style={{ fontSize: "0.8rem", fontWeight: "600" }}>{desc}</p>
                <Link
                  to="/seller/register"
                  className="lab-btn"
                  style={{ fontSize: "0.8rem" }}
                >
                  {btnText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
