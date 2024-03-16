import { useState } from "react";
import { useParams } from "react-router-dom";
import { RiLockPasswordLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [cpassword, setcPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const resetPassword = async (e) => {
    e.preventDefault();
    if (password === "" || !password) {
      toast.error("Please Enter Your New Password!");
      return;
    }
    if (cpassword === "" || !cpassword) {
      toast.error("Please Re-Enter Your Password!");
      return;
    }
    if (password !== cpassword) {
      toast.error("Passwords Doesn't Match!");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`/api/buyer/auth/resetPassword/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        toast.error(data.message);
        console.log(data.message);
        return;
      }
      setLoading(false);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.log(error.message);
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
                  <RiLockPasswordLine
                    style={{ fontSize: "5rem", color: "#F16126" }}
                  />
                </div>
                <h2 className="h4 text-center" style={{ color: "#F16126" }}>
                  Password Reset
                </h2>
                <h3 className="fs-6 fw-normal text-secondary text-center m-3">
                  Enter Your New Password. The Password Should Be At Least 8
                  Characters Long
                </h3>
                <form onSubmit={resetPassword}>
                  <div className="row gy-3 overflow-hidden">
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          id="password"
                          placeholder="Password"
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control"
                          name="cpassword"
                          id="cpassword"
                          placeholder="Confirm Password"
                          required
                          minLength={8}
                          value={cpassword}
                          onChange={(e) => setcPassword(e.target.value)}
                        />
                        <label htmlFor="cpassword" className="form-label">
                          Confirm Password
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
                          {loading ? "Loading..." : "Reset Password"}
                        </button>
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
