import { useState } from "react";
import { SiMinutemailer } from "react-icons/si";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState("");

  const forgotPass = async (e) => {
    if (email === "" || !email) {
      toast.error("Please Enter The Email of Your Account to Reset!");
      return;
    }
    try {
      e.preventDefault();
      setLoading(true);
      const response = await fetch("/api/buyer/auth/forgotPasswordToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      setLoading(false);
      //   toast.success(data);
      setRes(data);
      //   navigate("/reset-password/:token");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <section className="bg-light pt-4 px-4">
      <div className="container padding-tb">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-6">
            {" "}
            {/* Adjusted column width */}
            <div className="card border-light-subtle shadow">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="text-center mb-4">
                  {/* <a href="#!">
                    <img
                      src={logoImage}
                      alt="BootstrapBrain Logo"
                      width="175"
                      height="57"
                    />
                  </a> */}
                  <SiMinutemailer
                    style={{ fontSize: "5rem", color: "#F16126" }}
                  />
                </div>
                <h2 className="h4 text-center" style={{ color: "#F16126" }}>
                  Password Reset
                </h2>
                <h3 className="fs-6 fw-normal text-secondary text-center m-3">
                  Provide the email address associated with your account to
                  recover your password.
                </h3>
                <form onSubmit={forgotPass}>
                  <div className="row gy-3 overflow-hidden">
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          id="email"
                          placeholder="name@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-grid">
                        <button
                          className="lab-btn text-white rounded"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Send Reset Link"}
                        </button>
                        {res && (
                          <p
                            className="text-center mt-2"
                            style={{
                              color: "green",
                              fontSize: "0.9rem",
                            }}
                          >
                            {res}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
