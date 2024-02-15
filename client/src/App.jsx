import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
// import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Forgetpassword_email from "./pages/ForgetPassword/Forgetpassword_email";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ForgetPassword_email" element={<Forgetpassword_email />} />

      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
