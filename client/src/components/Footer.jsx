import { Link } from "react-router-dom";
import {
  FaGithub,
  FaInstagram,
  FaFacebookF,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <footer className="py-4">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-5">
              <div className="footer-top-data d-flex gap-30 align-items-center">
                <img
                  src="images/newsletter.svg"
                  style={{ height: "35px", width: "35px" }}
                  alt="newsletter"
                />
                <h2 className="mb-0 text-white">Subscribe to our newsletter</h2>
              </div>
            </div>
            <div className="col-7">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-1"
                  placeholder="Your Email Address"
                  aria-label="Your Email Address"
                  aria-describedby="basic-addon2"
                />
                <span className="input-group-text p-2" id="basic-addon2">
                  Subscribe
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <footer className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-4">
              <h4 className="text-white mb-4">Contact Us</h4>
              <div>
                <address className="text-white fs-6">
                  TFStore <br />
                  No 79, Mudaliyar Road, Akkaraipattu-04 <br />
                  Postal Code: 32400 <br />
                  Srilanka
                </address>
                <a
                  href="tel:+94766611917"
                  className="mt-3 d-block mb-1 text-white"
                >
                  +94 76 66 119 17
                </a>
                <a
                  href="mailto:ahamedaathil.5@gmail.com"
                  className="mt-2 d-block mb-2 text-white"
                >
                  ahamedaathil.5@gmail.com
                </a>
                <div className="social-icons d-flex align-items-center gap-30 mt-4">
                  <a
                    target="_blank"
                    className="text-white"
                    href="https://github.com/AhamedAadhil"
                  >
                    <FaGithub className="fs-4" />
                  </a>
                  <a
                    target="_blank"
                    className="text-white"
                    href="https://web.facebook.com/ahamed.aathil.58"
                  >
                    <FaFacebookF className="fs-4" />
                  </a>
                  <a
                    target="_blank"
                    className="text-white"
                    href="https://www.instagram.com/its_me_aathil/"
                  >
                    <FaInstagram className="fs-4" />
                  </a>
                  <a
                    target="_blank"
                    className="text-white"
                    href="https://wa.me/+94766611917"
                  >
                    <FaWhatsapp className="fs-4" />
                  </a>
                  <a
                    target="_blank"
                    className="text-white"
                    href="https://www.linkedin.com/in/ahamed-aathil-0b52b2136/"
                  >
                    <FaLinkedin className="fs-4" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-3">
              <h4 className="text-white mb-4">Policy</h4>
              <div className="footer-links d-flex flex-column">
                <Link className="text-white py-2 mb-1">Privacy Policy</Link>
                <Link className="text-white py-2 mb-1">Shipping Policy</Link>
                <Link className="text-white py-2 mb-1">Refund Policy</Link>
                <Link className="text-white py-2 mb-1">Terms of Use</Link>
              </div>
            </div>
            <div className="col-3">
              <h4 className="text-white mb-4">Information</h4>
              <div className="footer-links d-flex flex-column">
                <Link className="text-white py-2 mb-1">About Us</Link>
                <Link className="text-white py-2 mb-1">FAQ</Link>
                <Link className="text-white py-2 mb-1">
                  Community Guidelines
                </Link>
              </div>
            </div>
            <div className="col-2">
              <h4 className="text-white mb-4">Quick Links</h4>
              <div className="footer-links d-flex flex-column">
                <Link className="text-white py-2 mb-1">T-Shirts</Link>
                <Link className="text-white py-2 mb-1">Shirts</Link>
                <Link className="text-white py-2 mb-1">Womens</Link>
                <Link className="text-white py-2 mb-1">Trousers</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <footer className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <p className="text-center mb-0 text-white">
                &copy;{new Date().getFullYear()}
                <a
                  className="text-white"
                  href="https://www.linkedin.com/in/ahamed-aathil-0b52b2136/"
                >
                  &nbsp;&nbsp;Powered By Ahamed Aathil
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
