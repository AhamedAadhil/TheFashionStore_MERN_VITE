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
} from "../controller/buyer.controller.js";

const router = express.Router();

router.post("/auth/register", registerBuyer);
router.post("/auth/login", loginBuyer);
router.post("/auth/logout", verifyToken, logoutBuyer);
router.put("/auth/updatePassword", verifyToken, updatePassword);
router.post("/auth/forgotPasswordToken", verifyToken, forgotPasswordToken);
router.put("/auth/resetPassword/:token", verifyToken, resetPassword);
router.get("/actions/allBuyers", verifyToken, getAllBuyers);
router.get("/actions/getBuyer/:id", verifyToken, getSingleBuyer);
router.delete("/actions/deleteBuyer/:id", verifyToken, deleteSingleBuyer);
router.put("/actions/updateBuyer/:id", verifyToken, updateBuyer);
router.put("/actions/refresh", verifyToken, handleRefreshToken);

export default router;
