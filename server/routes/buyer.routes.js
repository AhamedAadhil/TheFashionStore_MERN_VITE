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
} from "../controller/buyer.controller.js";

const router = express.Router();

router.post("/auth/register", registerBuyer);
router.post("/auth/login", loginBuyer);
router.post("/auth/logout", verifyToken, logoutBuyer);
router.put("/auth/updatePassword", verifyToken, updatePassword);
router.post("/auth/forgotPasswordToken", forgotPasswordToken);
router.put("/auth/resetPassword/:token", resetPassword);
router.put("/actions/askAddress", verifyToken, askAddress);
router.put("/actions/deleteAddress/:id", verifyToken, deleteAddress);
router.get("/actions/getAllAddress", verifyToken, getAllAddress);
router.put("/actions/updateAddress/:id", verifyToken, updateAddress);
router.get("/actions/allBuyers", verifyToken, getAllBuyers);
router.get("/actions/getBuyer/:id", verifyToken, getSingleBuyer);
router.delete("/actions/deleteBuyer/:id", verifyToken, deleteSingleBuyer);
router.put("/actions/updateBuyer/:id", verifyToken, updateBuyer);
router.put("/actions/refresh", verifyToken, handleRefreshToken);
router.get("/actions/getWishList", verifyToken, getWishList);

export default router;
