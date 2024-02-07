import Admin from "../models/admin.model.js";
import Seller from "../models/seller.model.js";
import Buyer from "../models/buyer.model.js";
import PendingApproval from "../models/pending.approval.model.js";
import bcryptjs from "bcryptjs";
import { errorUtil } from "../utils/error.utils.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import { generateToken } from "../config/jwtToken.js";

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
    if (isSellerExist || isBuyerExist || isAdminExist) {
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

/* SELLER LOGIN */
export const loginSeller = async (req, res, next) => {
  try {
    const isSellerExist = await Seller.findOne({ email: req.body.email });
    if (!isSellerExist) {
      return next(errorUtil(405, "User Not Found!"));
    }
    const isValidPass = bcryptjs.compareSync(
      req.body.password,
      isSellerExist.password
    );
    if (!isValidPass) {
      return next(errorUtil(401, "Invalid Credentials!"));
    }
    const accountStatus = isSellerExist.status;
    if (accountStatus === "active") {
      const refreshToken = generateRefreshToken(
        isSellerExist?._id,
        isSellerExist?.role
      );
      const updateSeller = await Seller.findByIdAndUpdate(
        isSellerExist._id,
        {
          refreshtoken: refreshToken,
        },
        { new: true }
      );
      await updateSeller.save();
      const token = generateToken(isSellerExist?._id, isSellerExist?.role);
      const { password: pass, ...rest } = updateSeller._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        })
        .status(200)
        .json(rest);
    } else {
      return next(errorUtil(401, "You  Are Not Authorized To Login!"));
    }
  } catch (error) {
    next(error);
  }
};

/* SELLER LOGOUT */
export const logoutSeller = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "seller") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  try {
    await Seller.findOneAndUpdate(
      {
        refreshtoken: req.cookies?.refresh_token,
      },
      { refreshtoken: "" },
      { new: true }
    );
    res.clearCookie("access-token", { expires: new Date(0) });
    res.clearCookie("refresh-token", { expires: new Date(0) });
    res.status(200).json("User Signout Successfully!");
  } catch (error) {
    next(error);
  }
};
