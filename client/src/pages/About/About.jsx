import React from "react";
import PageHeader from "../../components/PageHeader";

export default function About() {
  const subtitle = "About Gallery Glam (GG)";
  const title =
    "Good Quality Products in Affortable Price and  Convenient Delivery";
  const desc =
    "We Gallery Glam (GG) provides an Imersive Shoping Experience to our Customers just by providing Uncomparable and Unbeatable Shopping Expericene From All Over the Srilanka and World";
  const content =
    "Gallery Glam (GG) is a platform that offers high quality products at affordable prices. We source our goods from reliable suppliers all over the world, ensuring we offer you the best";
  const number = "2500+";
  const sales = "Products sold every month.";
  const aboutList = [
    {
      imgUrl: "/src/assets/images/about/icon/01.jpg",
      imgAlt: "about icon rajibraj91 rajibraj",
      title: "Skilled Instructors",
      desc: "Distinctively provide acces mutfuncto users whereas communicate leveraged services",
    },
    {
      imgUrl: "/src/assets/images/about/icon/02.jpg",
      imgAlt: "about icon rajibraj91 rajibraj",
      title: "Get Certificate",
      desc: "Distinctively provide acces mutfuncto users whereas communicate leveraged services",
    },
    {
      imgUrl: "/src/assets/images/about/icon/03.jpg",
      imgAlt: "about icon rajibraj91 rajibraj",
      title: "Online Classes",
      desc: "Distinctively provide acces mutfuncto users whereas communicate leveraged services",
    },
  ];
  return (
    <div>
      <PageHeader currentPage={"About"} title={"About Gallery Glam"} />
      <div className="about-section style-3 padding-tb section-bg">
        <div className="container">
          <div className="row justify-content-center row-cols-xl-2 row-cols-1 align-items-center">
            <div className="col">
              <div className="about-left">
                <div className="about-thumb">
                  <img src="/src/assets/images/about/01.jpg" alt="" />
                </div>
                <div className="abs-thumb">
                  <img src="/src/assets/images/about/02.jpg" alt="" />
                </div>
                <div className="about-left-content">
                  <h4 style={{ color: "white" }}>{number}</h4>
                  <p>{sales}</p>
                </div>
              </div>
            </div>

            {/* 2nd col */}
            <div className="col">
              <div className="about-right">
                <div className="section-header">
                  <span className="subtitle">{subtitle}</span>
                  <h2 className="title">{title}</h2>
                  <p>{desc}</p>
                </div>
                <div className="section-wrapper">
                  <ul className="lab-ul">
                    {aboutList.map((val, i) => (
                      <li key={i}>
                        <div className="sr-left">
                          <img src={val.imgUrl} alt={val.imgAlt} />
                        </div>
                        <div className="sr-right">
                          <h5>{val.title}</h5>
                          <p>{val.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
