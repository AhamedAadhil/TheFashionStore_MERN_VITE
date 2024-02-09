import express from "express";
import { createCoupon } from "../controller/coupon.controller.js";
import { isAdmin } from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.post("/create", isAdmin, createCoupon);

export default router;
