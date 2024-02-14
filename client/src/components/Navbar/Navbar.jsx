import "./Navbar.module.css";
import { IoMdCart } from "react-icons/io";
import { FaReact } from "react-icons/fa";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-logo">
        <FaReact />
        <p>TFStore .</p>
      </div>
      <ul className="nav-menu">
        <li>Shop</li>
        <li>Men</li>
        <li>Women</li>
        <li>Kids</li>
      </ul>
      <div className="nav-login-cart">
        <button>Login</button>
        <IoMdCart />
      </div>
    </div>
  );
}
