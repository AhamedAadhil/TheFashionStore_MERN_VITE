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

  const subtitle = "Why Choose Us";
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
    <div className="instructor-section style-2 padding-tb section-bg-ash">
      <div className="container">
        <div className="section-wrapper">
          <div className="row g-4 justify-content-center align-items-center row-cols-1 row-cols-md-3 row-col-xl-3">
            <div className="col">
              {countList.map((val, i) => (
                <div key={i} className="count-item">
                  <div className="count-inner">
                    <div className="count-icon">
                      <i>{val.icon}</i>
                    </div>
                    <div className="count-content">
                      <h2>
                        <span className="count">
                          <Countup end={val.count} />
                        </span>
                        <span>+</span>
                      </h2>
                      <p>{val.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col">
              <div className="instructor-content">
                <span className="subtitle">{subtitle}</span>
                <h2 className="title">{title}</h2>
                <p>{desc}</p>
                <Link to="/seller/register" className="lab-btn">
                  {btnText}
                </Link>
              </div>
            </div>
            <div className="col">
              <div className="instructor-thumb">
                <img src="/src/assets/images/instructor/01.png" alt="seller" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
