import { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useSelector, useDispatch } from "react-redux";
import {
  FaPencilAlt,
  FaUser,
  FaEnvelope,
  FaMobileAlt,
  FaLock,
} from "react-icons/fa";
import toast from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../../firebase";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [filePer, setFilePer] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const phoneNumberRegex =
    /^(?:\+?94|0)(?:7(?:[1245678]\d{7}|0\d{7})|[1-6]\d{8})$/;

  useEffect(() => {
    if (currentUser) {
      setUserInfo({
        username: currentUser.username || "",
        email: currentUser.email || "",
        mobile: currentUser.mobile || "",
        address: currentUser.address || [],
        avatar:
          currentUser.avatar ||
          "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
      });
    }
    if (file) {
      setFileError(false);
      setFilePer(0);
      handleFileUpload(file);
    }
  }, [currentUser, file]);

  //   console.log("address==", currentUser.address);

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (file) => {
    setFileError(false);
    setFilePer(0);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      toast.error("Please Change Some Data to Update!");
      return;
    }
    if (formData?.mobile && !phoneNumberRegex.test(formData.mobile)) {
      toast.error("Please Enter a Valid Mobile Number!");
      return;
    }
    if (formData?.password && !formData?.cpassword) {
      toast.error("Please Confirm The Password!");
      return;
    }
    if (formData?.password && formData?.password !== formData.cpassword) {
      toast.error("Passwords Do Not Match!");
      return;
    }
    try {
      setLoading(true);
      dispatch(updateUserStart());
      const response = await fetch(
        `/api/buyer/actions/updateBuyer/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.success === false) {
        setLoading(false);
        dispatch(updateUserFailure(data.message));
        toast.error(data.message);
        return;
      }
      setLoading(false);
      dispatch(updateUserSuccess(data));
      toast.success("User Updated!");
      if (formData?.password) {
        navigate("/login");
        return;
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className="padding-tb">
      <div className="container py-6 shadow px-4" style={{ padding: "1rem" }}>
        <div className="text-end" style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "#F16126",
              color: "#FFF",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              fontSize: "0.8rem",
            }}
          >
            Current Points: {currentUser.points}
          </div>
        </div>
        <Form className="p-4" onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col
              md={3}
              className="d-flex flex-column justify-content-center align-items-center text-center"
            >
              <br />
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  cursor: "pointer",
                }}
                onClick={handleImageUpload}
              >
                <img
                  src={formData.avatar || userInfo.avatar}
                  alt="Profile"
                  width="150px"
                  height="150px"
                  className="img-fluid rounded-circle"
                />
                <FaPencilAlt
                  style={{
                    position: "absolute",
                    bottom: 15,
                    right: 25,
                    cursor: "pointer",
                    backgroundColor: "#FFF",
                    padding: 5,
                    borderRadius: "50%",
                    fontSize: "1.6rem",
                    color: "black",
                  }}
                />
                <div
                  className="text-sm self-center"
                  style={{ fontSize: "0.8rem" }}
                >
                  {fileError ? (
                    <div className="alert alert-danger" role="alert">
                      Error Image Upload (Image must be less than 5MB)
                    </div>
                  ) : filePer > 0 && filePer < 100 ? (
                    <div className="alert alert-secondary">{`Uploading ${filePer}%`}</div>
                  ) : filePer === 100 ? (
                    <div className="alert alert-success">
                      Profile Picture Uploaded!
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
              <br />
            </Col>
            <Col md={9}>
              <Form.Group>
                <Form.Label style={{ color: "#F16126" }}>Email</Form.Label>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FaEnvelope />
                  </span>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    defaultValue={userInfo.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label style={{ color: "#F16126" }}>Username</Form.Label>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FaUser />
                  </span>
                  <Form.Control
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    defaultValue={userInfo.username}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label style={{ color: "#F16126" }}>Mobile</Form.Label>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FaMobileAlt />
                  </span>
                  <Form.Control
                    id="mobile"
                    type="tel"
                    defaultValue={userInfo.mobile}
                    placeholder="Enter mobile number"
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: "#F16126" }}>
                      Password
                    </Form.Label>
                    <div className="input-group mb-3">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <Form.Control
                        id="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: "#F16126" }}>
                      Confirm Password
                    </Form.Label>
                    <div className="input-group mb-3">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <Form.Control
                        id="cpassword"
                        type="password"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <p className="text-muted">
                  {formData?.password
                    ? `Note: Changing your password will log you out. You&apos;ll
                  need to log in again with your new password.`
                    : ""}
                </p>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col className="text-end">
              {Object.keys(formData).length > 0 && (
                <Button
                  className="lab-btn border-0"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
