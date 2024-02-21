/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
} from "../redux/user/userSlice";

export default function MobileNumberModel({ currentUser }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneNumberRegex =
    /^(?:\+?94|0)(?:7(?:[1245678]\d{7}|0\d{7})|[1-6]\d{8})$/;
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (currentUser.mobile === "" || !currentUser.mobile) {
      handleShow(); // Open the modal if mobile number is empty
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { value } = e.target;
    // Update the phoneNumber state with the entered value
    setPhoneNumber(value);
  };

  const handleUpdateMobileNumber = async () => {
    try {
      if (phoneNumber === "" || !phoneNumber) {
        return toast.error("Please Enter a Mobile Number!");
      }
      if (!phoneNumberRegex.test(phoneNumber)) {
        toast.error("Please Enter a Valid Mobile Number!");
        return;
      }
      setLoading(true);
      dispatch(updateUserStart());
      const response = await fetch(
        `/api/buyer/actions/updateBuyer/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: phoneNumber,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        dispatch(updateUserFailure(data.message));
        toast.error(data.message);
        return;
      }
      setLoading(false);
      dispatch(updateUserSuccess(data));
      toast.success("Mobile Number Updated!");
      handleClose();
    } catch (error) {
      setLoading(false);
      dispatch(updateUserFailure(error.message));
      toast.error(error.message);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="number"
                placeholder="0712345678"
                autoFocus
                onChange={handleChange}
                value={phoneNumber}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateMobileNumber}
            disabled={loading}
          >
            Update Mobile Number
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
