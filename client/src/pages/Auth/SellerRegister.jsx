import { useState } from "react";
import { Alert } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

export default function SellerRegister() {
  const title = "Seller Registration";
  const btnText = "Register";
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "email") {
      setFormData({ ...formData, [id]: value.trim().toLowerCase() });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const togglePasswordVisibility = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const phoneNumberRegex =
    /^(?:\+?94|0)(?:7(?:[1245678]\d{7}|0\d{7})|[1-6]\d{8})$/;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      !formData?.sellername ||
      formData?.sellername === "" ||
      !formData?.shopname ||
      formData?.shopname === "" ||
      !formData?.email ||
      formData?.email === "" ||
      !formData?.password ||
      formData?.password === "" ||
      !formData?.cpassword ||
      formData?.cpassword === "" ||
      !formData?.mobile ||
      formData?.mobile === "" ||
      !formData?.address ||
      !formData?.address.label ||
      !formData?.address.housenumber ||
      !formData?.address.street ||
      !formData?.address.city ||
      !formData?.address.state ||
      !formData?.address.postalcode
    ) {
      toast.error("All fields are required!");
      return;
    }
    if (!phoneNumberRegex.test(formData.mobile)) {
      toast.error("Invalid Mobile Number!");
      return;
    }
    if (formData?.cpassword !== formData?.password) {
      toast.error("Password Mismatching!");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/seller/auth/register", {
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
      toast.success("Success!");
      setShowSuccess(true);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="login-section padding-tb section-bg">
      <div className="container py-4">
        <div className="account-wrapper">
          <h3 className="title" style={{ color: "#F16126" }}>
            <AiOutlineUsergroupAdd />
            {title}
          </h3>
          <form className="account-form" onSubmit={handleRegister}>
            <div className="form-group">
              <input
                type="text"
                name="sellername"
                id="sellername"
                placeholder="Seller Name *"
                onChange={handleChange}
                required
                maxLength={20}
                minLength={3}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="shopname"
                id="shopname"
                placeholder="Shop Name *"
                onChange={handleChange}
                required
                maxLength={20}
                minLength={3}
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
            <div className="form-group password-input">
              <input
                type={formData.showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password *"
                onChange={handleChange}
                minLength={8}
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
            <div className="form-group password-input">
              <input
                type={formData.showPassword ? "text" : "password"}
                name="cpassword"
                id="cpassword"
                placeholder="Confirm Password *"
                onChange={handleChange}
                minLength={8}
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
              <input
                type="number"
                name="mobile"
                id="mobile"
                placeholder="Mobile Number *"
                onChange={handleChange}
                required
              />
            </div>
            {/* Address Fields */}
            <div className="form-group">
              <input
                type="text"
                name="label"
                id="address-label"
                placeholder="Address Label Ex:Home,Office *"
                onChange={(e) =>
                  handleChange({
                    target: {
                      id: "address",
                      value: { ...formData.address, label: e.target.value },
                    },
                  })
                }
                maxLength={15}
                minLength={3}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="housenumber"
                id="address-housenumber"
                placeholder="House Number *"
                onChange={(e) =>
                  handleChange({
                    target: {
                      id: "address",
                      value: {
                        ...formData.address,
                        housenumber: e.target.value,
                      },
                    },
                  })
                }
                maxLength={7}
                minLength={1}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="street"
                id="address-street"
                placeholder="Street *"
                onChange={(e) =>
                  handleChange({
                    target: {
                      id: "address",
                      value: { ...formData.address, street: e.target.value },
                    },
                  })
                }
                maxLength={15}
                minLength={3}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="city"
                id="address-city"
                placeholder="City *"
                onChange={(e) =>
                  handleChange({
                    target: {
                      id: "address",
                      value: { ...formData.address, city: e.target.value },
                    },
                  })
                }
                maxLength={15}
                minLength={3}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="state"
                id="address-state"
                placeholder="District *"
                onChange={(e) =>
                  handleChange({
                    target: {
                      id: "address",
                      value: { ...formData.address, state: e.target.value },
                    },
                  })
                }
                maxLength={15}
                minLength={3}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="postalcode"
                id="address-postalcode"
                placeholder="Postal Code *"
                onChange={(e) =>
                  handleChange({
                    target: {
                      id: "address",
                      value: {
                        ...formData.address,
                        postalcode: e.target.value,
                      },
                    },
                  })
                }
                required
              />
            </div>
            {/* Address Fields End */}
            <div className="form-group">
              <button
                type="submit"
                className="d-block lab-btn"
                disabled={loading}
              >
                <span>{loading ? "Registering..." : btnText}</span>
              </button>
            </div>
            <div>
              <Alert
                show={showSuccess}
                variant="success"
                onClose={() => setShowSuccess(false)}
                dismissible
              >
                Thank you for registering with us. Your registration details
                have been received. Our team will carefully inspect your
                application. If all details are in order, we will proceed with
                the approval process. You will receive an email notification at
                your provided email address upon successful approval. Further
                instructions and information will also be included in the email.
              </Alert>
            </div>
          </form>
          {/* account bottom */}
          <div className="account-bottom"></div>
        </div>
      </div>
    </div>
  );
}
