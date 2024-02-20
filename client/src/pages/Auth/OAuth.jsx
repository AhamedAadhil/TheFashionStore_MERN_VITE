import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from "../../firebase";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      dispatch(signInStart());
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const response = await fetch("/api/buyer/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
          mobile: result.user.phoneNumber || "",
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        toast.error(data.message);
        return;
      }
      toast.success(`Welcome ${data.username}`);
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.log("could not sign in with google", error.message);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="btn text-white rounded-lg text-uppercase align-items-center lab-btn "
      style={{ background: "red", fontSize: "1rem" }}
    >
      <FaGoogle className="me-2" />
      Continue with Google
    </button>
  );
}
