import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo/logo.png";
import { BsFillInfoSquareFill } from "react-icons/bs";

export default function Navbar() {
  const [menuToggle, setMenuToggle] = useState(false);
  const [socialToggle, setsocialToggle] = useState(false);
  const [headerFixed, setHeaderFixed] = useState(false);

  // Close navbar when a page link is clicked
  const handlePageLinkClick = () => {
    if (window.innerWidth < 992) {
      setMenuToggle(false);
    }
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      setHeaderFixed(true);
    } else {
      setHeaderFixed(false);
    }
  });

  //d-md-none
  return (
    <header
      className={`header-section style-4 ${
        headerFixed ? "header-fixed fadeInUp" : ""
      }`}
    >
      {/* header top start */}

      <div className={`header-top d-md-none  ${socialToggle ? "open" : ""}`}>
        <div className="container">
          <div className="header-top-area">
            <Link className="lab-btn me-3" to="/signup">
              <span>Create Account</span>
            </Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
      {/* Header bottom */}
      <div className="header-bottom">
        <div className="container">
          <div className="header-wrapper">
            {/* Logo */}
            <div className="logo-search-acte">
              <div className="logo">
                <Link to="/">
                  <img src={logo} alt="logo" />
                </Link>
              </div>
            </div>
            {/* menu area */}
            <div className="menu-area">
              <div className="menu">
                <ul className={`lab-ul ${menuToggle ? "active" : ""}`}>
                  <li onClick={handlePageLinkClick}>
                    <Link to="/">Home</Link>
                  </li>
                  <li onClick={handlePageLinkClick}>
                    <Link to="/shop">Shop</Link>
                  </li>
                  <li onClick={handlePageLinkClick}>
                    <Link to="/blog">Blog</Link>
                  </li>
                  <li onClick={handlePageLinkClick}>
                    <Link to="/about">About</Link>
                  </li>
                  <li onClick={handlePageLinkClick}>
                    <Link to="/help">Help</Link>
                  </li>
                </ul>
              </div>
              {/* Sign in and Login */}
              <Link to="/sign-up" className="lab-btn me-3 d-none d-md-block">
                Create Account
              </Link>
              <Link to="/login" className="d-none d-md-block">
                Login
              </Link>
              {/* menu toggler */}
              <div
                onClick={() => setMenuToggle(!menuToggle)}
                className={`header-bar d-lg-none ${menuToggle ? "active" : ""}`}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
              {/* social toggler */}
              <div
                className="ellepsis-bar d-md-none"
                onClick={() => setsocialToggle(!socialToggle)}
              >
                <BsFillInfoSquareFill />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
