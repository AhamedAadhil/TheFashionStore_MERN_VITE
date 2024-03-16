import { Link } from "react-router-dom";

const title = "About Gallery Glam (GG)";
const desc =
  "Explore Gallery Glam(GG): Your go-to source for fashion and beauty inspiration. Elevate your style with us – for all fashionistas!";
// const ItemTitle = "Quick Links";
// const quickTitle = "Categories";
// const tweetTitle = "Policy";

const addressList = [
  { iconName: "icofont-google-map", text: "Akkaraipattu, Srilanka" },
  { iconName: "icofont-phone", text: "+94 76 66 65 369" },
  { iconName: "icofont-envelope", text: "galleryglam.contact@gmail.com" },
];

const socialList = [
  {
    iconName: "icofont-instagram",
    siteLink:
      "https://www.instagram.com/galleryglam.lk?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    className: "instagram",
  },
  { iconName: "icofont-facebook", siteLink: "#", className: "facebook" },
  { iconName: "icofont-twitter", siteLink: "#", className: "twitter" },
  { iconName: "icofont-linkedin", siteLink: "#", className: "linkedin" },
  { iconName: "icofont-pinterest", siteLink: "#", className: "pinterest" },
];

// const policies = [
//   { policy: "Return Policy", siteLink: "#" },
//   { policy: "Payment Policy", siteLink: "#" },
//   { policy: "Terms of Use", siteLink: "#" },
//   { policy: "Shipping Policy", siteLink: "#" },
// ];

// const ItemList = [
//   { text: "All Products", link: "/shop" },
//   { text: "Shop", link: "/shop" },
//   { text: "My Orders", link: "/my-orders" },
//   { text: "WishList", link: "/wishlist" },
//   { text: "Account", link: "/profile" },
//   { text: "About", link: "/about" },
//   { text: "Help", link: "/help" },
// ];

// const quickList = [
//   { text: "Summer Sessions", link: "#" },
//   { text: "Events", link: "#" },
//   { text: "Gallery", link: "#" },
//   { text: "Forums", link: "#" },
//   { text: "Privacy Policy", link: "#" },
//   { text: "Terms of Use", link: "#" },
// ];

export default function Footer() {
  return (
    <footer className="style-2">
      <div className="footer-top dark-view padding-tb">
        <div className="container">
          <div className="row g-4 row-cols-xl-1 row-cols-sm-2 row-cols-1 justify-content-center">
            <div className="col">
              <div className="footer-item our-address">
                <div className="footer-inner">
                  <div className="footer-content">
                    <div className="title">
                      <h4>{title}</h4>
                    </div>
                    <div className="content">
                      <p>{desc}</p>
                      <ul className="lab-ul office-address">
                        {addressList.map((val, index) => (
                          <li key={index}>
                            <i className={val.iconName}>{val.text}</i>
                          </li>
                        ))}
                      </ul>
                      <ul className="lab-ul social-icons">
                        {socialList.map((val, index) => (
                          <li key={index}>
                            <Link to="#" className={val.className}>
                              <i className={val.iconName}>{val.text}</i>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col">
              <div className="footer-item our-address">
                <div className="footer-inner">
                  <div className="footer-content">
                    <div className="title">
                      <h4>{ItemTitle}</h4>
                    </div>
                    <div className="content">
                     
                      <ul className="lab-ul office-address">
                        {ItemList.map((val, index) => (
                          <li key={index}>
                            <Link to="#">{val.text}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* line 2 */}
            {/* <div className="col">
              <div className="footer-item our-address">
                <div className="footer-inner">
                  <div className="footer-content">
                    <div className="title">
                      <h4>{quickTitle}</h4>
                    </div>
                    <div className="content">
                    
                      <ul className="lab-ul office-address">
                        {quickList.map((val, index) => (
                          <li key={index}>
                            <Link to="#">{val.text}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* line 3 */}
            {/* <div className="col">
              <div className="footer-item our-address">
                <div className="footer-inner">
                  <div className="footer-content">
                    <div className="title">
                      <h4>{tweetTitle}</h4>
                    </div>
                    <div className="content">
                    
                      <ul className="lab-ul office-address">
                        {policies.map((val, index) => (
                          <li key={index}>
                         
                            <Link to={val.siteLink}>{val.policy}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* Footer bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="section-wrapper justify-content-center">
            <p>
              &copy; {new Date().getFullYear()} <Link to="/">GG</Link>Developed
              by{" "}
              <Link
                to="https://www.linkedin.com/in/ahamed-aathil-0b52b2136/"
                target="_blank"
              >
                Ahamed Aathil
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
