import { useEffect, useState } from "react";
import { LiaUsersSolid } from "react-icons/lia";

export default function WhoWeAre() {
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
  const buyerCount = Number(data.buyerCount) + 90;
  const sellerCount = Number(data.sellerCount) + 21;
  const clientsList = [
    {
      imgUrl: "/src/assets/images/clients/avater.jpg",
      imgAlt: "education thumb rajibraj91 rajibraj",
      text: "Join with Us",
    },
    {
      imgUrl: "/src/assets/images/clients/avater.jpg",
      imgAlt: "education thumb rajibraj91 rajibraj",
      text: "Join with Us",
    },
    {
      imgUrl: "/src/assets/images/clients/avater.jpg",
      imgAlt: "education thumb rajibraj91 rajibraj",
      text: "Join with Us",
    },
    {
      imgUrl: "/src/assets/images/clients/avater.jpg",
      imgAlt: "education thumb rajibraj91 rajibraj",
      text: "Join with Us",
    },
    {
      imgUrl: "/src/assets/images/clients/avater.jpg",
      imgAlt: "education thumb rajibraj91 rajibraj",
      text: "Join with Us",
    },
    {
      imgUrl: "/src/assets/images/clients/avater.jpg",
      imgAlt: "education thumb rajibraj91 rajibraj",
      text: "Join with Us",
    },
    {
      imgUrl: "/src/assets/images/clients/avater.jpg",
      imgAlt: "education thumb rajibraj91 rajibraj",
      text: "Join with Us",
    },
  ];

  const title = `More Than ${buyerCount} Customers and ${sellerCount} Sellers`;
  const desc =
    "Buy Products on any of your device with our website & enjoy your time what you want. Just Visit and start Shopping";
  return (
    <div className="clients-section style-2 padding-tb">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="title">{title}</h2>
          <p>{desc}</p>
        </div>
        {/* main content */}
        <div className="section-wrapper">
          <div className="clients">
            {clientsList.map((val, i) => (
              <div key={i} className="client-list">
                <div className="client-content">
                  <span>{val.text}</span>
                </div>
                <div className="client-thumb">
                  <img src={val.imgUrl} alt={val.imgAlt} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
