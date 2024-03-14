import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SkeletonTheme } from "react-loading-skeleton";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import SingleProduct from "./pages/SingleProduct/SingleProduct";
import CartPage from "./pages/Cart/CartPage";
import About from "./pages/About/About";
import Help from "./pages/Help/Help";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import Profile from "./pages/Profile/Profile";
import Wishlist from "./pages/WishList/Wishlist";
import Orders from "./pages/Orders/Orders";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import "react-loading-skeleton/dist/skeleton.css";
import SellerRegister from "./pages/Auth/SellerRegister";

function App() {
  return (
    <BrowserRouter>
      {/* 313131 525252 */}
      <SkeletonTheme>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<SingleProduct />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/seller-register" element={<SellerRegister />} />
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/me" element={<Profile />} />
            <Route path="/my-wishlist" element={<Wishlist />} />
            <Route path="/my-orders" element={<Orders />} />
          </Route>
        </Routes>
        <Footer />
      </SkeletonTheme>
    </BrowserRouter>
  );
}

export default App;
