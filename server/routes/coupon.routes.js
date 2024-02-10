import express from "express";
import {
  createCoupon,
  getAllCoupon,
  deleteCoupon,
} from "../controller/coupon.controller.js";
import { isSeller } from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.post("/create", isSeller, createCoupon);
router.get("/getAllCouponOfSingleSeller", isSeller, getAllCoupon);
router.delete("/delete/:id", isSeller, deleteCoupon);

export default router;
