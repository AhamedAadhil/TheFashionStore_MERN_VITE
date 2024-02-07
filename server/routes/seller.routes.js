import express from "express";
import { isSeller } from "../middlewares/authentication.middleware.js";
import {
  loginSeller,
  registerSeller,
  logoutSeller,
} from "../controller/seller.controller.js";

const router = express.Router();

router.post("/auth/register", registerSeller);
router.post("/auth/login", loginSeller);
router.post("/auth/logout", isSeller, logoutSeller);

export default router;
