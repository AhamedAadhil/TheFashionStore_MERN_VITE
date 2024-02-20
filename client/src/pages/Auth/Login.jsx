import { Link } from "react-router-dom";

export default function Login() {
  const title = "Login";
  const socialTitle = "Login With Google";
  const btnText = "Login";

  const handleLogin = (e) => {};

  return (
    <div>
      <div className="login-section padding-tb section-bg">
        <div className="container">
          <div className="account-wrapper">
            <h3 className="title">{title}</h3>
            <form className="account-form" onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email Address *"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password *"
                  required
                />
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-between flex-wrap pt-sm-2">
                  <div className="checkgroup">
                    <input type="checkbox" name="remember" id="remember" />
                    <label htmlFor="remember">Remember Me</label>
                  </div>
                  <Link to="/forgot-password">Forgot Passwrod?</Link>
                </div>
              </div>
              <div className="form-group">
                <button type="submit" className="d-block lab-btn">
                  <span>{btnText}</span>
                </button>
              </div>
            </form>
            {/* account bottom */}
            <div className="account-bottom">
              <span className="d-block cate pt-10">
                Don&apos;t Have an Account? <Link to="/register">Sign Up</Link>
              </span>
              <span className="or">
                <span>Or</span>
              </span>
              {/* login with google */}
              <span>Login With Google</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
