import express from "express";
import { isSeller } from "../middlewares/authentication.middleware.js";
import {
  loginSeller,
  registerSeller,
  logoutSeller,
  deleteSingleSeller,
  updateSeller,
  handleRefreshToken,
  forgotPasswordToken,
  resetPassword,
} from "../controller/seller.controller.js";

const router = express.Router();

router.post("/auth/register", registerSeller);
router.post("/auth/login", loginSeller);
router.post("/auth/logout", isSeller, logoutSeller);
router.post("/auth/forgotPasswordToken", forgotPasswordToken);
router.put("/auth/resetPassword/:token", resetPassword);
router.delete("/actions/deleteSeller/:id", isSeller, deleteSingleSeller);
router.put("/actions/updateSeller/:id", isSeller, updateSeller);
router.put("/actions/refresh", isSeller, handleRefreshToken);

export default router;
