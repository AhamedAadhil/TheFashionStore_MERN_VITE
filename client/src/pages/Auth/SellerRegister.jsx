/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { Alert, Modal, Button, Form } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

export default function SellerRegister() {
  const title = "Seller Registration";
  const btnText = "Register";
  const currentDate = new Date().toLocaleDateString();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(true);
  const [agreedToAgreement, setAgreedToAgreement] = useState(false);

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

  const handleAgreementCheck = (e) => {
    setAgreedToAgreement(e.target.checked);
  };

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
              {/* <Button onClick={() => setShowAgreementModal(true)}>
                Show Agreement
              </Button> */}
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
                disabled={loading || !agreedToAgreement}
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
          <Modal
            show={showAgreementModal}
            onHide={() => setShowAgreementModal(false)}
            backdrop="static" // Prevent closing when clicking outside
            keyboard={false} // Prevent closing when pressing Escape key
          >
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "#F16126" }}>
                Seller Agreement
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                This agreement ("Agreement") is entered into between the sellers
                ("Sellers") and Galleryglam ("Galleryglam") effective as of [
                {currentDate}].
                <br /> <br />{" "}
                <b style={{ color: "#F16126", textDecoration: "underline" }}>
                  1. Registration and Account
                </b>{" "}
                <br /> 1.1 Sellers shall register on the Galleryglam platform
                using a unique email address dedicated solely for seller
                purposes. Any attempt to register using a buyer account email
                will be rejected. <br />
                1.2 Sellers agree not to use their real shop names when
                registering on the Galleryglam platform.
                <br />
                <br />{" "}
                <b style={{ color: "#F16126", textDecoration: "underline" }}>
                  2. Sales and Delivery
                </b>
                <br /> 2.1 Sellers agree to offer Cash On Delivery as a payment
                method for the products listed on the Galleryglam platform.
                <br /> 2.2 Sellers shall make every reasonable effort to deliver
                the product to the buyer directly, using their own means of
                delivery.
                <br /> 2.3 In cases where Sellers are unable to deliver the
                product, they shall promptly notify Galleryglam and hand over
                the product parcel to Galleryglam&apos;s designated team for
                delivery to the buyer.
                <br /> 2.4 Sellers shall refrain from disclosing personal
                information to buyers during the delivery process. All
                communication shall be facilitated through Galleryglam.
                <br /> 2.5 Sellers agree that all products shall be delivered
                solely under the Galleryglam brand. The name provided by the
                Sellers during registration shall be used as the seller&apos;s
                name on the platform.
                <br />
                <br />{" "}
                <b style={{ color: "#F16126", textDecoration: "underline" }}>
                  3. Returns
                </b>
                <br /> 3.1 Sellers agree to accept returns within 3 days of
                delivery if the reason for return is deemed reasonable by
                Galleryglam.
                <br /> 3.2 Sellers shall adhere to Galleryglam&apos;s return
                policy and procedure for processing returns.
                <br />
                <br />{" "}
                <b style={{ color: "#F16126", textDecoration: "underline" }}>
                  4. Product Listing and Information
                </b>
                <br /> 4.1 Sellers shall accurately list products on the
                Galleryglam platform, providing correct and up-to-date
                information including product descriptions, pricing, and
                availability.
                <br /> 4.2 Sellers shall ensure that all products listed comply
                with local laws and regulations, including but not limited to
                product safety standards and labeling requirements. <br />
                <br />
                <b style={{ color: "#F16126", textDecoration: "underline" }}>
                  5. Intellectual Property
                </b>
                <br /> 5.1 Sellers warrant that they have the necessary rights,
                licenses, and permissions to list and sell the products on the
                Galleryglam platform.
                <br /> 5.2 Sellers shall not infringe upon any intellectual
                property rights, including trademarks, copyrights, or patents,
                belonging to third parties.
                <br />
                <br />{" "}
                <b style={{ color: "#F16126", textDecoration: "underline" }}>
                  6. Confidentiality
                </b>
                <br /> 6.1 Sellers shall maintain the confidentiality of any
                proprietary or confidential information disclosed by
                Galleryglam, including but not limited to business strategies,
                customer data, and trade secrets.
                <br /> 6.2 Sellers shall not disclose any confidential
                information to third parties without prior written consent from
                Galleryglam.
                <br />
                <br />{" "}
                <b style={{ color: "#F16126", textDecoration: "underline" }}>
                  7. Termination
                </b>
                <br /> 7.1 Either party may terminate this Agreement upon
                written notice to the other party, provided that all outstanding
                obligations are settled.
                <br /> 7.2 Upon termination, Sellers shall cease all activities
                related to the Galleryglam platform and return any materials or
                assets belonging to Galleryglam.
                <br />
                <br />{" "}
                <b style={{ color: "#F16126", textDecoration: "underline" }}>
                  8. Governing Law
                </b>{" "}
                <br />
                8.1 This Agreement shall be governed by and construed in
                accordance with the laws of Sri Lanka.
                <br /> 8.2 Any disputes arising out of or relating to this
                Agreement shall be resolved through amicable negotiations
                between the parties. If the dispute cannot be resolved amicably,
                it shall be submitted to the exclusive jurisdiction of the
                courts of Sri Lanka.
                <br />
                <br />{" "}
                <b style={{ color: "#F16126", textDecoration: "underline" }}>
                  9. Entire Agreement
                </b>
                <br /> 9.1 This Agreement constitutes the entire understanding
                between the parties with respect to the subject matter hereof
                and supersedes all prior agreements and understandings, whether
                written or oral, relating to such subject matter. IN WITNESS
                WHEREOF, the parties hereto have executed this Agreement as of
                the date first above written. <br /> <br />
                <span className="d-flex flex-column">
                  <b style={{ color: "#F16126" }}>
                    Sellers [{currentDate}] <br />
                    Galleryglam [{currentDate}]
                  </b>
                </span>
              </p>
              <Form.Group
                controlId="agreementCheckbox"
                style={{ fontWeight: "bold", color: "green" }}
              >
                <Form.Check
                  type="checkbox"
                  label="I agree to the agreement"
                  onChange={handleAgreementCheck}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => setShowAgreementModal(false)}
                disabled={!agreedToAgreement}
              >
                I Agree & Continue
              </Button>
            </Modal.Footer>
          </Modal>
          {/* account bottom */}
          <div className="account-bottom"></div>
        </div>
      </div>
    </div>
  );
}
