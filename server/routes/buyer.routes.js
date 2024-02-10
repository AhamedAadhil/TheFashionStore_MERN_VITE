import express from "express";
import { verifyToken } from "../middlewares/authentication.middleware.js";
import {
  deleteSingleBuyer,
  getAllBuyers,
  getSingleBuyer,
  handleRefreshToken,
  loginBuyer,
  registerBuyer,
  updateBuyer,
  logoutBuyer,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  getWishList,
  askAddress,
  getAllAddress,
  deleteAddress,
  updateAddress,
  addToCart,
  getUserCart,
  emptyCart,
  applyCoupon,
} from "../controller/buyer.controller.js";

const router = express.Router();
/* AUTH */
router.post("/auth/register", registerBuyer);
router.post("/auth/login", loginBuyer);
router.post("/auth/logout", verifyToken, logoutBuyer);
router.put("/auth/updatePassword", verifyToken, updatePassword);
router.post("/auth/forgotPasswordToken", forgotPasswordToken);
router.put("/auth/resetPassword/:token", resetPassword);
/* ADDRESS */
router.put("/actions/askAddress", verifyToken, askAddress);
router.put("/actions/deleteAddress/:id", verifyToken, deleteAddress);
router.get("/actions/getAllAddress", verifyToken, getAllAddress);
router.put("/actions/updateAddress/:id", verifyToken, updateAddress);
/* GENERAL */
router.get("/actions/allBuyers", verifyToken, getAllBuyers);
router.get("/actions/getBuyer/:id", verifyToken, getSingleBuyer);
router.delete("/actions/deleteBuyer/:id", verifyToken, deleteSingleBuyer);
router.put("/actions/updateBuyer/:id", verifyToken, updateBuyer);
router.put("/actions/refresh", verifyToken, handleRefreshToken);
/* PRODUCT */
router.get("/actions/getWishList", verifyToken, getWishList);
router.post("/actions/addToCart", verifyToken, addToCart);
router.get("/actions/getUserCart", verifyToken, getUserCart);
router.delete("/actions/emptyCart", verifyToken, emptyCart);
router.put("/actions/applyCoupon", verifyToken, applyCoupon);

export default router;
