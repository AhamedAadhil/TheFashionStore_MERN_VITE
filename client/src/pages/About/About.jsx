import TrendyCollection from "../../assets/images/about/icon/5.png";
import QualityAssurance from "../../assets/images/about/icon/6.png";
import CustomerSatisfication from "../../assets/images/about/icon/4.png";
import im1 from "../../assets/images/about/4.png";
import im2 from "../../assets/images/about/5.png";

export default function About() {
  const subtitle = "About Gallery Glam (GG)";
  const title =
    "Good Quality Products in Affortable Price and  Convenient Delivery";
  const desc =
    "We Gallery Glam (GG) provides an Imersive Shoping Experience to our Customers just by providing Uncomparable and Unbeatable Shopping Expericene From All Over the Srilanka";

  const number = "500+";
  const sales = "Products sold every month.";
  const aboutList = [
    {
      imgUrl: TrendyCollection,
      imgAlt: "Icon",
      title: "Trendy Collections",
      desc: "Explore our vast collection of trendy dresses, stylish shoes, chic kids' wear, elegant accessories, and more.",
    },
    {
      imgUrl: QualityAssurance,
      imgAlt: "Icon",
      title: "Quality Assurance",
      desc: "We ensure that every product meets the highest standards of quality, ensuring your satisfaction with every purchase.",
    },
    {
      imgUrl: CustomerSatisfication,
      imgAlt: "Icon",
      title: "Customer Satisfaction",
      desc: "Your satisfaction is our top priority. We're dedicated to providing exceptional service and ensuring a seamless shopping experience for you.",
    },
  ];

  return (
    <div>
      {/* <PageHeader currentPage={"About"} title={"About Gallery Glam"} /> */}
      <div
        className="about-section style-3 padding-tb section-bg"
        style={{ paddingTop: "80px" }}
      >
        <div className="container">
          <div className="row justify-content-center row-cols-xl-2 row-cols-1 align-items-center">
            <div className="col">
              <div className="about-left">
                <div className="about-thumb">
                  <img src={im1} alt="" />
                </div>
                <div className="abs-thumb">
                  <img src={im2} alt="" />
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
