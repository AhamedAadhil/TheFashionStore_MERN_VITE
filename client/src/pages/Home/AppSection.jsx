import { Link } from "react-router-dom";

export default function AppSection() {
  const btnText = "SignUp For Free";
  const title = "Shop Anytime, Anywhere";
  const desc =
    "Take shop on your any device with our website . Shop online and get free shipping.";
  return (
    <div className="app-section padding-tb">
      <div className="container">
        <div className="section-header text-center">
          <Link to="/sign-up" className="lab-btn mb-4">
            {btnText}
          </Link>
          <h2 className="title">{title}</h2>
          <p>{desc}</p>
        </div>
        <div className="section-wrapper">
          <ul className="lab-ul">
            <li>
              <Link to="#">
                <img src="/src/assets/images/app/01.jpg" alt="" />
              </Link>
            </li>
            <li>
              <Link to="#">
                <img src="/src/assets/images/app/02.jpg" alt="" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
