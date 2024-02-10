import Coupon from "../models/coupon.model.js";
import Seller from "../models/seller.model.js";
import { errorUtil } from "../utils/error.utils.js";
import { validateMongoDbId } from "../utils/validateMongoDbId.utils.js";

/* CREATE A COUPON */
export const createCoupon = async (req, res, next) => {
  try {
    const newCoupon = new Coupon({
      name: req.body.name,
      expiry: req.body.expiry,
      discount: req.body.discount,
      seller: req.user.id,
    });
    await newCoupon.save();
    res.status(201).json("Coupon Created!");
  } catch (error) {
    next(error);
  }
};

/* GET ALL COUPON OF A SELLER */
export const getAllCoupon = async (req, res, next) => {
  const sellerId = req.user.id;
  validateMongoDbId(sellerId);
  try {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return next(errorUtil(404, "Seller Not Found!"));
    }
    const coupons = await Coupon.find({ seller: sellerId });
    if (!coupons) {
      return next(errorUtil(404, "No Any Associated Coupons Found!"));
    }
    res.status(200).json(coupons);
  } catch (error) {
    next(error);
  }
};

/* DELETE A COUPON */
export const deleteCoupon = async (req, res, next) => {
  const sellerId = req.user.id;
  const couponId = req.params.id;
  validateMongoDbId(sellerId);
  validateMongoDbId(couponId);
  try {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return next(errorUtil(404, "Coupon Not Found!"));
    }
    if (sellerId.toString() !== coupon.seller.toString()) {
      return next(errorUtil(403, "You Can Only Delete Your Own Coupon!"));
    }
    const deleteCoupon = await Coupon.findByIdAndDelete(couponId);
    if (!deleteCoupon) {
      return next(
        errorUtil(500, "Unable To Delete This Coupon, Please Try Again!")
      );
    }
    res.status(201).json("Coupon Deleted!");
  } catch (error) {
    next(error);
  }
};
