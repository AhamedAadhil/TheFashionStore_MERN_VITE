import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "./OAuth";
import toast from "react-hot-toast";

export default function Register() {
  const title = "Register";
  const btnText = "Sign Up";
  const phoneNumberRegex =
    /^(?:\+?94|0)(?:7(?:[1245678]\d{7}|0\d{7})|[1-6]\d{8})$/;
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      !formData?.username ||
      formData?.username === "" ||
      !formData?.email ||
      formData?.email === "" ||
      !formData?.mobile ||
      formData?.mobile === "" ||
      !formData?.password ||
      formData?.password === "" ||
      !formData?.cpassword ||
      formData?.cpassword === ""
    ) {
      toast.error("All fields are required!");
      return;
    }
    if (!phoneNumberRegex.test(formData?.mobile)) {
      toast.error("Please enter a valid mobile number!");
      return;
    }
    if (formData?.cpassword !== formData?.password) {
      toast.error("Password Mismatching!");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/buyer/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        return toast.error(data.message);
      }
      setLoading(false);
      toast.success("Account Created!");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="login-section padding-tb section-bg">
      <div className="container">
        <div className="account-wrapper">
          <h3 className="title">{title}</h3>
          <form className="account-form" onSubmit={handleRegister}>
            <div className="form-group">
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter Your Name *"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address *"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="mobile"
                id="mobile"
                placeholder="Mobile Number *"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password *"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="cpassword"
                id="cpassword"
                placeholder="Confirm Password *"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="d-block lab-btn"
                disabled={loading}
              >
                <span>{loading ? "Registering..." : btnText}</span>
              </button>
            </div>
          </form>
          {/* account bottom */}
          <div className="account-bottom">
            <span className="d-block cate pt-10">
              Have an Account? <Link to="/login">Sign In</Link>
            </span>
            <span className="or">
              <span>Or</span>
            </span>
            {/* login with google */}
            <span>
              {" "}
              <OAuth />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
