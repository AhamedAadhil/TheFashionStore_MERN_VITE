import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo/Main-Logo.png";
import { useSelector, useDispatch } from "react-redux";
import { RiLoginCircleFill } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { RiUserAddFill } from "react-icons/ri";
import { TiShoppingCart } from "react-icons/ti";
import { Badge } from "react-bootstrap";
import {
  MdOutlineManageAccounts,
  MdFavoriteBorder,
  MdOutlineShoppingBag,
} from "react-icons/md";
import {
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuToggle, setMenuToggle] = useState(false);
  const [socialToggle, setsocialToggle] = useState(false);
  const [headerFixed, setHeaderFixed] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

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

  const handleLogout = async () => {
    try {
      dispatch(signOutUserStart());
      setLoading(true);
      const response = await fetch("/api/buyer/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        dispatch(signOutUserFailure(data.message));
        toast.error(data.message);
        return;
      }
      setLoading(false);
      dispatch(signOutUserSuccess(data));
      navigate("/");
      toast.success(data);
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      setLoading(false);
      toast.error(error.message);
    }
  };

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
            {!currentUser && (
              <>
                <Link
                  className="lab-btn me-3"
                  to="/register"
                  onClick={() => setsocialToggle(!socialToggle)}
                >
                  <span style={{ color: "white" }}>
                    {" "}
                    <RiUserAddFill /> &nbsp; Create Account
                  </span>
                </Link>
                <Link
                  to="/login"
                  onClick={() => setsocialToggle(!socialToggle)}
                >
                  <RiLoginCircleFill /> Login
                </Link>
              </>
            )}
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
                  <img
                    src={logo}
                    alt="logo"
                    style={{
                      height: "52px",
                      width: "auto",
                    }}
                  />
                </Link>
              </div>
            </div>
            {/* menu area */}
            <div className="menu-area">
              <div className="menu">
                <ul className={`lab-ul ${menuToggle ? "active" : ""} `}>
                  <li onClick={handlePageLinkClick}>
                    <Link to="/">Home</Link>
                  </li>
                  <li onClick={handlePageLinkClick}>
                    <Link to="/shop">Shop</Link>
                  </li>
                  {/* <li onClick={handlePageLinkClick}>
                    <Link to="/cart">My Cart</Link>
                  </li> */}
                  <li onClick={handlePageLinkClick}>
                    <Link to="/about">About</Link>
                  </li>
                  <li onClick={handlePageLinkClick}>
                    <Link to="/help">Help</Link>
                  </li>
                </ul>
              </div>
              {/* CART ICON */}
              {currentUser && (
                <Link
                  to="/cart"
                  style={{
                    fontSize: "1.5rem",
                    position: "relative",
                  }}
                  className="px-2 mx-2"
                >
                  <TiShoppingCart />
                  {/* <Badge
                    style={{
                      fontSize: "0.7rem",
                      display:
                        currentUser?.cart?.products?.length > 0
                          ? "inline-block"
                          : "none",
                    }}
                    pill
                    bg="secondary"
                    className="position-absolute top-0 end-9"
                  >
                    {currentUser?.cart?.products?.length}
                  </Badge> */}
                </Link>
              )}
              {/* Sign in and Login */}
              {!currentUser && (
                <>
                  <Link
                    to="/register"
                    className="lab-btn me-3 d-none d-md-block"
                  >
                    <RiUserAddFill /> Create Account
                  </Link>
                  <Link to="/login" className="d-none d-md-block">
                    <RiLoginCircleFill /> <b>Login</b>
                  </Link>
                </>
              )}
              {currentUser && (
                <div>
                  <img
                    src={
                      currentUser?.avatar ||
                      "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                    }
                    alt="User"
                    className="user-avatar"
                    onClick={toggleUserMenu}
                  />
                  {userMenuOpen && (
                    <div className="dropdown-menu-container">
                      <div className="dropdown-menu show ">
                        <ul className="list-group ">
                          <li className="list-group-item border-top-0 ">
                            {currentUser.email} <br /> @{currentUser.username}
                          </li>
                          <Link
                            onClick={toggleUserMenu}
                            to="/me"
                            className="d-flex justify-content-between"
                          >
                            <li
                              className="list-group-item border-0"
                              style={{
                                color: "#F16126",
                              }}
                            >
                              <MdOutlineManageAccounts />
                              &nbsp; My Account
                            </li>
                          </Link>
                          <Link
                            to="/my-orders"
                            onClick={toggleUserMenu}
                            className="d-flex justify-content-between"
                          >
                            <li
                              className="list-group-item border-0"
                              style={{
                                color: "#F16126",
                              }}
                            >
                              <MdOutlineShoppingBag />
                              &nbsp; My Orders
                            </li>
                          </Link>
                          <Link
                            onClick={toggleUserMenu}
                            to="/my-wishlist"
                            className="d-flex justify-content-between"
                          >
                            <li
                              className="list-group-item border-0"
                              style={{
                                color: "#F16126",
                              }}
                            >
                              <MdFavoriteBorder /> &nbsp; My Wishlist
                            </li>
                          </Link>
                          <Link onClick={handleLogout}>
                            <li
                              className="list-group-item border-bottom-0"
                              style={{
                                color: "red",
                              }}
                            >
                              <BiLogOut />
                              &nbsp; Logout
                            </li>
                          </Link>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                {!currentUser && <FaArrowAltCircleUp />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
