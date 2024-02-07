import Admin from "../models/admin.model.js";
import Seller from "../models/seller.model.js";
import Buyer from "../models/buyer.model.js";
import bcryptjs from "bcryptjs";
import { generateRefreshToken } from "../config/refreshToken.js";
import { generateToken } from "../config/jwtToken.js";
import { errorUtil } from "../utils/error.utils.js";
import PendingApproval from "../models/pending.approval.model.js";

/* ADMIN LOGIN */
export const adminLogin = async (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return next(errorUtil(400, "Invalid Email"));
  }
  try {
    const isAdminExist = await Admin.findOne({ email: req.body.email });
    if (!isAdminExist) {
      return next(errorUtil(405, "Admin Not Found!"));
    }
    const isValidPass = bcryptjs.compareSync(
      req.body.password,
      isAdminExist.password
    );
    if (!isValidPass) {
      return next(errorUtil(401, "Invalid Credentials!"));
    }
    const refreshToken = generateRefreshToken(
      isAdminExist?._id,
      isAdminExist?.role
    );
    const updateAdmin = await Admin.findByIdAndUpdate(
      isAdminExist._id,
      {
        refreshtoken: refreshToken,
      },
      { new: true }
    );
    await updateAdmin.save();
    const token = generateToken(isAdminExist?._id, isAdminExist?.role);
    const { password: pass, ...rest } = updateAdmin._doc;
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

/* ADMIN LOGOUT */
export const adminLogout = async (req, res, next) => {
  try {
    await Admin.findOneAndUpdate(
      {
        refreshtoken: req.cookies?.refresh_token,
      },
      { refreshtoken: "" },
      { new: true }
    );
    res.clearCookie("access-token", { expires: new Date(0) });
    res.clearCookie("refresh-token", { expires: new Date(0) });
    res.status(200).json("Admin Signout Successfully!");
  } catch (error) {
    next(error);
  }
};

/* GET ALL BUYERS */
export const getAllBuyers = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(
      errorUtil(403, "Forbidden, You Are Not Allowed To Perform This!")
    );
  }
  try {
    const allBuyers = await Buyer.find();
    res.status(200).json(allBuyers);
  } catch (error) {
    next(error);
  }
};

/* DELETE  A BUYER BY ID*/
export const deleteSingleBuyer = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(
      errorUtil(403, "Forbidden, You Are Not Allowed To Perform This!")
    );
  }
  try {
    const { id } = req.params;
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

/* GET A SINGLE BUYER BY ID */
export const getSingleBuyer = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(
      errorUtil(403, "Forbidden, You Are Not Allowed To Perform This!")
    );
  }
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

/* BLOCK A BUYER */
export const blockBuyer = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(
      errorUtil(403, "Forbidden, You Are Not Allowed To Perform This!")
    );
  }
  try {
    const { id } = req.params;
    const blockBuyer = await Buyer.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "blocked",
        },
      },
      { new: true }
    );
    res.status(200).json("Buyer Blocked!");
  } catch (error) {
    next(error);
  }
};

/* UN-BLOCK A BUYER */
export const unBlockBuyer = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(
      errorUtil(403, "Forbidden, You Are Not Allowed To Perform This!")
    );
  }
  try {
    const { id } = req.params;
    const unBlockBuyer = await Buyer.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "active",
        },
      },
      { new: true }
    );

    res.status(200).json("Buyer Unblocked!");
  } catch (error) {
    next(error);
  }
};

/* BLOCK A SELLER */
export const blockSeller = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(
      errorUtil(403, "Forbidden, You Are Not Allowed To Perform This!")
    );
  }
  try {
    const { id } = req.params;
    const blockSeller = await Seller.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "blocked",
        },
      },
      { new: true }
    );
    res.status(200).json("Seller Blocked!");
  } catch (error) {
    next(error);
  }
};

/* UN-BLOCK A SELLER */
export const unBlockSeller = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(
      errorUtil(403, "Forbidden, You Are Not Allowed To Perform This!")
    );
  }
  try {
    const { id } = req.params;
    const unBlockSeller = await Seller.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "active",
        },
      },
      { new: true }
    );

    res.status(200).json("Seller Unblocked!");
  } catch (error) {
    next(error);
  }
};

/* GET ALL PENDING SELLER APPROVALS  */
export const gellAllPendingSellerApprovals = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(
      errorUtil(403, "Forbidden, You Are Not Allowed To Perform This!")
    );
  }
  try {
    const pendingApprovals = await PendingApproval.find();
    res.status(200).json(pendingApprovals);
  } catch (error) {
    next(error);
  }
};

/* GET A PENDING SELLER APPROVAL BY ID */
export const getSinglePendingSellerApproval = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(
      errorUtil(403, "Forbidden, You Are Not Allowed To Perform This!")
    );
  }
  try {
    const requestId = req.params.id;
    let request = await PendingApproval.findById(requestId);
    if (!request) {
      return next(errorUtil(404, "No Request Found With The Given ID"));
    }
    const requestedSeller = await Seller.findById(request.seller);
    const { password: pass, ...rest } = requestedSeller._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

/* ACCEPT SELLER REQUEST */
export const acceptSellerRequest = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(
      errorUtil(403, "Forbidden, You Are Not Allowed To Perform This!")
    );
  }
  try {
    const requestId = req.params.id;
    const request = await PendingApproval.findById(requestId);
    if (!request) {
      return next(errorUtil(404, "The Request Is No Longer Available"));
    }
    const sellerId = request.seller;
    const approveRequest = await Seller.findByIdAndUpdate(
      sellerId,
      {
        $set: {
          status: "active",
        },
      },
      { new: true }
    );
    if (!approveRequest) {
      return next(errorUtil(500, "Internal Server Error"));
    }

    const deleteRequest = await PendingApproval.findByIdAndDelete(requestId);
    res.status(200).json("Seller Approved!");
  } catch (error) {
    next(error);
  }
};

/* REJECT SELLER REQUEST */
export const declineSellerRequest = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(
      errorUtil(403, "Forbidden, You Are Not Allowed To Perform This!")
    );
  }
  try {
    const requestId = req.params.id;
    const request = await PendingApproval.findById(requestId);
    if (!request) {
      return next(errorUtil(404, "The Request Is No Longer Available"));
    }
    const sellerId = request.seller;
    const approveRequest = await Seller.findByIdAndUpdate(
      sellerId,
      {
        $set: {
          status: "rejected",
        },
      },
      { new: true }
    );
    if (!approveRequest) {
      return next(errorUtil(500, "Internal Server Error"));
    }

    const deleteRequest = await PendingApproval.findByIdAndDelete(requestId);
    const deleteSeller = await Seller.findByIdAndDelete(sellerId);
    res.status(200).json("Seller Rejected!");
  } catch (error) {
    next(error);
  }
};
