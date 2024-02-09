import Coupon from "../models/coupon.model.js";
import { errorUtil } from "../utils/error.utils.js";

export const createCoupon = async (req, res, next) => {
  try {
    const newCoupon = new Coupon({
      name: req.body.name,
      expiry: req.body.expiry,
      discount: req.body.discount,
    });
    await newCoupon.save();
    res.status(201).json("Coupon Created!");
  } catch (error) {
    next(error);
  }
};
