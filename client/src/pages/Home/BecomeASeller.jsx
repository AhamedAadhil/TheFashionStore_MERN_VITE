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
    "Take a Step to Register in Our Platform as a Seller and Grow Your Business With Us, Just Click the Register Button To Continue Your Registration Process";
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
    <div className="instructor-section style-2 pt-2 section-bg-ash">
      <div className="container">
        <div className="section-wrapper">
          <div className="row justify-content-center align-items-center row-cols-1 row-cols-md-2 row-col-xl-1">
            {/* Count Items */}
            <div className="col">
              <div className="d-flex flex-wrap justify-content-center">
                {countList.map((val, i) => (
                  <div key={i} className="col-md-4 mb-3">
                    <div className="count-item text-center">
                      <div className="count-inner">
                        <div className="count-content text-center px-3">
                          <div
                            className="text-white"
                            style={{ fontSize: "22px" }}
                          >
                            {" "}
                            {val.icon}
                          </div>
                          <h2 className="count mb-1">
                            <Countup end={val.count} />
                          </h2>
                          <p className="mb-0" style={{ fontSize: "14px" }}>
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
            <div className="col mb-3">
              <div className="instructor-content text-center">
                <span className="subtitle">{subtitle}</span>
                <h2 className="title">{title}</h2>
                <p>{desc}</p>
                <Link to="/seller/register" className="lab-btn">
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
