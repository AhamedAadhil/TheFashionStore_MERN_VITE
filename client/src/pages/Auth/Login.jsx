import { Link, useNavigate } from "react-router-dom";
import { RiLoginCircleFill } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import OAuth from "./OAuth";

export default function Login() {
  const title = "Login";
  const btnText = "Login";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const { loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      dispatch(signInStart());
      const response = await fetch("/api/buyer/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        toast.error(data.message);
        return;
      }
      toast.success(`Welcome ${data.username}!`);
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message);
      return;
    }
  };

  return (
    <div>
      <div className="login-section padding-tb section-bg">
        <div className="container py-4">
          <div className="account-wrapper">
            <h3 className="title" style={{ color: "#F16126" }}>
              <RiLoginCircleFill />
              {title}
            </h3>
            <form className="account-form" onSubmit={handleLogin}>
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
              <div className="form-group password-input">
                <input
                  type={formData.showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Password *"
                  onChange={handleChange}
                  required
                />
                <span onClick={togglePasswordVisibility}>
                  {formData.showPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </span>
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between flex-wrap pt-sm-2">
                  <div className="checkgroup">
                    <input type="checkbox" name="remember" id="remember" />
                    <label htmlFor="remember">Remember Me</label>
                  </div>
                  <Link to="/forgot-password" style={{ color: "#F16126" }}>
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="d-block lab-btn"
                  disabled={loading}
                >
                  <span>{loading ? "Processing..." : btnText}</span>
                </button>
              </div>
            </form>
            {/* account bottom */}
            <div className="account-bottom">
              <span className="d-block cate pt-10">
                Don&apos;t Have an Account?{" "}
                <Link to="/register" style={{ color: "#F16126" }}>
                  Sign Up
                </Link>
              </span>
              <span className="or">
                <span>Or</span>
              </span>
              {/* login with google */}
              <span>
                <OAuth />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
