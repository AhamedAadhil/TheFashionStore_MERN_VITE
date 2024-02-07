import Buyer from "../models/buyer.model.js";
import Admin from "../models/admin.model.js";
import Seller from "../models/seller.model.js";
import { errorUtil } from "../utils/error.utils.js";
import { generateToken } from "../config/jwtToken.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import { validateMongoDbId } from "../utils/validateMongoDbId.utils.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

/* REGISTER A NEW BUYER */
export const registerBuyer = async (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return next(errorUtil(400, "Invalid Email"));
  }
  try {
    const isBuyerExist = await Buyer.findOne({ email: req.body.email });
    const isSellerExist = await Seller.findOne({ email: req.body.email });
    const isAdminExist = await Admin.findOne({ email: req.body.email });
    if (isBuyerExist || isSellerExist || isAdminExist) {
      return next(errorUtil(405, "User Already Exists!"));
    }
    const genSalt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(req.body.password, genSalt);
    const newBuyer = new Buyer({ ...req.body, password: hashedPassword });
    await newBuyer.save();
    res.status(201).json("User Registered!");
  } catch (error) {
    next(error);
  }
};

/* LOGIN BUYER */
export const loginBuyer = async (req, res, next) => {
  try {
    const isBuyerExist = await Buyer.findOne({ email: req.body.email });
    if (!isBuyerExist) {
      return next(errorUtil(405, "User Not Found!"));
    }
    const isValidPass = bcryptjs.compareSync(
      req.body.password,
      isBuyerExist.password
    );
    if (!isValidPass) {
      return next(errorUtil(401, "Invalid Credentials!"));
    }
    const refreshToken = generateRefreshToken(
      isBuyerExist?._id,
      isBuyerExist?.role
    );
    const updateBuyer = await Buyer.findByIdAndUpdate(
      isBuyerExist._id,
      {
        refreshtoken: refreshToken,
      },
      { new: true }
    );
    await updateBuyer.save();
    const token = generateToken(isBuyerExist?._id, isBuyerExist?.role);
    const { password: pass, ...rest } = updateBuyer._doc;
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
  } catch (error) {
    next(error);
  }
};

/* HANDLE REFRESH TOKEN */
export const handleRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken) {
    return next(errorUtil(403, "No Refresh Token in Cookies!"));
  }
  const buyer = await Buyer.findOne({ refreshtoken: refreshToken });
  if (!buyer) {
    return next(errorUtil(404, "User not Found!"));
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || buyer._id !== decoded.id) {
      return next(errorUtil(404, "There is Something Wrong with the Token!"));
    }
    const accessToken = generateToken(buyer?._id, buyer?.role);
    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200);
  });
};

/* LOGOUT BUYER */
export const logoutBuyer = async (req, res, next) => {
  try {
    await Buyer.findOneAndUpdate(
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

/* UPDATE A BUYER BY ID */
export const updateBuyer = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  if (req.user.id !== id) {
    return next(errorUtil(401, "You Can Only Update Your Own Profile!"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedBuyer = await Buyer.findByIdAndUpdate(
      id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          mobile: req.body.mobile,
          avatar: req.body.avatar,
          address: req.body.address,
          points: req.body.points,
          theme: req.body.theme,
        },
      },
      { new: true }
    );
    const { password: pass, ...rest } = updatedBuyer._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

/* GET ALL BUYERS */
export const getAllBuyers = async (req, res, next) => {
  try {
    const allBuyers = await Buyer.find();
    res.status(200).json(allBuyers);
  } catch (error) {
    next(error);
  }
};

/* GET A SINGLE BUYER BY ID */
export const getSingleBuyer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const buyer = await Buyer.findById(id);
    if (!buyer) {
      return next(errorUtil(404, "No User found with given id"));
    }
    const { password: pass, ...rest } = buyer._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

/* DELETE A BUYER BY ID*/
export const deleteSingleBuyer = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  if (req.user.id != id) {
    return next(errorUtil(401, "You Can Only Delete Your Own Profile!"));
  }
  try {
    const buyer = await Buyer.findById(id);
    if (!buyer) {
      return next(errorUtil(404, "No User found with given id"));
    }
    const deleteBuyer = await Buyer.findByIdAndDelete(id);
    if (!deleteBuyer) {
      return next(errorUtil(404, "Something Went Wrong, Please Try Again!"));
    }
    res.status(200).json("Account Deleted!");
  } catch (error) {
    next(error);
  }
};
