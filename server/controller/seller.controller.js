import Admin from "../models/admin.model.js";
import Buyer from "../models/buyer.model.js";
import PendingApproval from "../models/pending.approval.model.js";
import Seller from "../models/seller.model.js";
import bcryptjs from "bcryptjs";
import { errorUtil } from "../utils/error.utils.js";

/* SELLER REGISTER  */
export const registerSeller = async (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return next(errorUtil(400, "Invalid Email"));
  }
  try {
    const isSellerExist = await Seller.findOne({ email: req.body.emai });
    const isBuyerExist = await Buyer.findOne({ email: req.body.email });
    const isAdminExist = await Admin.findOne({ email: req.body.email });
    if (isBuyerExist || isSellerExist || isAdminExist) {
      return next(errorUtil(405, "User Already Exists!"));
    }
    const genSalt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(req.body.password, genSalt);
    const newSeller = new Seller({ ...req.body, password: hashedPassword });
    await newSeller.save();
    const pendingApproval = new PendingApproval({ seller: newSeller._id });
    await pendingApproval.save();
    res.status(201).json("Your Document is Under Review!");
  } catch (error) {
    next(error);
  }
};
export const loginSeller = async (req, res, next) => {};
export const logoutSeller = async (req, res, next) => {};
