import Admin from "../models/admin.model.js";
import Seller from "../models/seller.model.js";
import Buyer from "../models/buyer.model.js";
import Carousel from "../models/carousel.model.js";
import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import bcryptjs from "bcryptjs";
import { generateRefreshToken } from "../config/refreshToken.js";
import { generateToken } from "../config/jwtToken.js";
import { errorUtil } from "../utils/error.utils.js";
import PendingApproval from "../models/pending.approval.model.js";
import { sendEmail } from "../utils/sendEmail.utils.js";

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
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  try {
    await Admin.findOneAndUpdate(
      {
        refreshtoken: req.cookies?.refresh_token,
      },
      { refreshtoken: "" },
      { new: true }
    );
    res.clearCookie("access_token", { expires: new Date(0) });
    res.clearCookie("refresh_token", { expires: new Date(0) });
    res.status(200).json("Admin Signout Successfully!");
  } catch (error) {
    next(error);
  }
};

/* GET ALL BUYERS */
export const getAllBuyers = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
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
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
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
    const allBuyers = await Buyer.find({
      status: { $in: ["active", "blocked"] },
    });
    res.status(200).json(allBuyers);
  } catch (error) {
    next(error);
  }
};

/* GET A SINGLE BUYER BY ID */
export const getSingleBuyer = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  try {
    const { id } = req.params;
    const buyer = await Buyer.findById(id).populate("orderhistory");
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
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
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
    const allBuyes = await Buyer.find({
      status: { $in: ["blocked", "active"] },
    });
    res.status(200).json(allBuyes);
  } catch (error) {
    next(error);
  }
};

/* UN-BLOCK A BUYER */
export const unBlockBuyer = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
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

    const allBuyes = await Buyer.find({
      status: { $in: ["blocked", "active"] },
    });
    res.status(200).json(allBuyes);
  } catch (error) {
    next(error);
  }
};

/* GET ALL SELLERS */
export const getAllSellers = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  try {
    const allSellers = await Seller.find({
      status: { $in: ["active", "blocked"] },
    });
    res.status(200).json(allSellers);
  } catch (error) {
    next(error);
  }
};

/* GET A SELLER BY ID */
export const getSingleSeller = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);
    if (!seller) {
      return next(errorUtil(404, "No User found with given id"));
    }
    const { password: pass, ...rest } = seller._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

/* DELETE A SELLER BY ID */
export const deleteSingleSeller = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);
    if (!seller) {
      return next(errorUtil(404, "No User found with given id"));
    }
    const deleteSeller = await Seller.findByIdAndDelete(id);
    if (!deleteSeller) {
      return next(errorUtil(404, "Something Went Wrong, Please Try Again!"));
    }
    const allSellers = await Seller.find({
      status: { $in: ["active", "blocked"] },
    });
    res.status(200).json(allSellers);
  } catch (error) {
    next(error);
  }
};

/* BLOCK A SELLER */
export const blockSeller = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
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
    const allSellers = await Seller.find({
      status: { $in: ["active", "blocked"] },
    });
    res.status(200).json(allSellers);
  } catch (error) {
    next(error);
  }
};

/* UN-BLOCK A SELLER */
export const unBlockSeller = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
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

    const allSellers = await Seller.find({
      status: { $in: ["active", "blocked"] },
    });
    res.status(200).json(allSellers);
  } catch (error) {
    next(error);
  }
};

/* GET ALL PENDING SELLER APPROVALS  */
export const getAllPendingSellerApprovals = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  try {
    const pendingApprovals = await PendingApproval.find({
      purpose: "registration",
    }).populate("seller");
    res.status(200).json(pendingApprovals);
  } catch (error) {
    next(error);
  }
};

/* GET A PENDING SELLER APPROVAL BY ID */
export const getSinglePendingSellerApproval = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  try {
    const requestId = req.params.id;
    let request = await PendingApproval.findById(requestId);
    if (!request) {
      return next(errorUtil(404, "No Request Found With The Given ID!"));
    }
    const pendingApproval = await request.populate("seller");

    if (!pendingApproval.seller) {
      return next(errorUtil(404, "No Seller  Associated With This Request!"));
    }

    if (!pendingApproval.seller.status === "hold") {
      return next(errorUtil(404, "Seller Status Is Not Hold!"));
    }

    const { password: pass, ...rest } = pendingApproval.seller._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

/* ACCEPT SELLER REQUEST */
export const acceptSellerRequest = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
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
    const sellerDetails = await Seller.findById(sellerId).select(
      "email sellername shopname"
    );
    const deleteRequest = await PendingApproval.findByIdAndDelete(requestId);
    const data = {
      to: sellerDetails.email,
      subject: "Account Approval Status",
      text: `Dear ${sellerDetails.sellername},`,
      html: `Dear ${sellerDetails.sellername},<br/><br/> Thank you for registering with us. We are pleased to inform you that your account has been approved and is now active.<br/><br/>
      You can now start using our platform to list your products and manage your sales.<br/><br/> Shop Name:  ${sellerDetails.shopname} <br/><br/> 
       If you have any questions or need assistance, please feel free to contact our support team.<br/><br/>Best regards,<br/>TFS Fashions`,
    };
    await sendEmail(data);
    const pendingApprovals = await PendingApproval.find({
      purpose: "registration",
    }).populate("seller");
    res.status(200).json(pendingApprovals);
  } catch (error) {
    next(error);
  }
};

/* REJECT SELLER REQUEST */
export const declineSellerRequest = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
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
    const sellerDetails = await Seller.findById(sellerId).select(
      "email sellername shopname"
    );
    const deleteRequest = await PendingApproval.findByIdAndDelete(requestId);

    const data = {
      to: sellerDetails.email,
      subject: "Account Approval Status",
      text: `Dear ${sellerDetails.sellername},`,
      html: `Dear ${sellerDetails.sellername},<br/><br/> Thank you for registering with us. We regret to inform you that your account registration has been denied.<br/><br/> 
       If you have any questions or need assistance, please feel free to contact our support team.<br/><br/>Best regards,<br/>TFS Fashions`,
    };
    await sendEmail(data);
    const deleteSeller = await Seller.findByIdAndDelete(sellerId);
    const pendingApprovals = await PendingApproval.find({
      purpose: "registration",
    }).populate("seller");
    res.status(200).json(pendingApprovals);
  } catch (error) {
    next(error);
  }
};

/* GET ALL PENDING PRODUCT APPROVALS  */
export const getAllPendingProductApprovals = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  try {
    const pendingApprovals = await PendingApproval.find({
      purpose: "product",
    }).populate("seller");
    res.status(200).json(pendingApprovals);
  } catch (error) {
    next(error);
  }
};

/* GET A PENDING PRODUCT APPROVAL BY ID */
export const getSinglePendingProductApproval = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  try {
    const requestId = req.params.id;
    let request = await PendingApproval.findById(requestId).populate("product");

    if (!request) {
      return next(errorUtil(404, "No Request Found With The Given ID"));
    }

    // Access the populated 'product' field
    const product = request.product;

    // Check if a product is associated with this pending approval
    if (!product) {
      return next(
        errorUtil(404, "No Product Associated With The Pending Approval")
      );
    }

    // Populate the related fields ('category' and 'brand') of the 'product'
    await product.populate("category");
    await product.populate("brand");

    // Check if the product status is "hold"
    if (product.status !== "hold") {
      return next(errorUtil(404, "Product Status Is Not 'hold'"));
    }

    // Respond with the product associated with the pending approval
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

/*  UPDATE A PRODUCT BY ID */
export const updateProduct = async (req, res, next) => {
  const productId = req.params.id;
  const productCategory = req.body.category;
  const productBrand = req.body.brand;
  try {
    const product = await Product.findById(productId);
    if (!product.status === "live") {
      return next(errorUtil(403, "This Product is Still Under  Review"));
    }
    const category = await Category.findOne({ title: productCategory });
    if (!category) {
      return next(errorUtil(404, "This Category Is Not Found!"));
    }
    const brand = await Brand.findOne({ title: productBrand });
    if (!brand) {
      return next(errorUtil(404, "This Brand Is Not Found!"));
    }

    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          imageUrls: req.body.imageUrls,
          price: req.body.price,
          category: category._id,
          brand: brand._id,
          size: req.body.size,
          color: req.body.color,
          stock: req.body.stock,
        },
      },
      { new: true }
    );
    if (!updateProduct)
      return next(errorUtil(405, "Cannot Update The Product Now!"));

    res.status(200).json(updateProduct);
  } catch (error) {
    next(error);
  }
};

/*  DELETE A PRODUCT BY ID */
export const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    const deleteProduct = await Product.findByIdAndDelete(productId);
    if (!deleteProduct)
      return next(errorUtil(405, "Cannot Delete The Product Now!"));

    const selletId = product.seller;

    const seller = await Seller.findById(selletId);

    seller.products.pull(deleteProduct._id);
    await seller.save();

    const products = await Product.find({ status: "live" });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

/* ACCEPT PRODUCT REQUEST */
export const acceptProductRequest = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  try {
    const requestId = req.params.id;
    const request = await PendingApproval.findById(requestId);
    if (!request) {
      return next(errorUtil(404, "The Request Is No Longer Available"));
    }
    const productId = request.product;
    const approveRequest = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          status: "live",
        },
      },
      { new: true }
    );
    if (!approveRequest) {
      return next(errorUtil(500, "Internal Server Error"));
    }
    const productName = await Product.findById(productId).select("name");
    const sellerDetails = await Product.findById(productId).populate(
      "seller",
      "email sellername"
    );
    const data = {
      to: sellerDetails.seller.email,
      subject: "Your Product has been Approved!",
      text: `Dear ${sellerDetails.seller.sellername},`,
      html: `Dear ${sellerDetails.seller.sellername},<br/><br/> We are pleased to inform you that your product, <b>${productName.name}</b>, has been approved and is now live on our platform. Customers can now view and purchase your product.<br/><br/>
     Thank you for listing your product with us. If you have any questions or need further assistance, feel free to contact our support team. <br/><br/> 
      Best regards,<br/>TFS Fashions`,
    };
    await sendEmail(data);
    await PendingApproval.findByIdAndDelete(requestId);
    const pendingApprovals = await PendingApproval.find({
      purpose: "product",
    }).populate("seller");
    res.status(200).json(pendingApprovals);
  } catch (error) {
    next(error);
  }
};

/* REJECT PRODUCT REQUEST */
export const declineProductRequest = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "admin") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  try {
    const requestId = req.params.id;
    const request = await PendingApproval.findById(requestId);
    if (!request) {
      return next(errorUtil(404, "The Request Is No Longer Available"));
    }
    const productId = request.product;
    const approveRequest = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          status: "hold",
        },
      },
      { new: true }
    );
    if (!approveRequest) {
      return next(errorUtil(500, "Internal Server Error"));
    }
    const productName = await Product.findById(productId).select("name");
    const sellerDetails = await Product.findById(productId).populate(
      "seller",
      "email sellername"
    );
    const data = {
      to: sellerDetails.seller.email,
      subject: "Product Approval Status: Not Approved",
      text: `Dear ${sellerDetails.seller.sellername},`,
      html: `Dear ${sellerDetails.seller.sellername},<br/><br/> We regret to inform you that your product, <b>${productName.name}</b>, has not been approved for listing on our platform. Our team has reviewed your product and determined that it does not meet our quality standards or guidelines.<br/><br/>
     If you have any questions or would like more information about why your product was not approved, please don't hesitate to contact our support team. <br/><br/> 
     Thank you for your understanding.<br/><br/> 
     Best regards,<br/>TFS Fashions`,
    };
    await sendEmail(data);
    await PendingApproval.findByIdAndDelete(requestId);
    await Product.findByIdAndDelete(productId);
    const pendingApprovals = await PendingApproval.find({
      purpose: "product",
    }).populate("seller");
    res.status(200).json(pendingApprovals);
  } catch (error) {
    next(error);
  }
};

/* TOGGLE VERIFY SELLER */
export const verifySeller = async (req, res, next) => {
  const sellerId = req.params.id;
  try {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return next(errorUtil(404, "Seller Not Found!"));
    }
    let isVerified = seller.verified;
    isVerified = !isVerified;
    const updatedSeller = await Seller.findByIdAndUpdate(
      sellerId,
      { verified: isVerified },
      { new: true }
    );
    if (!updatedSeller) {
      return next(
        errorUtil(
          500,
          "Server error when updating the seller's verified status"
        )
      );
    }
    const allSellers = await Seller.find({
      status: { $in: ["active", "blocked"] },
    });
    res.status(200).json({
      message: `${seller.shopname} ${
        isVerified ? "Verified" : "Unverified"
      } Successfully!`,
      sellers: allSellers,
    });
  } catch (error) {
    next(error);
  }
};

/* CREATE CAROUSEL */
export const createCarousel = async (req, res, next) => {
  try {
    const carousel = new Carousel({
      imageUrl: req.body.imageUrl,
      url: req.body.url,
    });
    await carousel.save();
    res.status(201).json(carousel);
  } catch (error) {
    next(error);
  }
};

/* GET ALL CAROUSELS */
export const getAllCarousels = async (req, res, next) => {
  try {
    const allCarousels = await Carousel.find();
    if (!allCarousels) {
      return next(errorUtil(404, "No Carousels Found!"));
    }
    res.status(200).json(allCarousels);
  } catch (error) {
    next(error);
  }
};

/* DELETE A CAROUSEL BY ID */
export const deleteCarousel = async (req, res, next) => {
  try {
    const carouselId = req.params.id;
    const carousel = await Carousel.findByIdAndDelete(carouselId);
    if (!carousel) {
      return next(errorUtil(400, "Unable to Delete Carousel!"));
    }
    const allCarousels = await Carousel.find();
    res.status(200).json(allCarousels);
  } catch (error) {
    next(error);
  }
};

/* ADMIN DASHBOARD DATA */
export const dashboardData = async (req, res, next) => {
  try {
    const liveProducts = await Product.find({ status: "live" })
      .select("sold seller name _id")
      .populate("seller");
    const liveProductsCount = liveProducts.length;
    const pendingProducts = await PendingApproval.find({
      purpose: "product",
    });
    const pendingProductsCount = pendingProducts.length;
    const liveSellers = await Seller.find({
      status: { $in: ["active", "blocked"] },
    }).select("points shopname _id");
    const liveSellersCount = liveSellers.length;
    const pendingSellers = await PendingApproval.find({
      purpose: "registration",
    });
    const pendingSellersCount = pendingSellers.length;
    const liveBuyers = await Buyer.find({ status: "active" }).select(
      "points username _id"
    );
    const liveBuyersCount = liveBuyers.length;
    const topBuyers = liveBuyers
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);
    const topSellers = liveSellers
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);
    const topProducts = liveProducts
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    res.status(200).json({
      liveProductsCount,
      pendingProductsCount,
      liveSellersCount,
      pendingSellersCount,
      liveBuyersCount,
      topBuyers,
      topSellers,
      topProducts,
    });
  } catch (error) {
    next(error);
  }
};

/* GET SINGLE ORDER BY ID */
export const getSingleOrder = async (req, res, next) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send("No order with that id");
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
