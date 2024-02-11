import Buyer from "../models/buyer.model.js";
import Admin from "../models/admin.model.js";
import Seller from "../models/seller.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import Coupon from "../models/coupon.model.js";
import { errorUtil } from "../utils/error.utils.js";
import { generateToken } from "../config/jwtToken.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import { validateMongoDbId } from "../utils/validateMongoDbId.utils.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.utils.js";

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
    const accountStatus = isBuyerExist.status;
    if (accountStatus === "active") {
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
    } else {
      return next(errorUtil(401, "You  Are Not Authorized To Login!"));
    }
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
  const user = req.user;
  if (!user.role === "buyer") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
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
  const user = req.user;
  if (!user.role === "buyer") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
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
  const user = req.user;
  if (!user.role === "buyer") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  try {
    const allBuyers = await Buyer.find();
    res.status(200).json(allBuyers);
  } catch (error) {
    next(error);
  }
};

/* GET A SINGLE BUYER BY ID */
export const getSingleBuyer = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "buyer") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
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

/* GET BUYER WISHLIST */
export const getWishList = async (req, res, next) => {
  const buyerId = req.user.id;
  try {
    const buyer = await Buyer.findById(buyerId).populate("wishlist");
    if (!buyer) {
      return next(errorUtil(404, "Buyer not Found!"));
    }
    res.status(200).json(buyer.wishlist);
  } catch (error) {
    next(error);
  }
};

/* DELETE A BUYER BY ID*/
export const deleteSingleBuyer = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "buyer") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
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

/* UPDATE PASSWORD */
export const updatePassword = async (req, res, next) => {
  const { id } = req.user;
  const { password } = req.body;
  validateMongoDbId(id);
  if (req.user.id !== id) {
    return next(errorUtil(401, "You Can Only Update Your Own Password!"));
  }
  try {
    const buyer = await Buyer.findById(id);
    if (!buyer) {
      return next(errorUtil(404, "User not Found"));
    }
    if (password) {
      const genSalt = bcryptjs.genSaltSync(10);
      const hashedPassword = bcryptjs.hashSync(password, genSalt);
      const token = crypto.randomBytes(32).toString("hex");
      const passwordResetToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      buyer.passwordResetToken = passwordResetToken;
      buyer.passwordResetExpires = Date.now() + 10800000;
      buyer.password = hashedPassword;
      const updatedBuyer = await buyer.save();
      res.status(200).json(updatedBuyer);
    } else {
      return next(errorUtil(404, "New Password Is Required!"));
    }
  } catch (error) {
    next(error);
  }
};

/* FORGOT PASSWORD TOKEN */
export const forgotPasswordToken = async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    return next(errorUtil(400, "Please Enter An Email Address!"));
  }
  const buyer = await Buyer.findOne({ email });
  if (!buyer) {
    return next(errorUtil(400, "No User With This Email Address!"));
  }
  try {
    const token = await buyer.createPasswordResetToken();
    await buyer.save();
    const resetURL = `Hi ${buyer.username}, Please follow this link to reset Your Password. This link is valid for 10 minutes from now. <a href='http://localhost:3001/api/buyer/auth/resetPassword/${token}'>Click Here</a>`;
    const data = {
      to: email,
      subject: "Password Reset Link",
      text: `Hello ${buyer.username}, \n\n Please Keep this URL Safe`,
      html: resetURL,
    };
    await sendEmail(data);
    res.status(200).json("Please Check Your Email For Reset Link!");
  } catch (error) {
    next(error);
  }
};

/* RESET PASSWORD */
export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    if (!password) {
      return next(errorUtil(404, "Password Not Found!"));
    }
    if (!token) {
      return next(errorUtil(404, "Token Not Found!"));
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const buyer = await Buyer.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!buyer) {
      return next(errorUtil(404, "User Not Found!"));
    }
    if (!buyer.passwordResetExpires > Date.now()) {
      return next(errorUtil(404, "Token Expired Please Try Again!"));
    }
    const genSalt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, genSalt);
    buyer.password = hashedPassword;
    buyer.passwordResetToken = undefined;
    buyer.passwordResetExpires = undefined;
    await buyer.save();
    res.status(200).send("Your Password Has Been Changed Successfully");
  } catch (error) {
    next(error);
  }
};

/* ASK BUYER ADDRESS POPUP WHEN CHECKOUT */
export const askAddress = async (req, res, next) => {
  let userId = req.user.id;
  validateMongoDbId(userId);
  try {
    const buyer = await Buyer.findById(userId);
    if (!buyer) {
      return next(errorUtil(404, "Buyer not found"));
    }
    const newAddress = {
      label: req.body.label || "Home",
      housenumber: req.body.housenumber || "",
      street: req.body.street || "",
      city: req.body.city || "",
      state: req.body.state || "",
    };
    buyer.address.push(newAddress);
    await buyer.save();
    return res.status(200).json("New Address Added!");
  } catch (error) {
    next(error);
  }
};

/* GET ALL ADDRESS OF BUYER */
export const getAllAddress = async (req, res, next) => {
  const buyerId = req.user.id;
  try {
    const buyer = await Buyer.findById(buyerId);
    if (!buyer) {
      return next(errorUtil(404, "Buyer Not Found!"));
    }
    const buyerAddress = buyer.address;
    res.status(200).json(buyerAddress);
  } catch (error) {
    next(error);
  }
};

/* DELETE ADDRESS BY ID */
export const deleteAddress = async (req, res, next) => {
  const addressId = req.params.id;
  const userId = req.user.id;
  try {
    const buyer = await Buyer.findById(userId);
    if (!buyer) {
      return next(errorUtil(404, "No buyer found with the provided user ID"));
    }
    const index = buyer.address.findIndex(
      (address) => address._id.toString() === addressId
    );
    if (index === -1) {
      // If the address ID doesn't match any address in the array
      return next(errorUtil(404, "No Such Address In This Account"));
    } else {
      // If the address ID matches, remove it from the array
      buyer.address.splice(index, 1);
      await buyer.save();

      return res.status(200).json({ message: "Address deleted successfully" });
    }
  } catch (error) {
    next(error);
  }
};

/* UPDATE EXISTING ADDRESS BY ID */
export const updateAddress = async (req, res, next) => {
  const addressId = req.params.id;
  const userId = req.user.id;
  const { label, housenumber, street, city, state } = req.body;
  try {
    const buyer = await Buyer.findById(userId);
    if (!buyer) {
      return next(errorUtil(404, "No buyer found with the provided user ID"));
    }
    const index = buyer.address.findIndex(
      (address) => address._id.toString() === addressId
    );
    if (index === -1) {
      return next(errorUtil(404, "No Such Address In This Account"));
    } else {
      buyer.address[index] = {
        ...buyer.address[index],
        label: label || buyer.address[index].label,
        housenumber: housenumber || buyer.address[index].housenumber,
        street: street || buyer.address[index].street,
        city: city || buyer.address[index].city,
        state: state || buyer.address[index].state,
      };
      await buyer.save();
      return res.status(200).json("Address Updated Successfully");
    }
  } catch (error) {
    next(error);
  }
};

/* ADD TO CART */
export const addToCart = async (req, res, next) => {
  const { cart } = req.body;
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    let products = [];
    const buyer = await Buyer.findById(id);
    if (!buyer) {
      return next(errorUtil(404, "Buyer Not Found!"));
    }
    const alreadyExistCart = await Cart.findOne({ orderby: buyer._id }).exec();
    if (alreadyExistCart) {
      await Cart.deleteOne({ _id: alreadyExistCart._id });
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color || "N/A";
      object.size = cart[i].size || "N/A";
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].count * products[i].price;
    }
    let newCart = new Cart({
      products,
      carttotal: cartTotal,
      orderby: buyer._id,
    });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
};

/* GET BUYER CART */
export const getUserCart = async (req, res, next) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const cart = await Cart.findOne({ orderby: id }).populate(
      "products.product"
    );
    if (!cart) {
      return next(errorUtil(404, "Cannot Get The Cart!"));
    }
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

/* EMPTY CART */
export const emptyCart = async (req, res, next) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const buyer = await Buyer.findById(id);
    if (!buyer) {
      return next(errorUtil(404, "Cannot Find The User!"));
    }
    const cart = await Cart.findOneAndDelete({ orderby: buyer._id });
    if (!cart) {
      return next(errorUtil(404, "Unable To Delete The Cart!"));
    }
    res.status(200).json("Cart Cleared!");
  } catch (error) {
    next(error);
  }
};

/* APPLY COUPON */
export const applyCoupon = async (req, res, next) => {
  const { coupon } = req.body;
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (!validCoupon) {
      return next(errorUtil(400, "Invalid Coupon!"));
    }

    // Check if the expiry date is present and it's a future date
    const currentDate = new Date();
    if (!validCoupon.expiry || validCoupon.expiry <= currentDate) {
      return next(errorUtil(400, "Coupon has expired!"));
    }

    // Check if the user has already used the coupon
    if (validCoupon.expiryusers && validCoupon.expiryusers.includes(id)) {
      return next(errorUtil(400, "Coupon has already been used by this user!"));
    }

    const buyer = await Buyer.findById(id);
    if (!buyer) {
      return next(errorUtil(404, "Buyer Not Found!"));
    }
    let cart = await Cart.findOne({ orderby: buyer._id }).populate(
      "products.product"
    );
    // Check if the cart exists and has products
    if (!cart || cart.products.length === 0) {
      return next(errorUtil(400, "No Products In The Cart!"));
    }

    // Find the eligible product in the cart
    const eligibleProduct = cart.products.find(
      (product) =>
        product.product.seller.toString() === validCoupon.seller.toString()
    );

    // Check if an eligible product is found
    if (!eligibleProduct) {
      return next(
        errorUtil(400, "No eligible product found in the cart for the coupon!")
      );
    }
    // Apply the discount to the eligible product
    const discount = validCoupon.discount;
    const discountedPrice = eligibleProduct.product.price - discount;
    eligibleProduct.product.price = discountedPrice;

    // Calculate the total cart price after applying the discount
    let cartTotal = 0;
    for (let product of cart.products) {
      cartTotal += product.count * product.product.price;
    }
    // Update the cart total with the new discounted prices
    cart.carttotal = cartTotal;

    // Save the updated cart
    await cart.save();

    // Add the user id to the expiryUsers array to mark the coupon as used by this user
    validCoupon.expiryusers.push(id);
    await validCoupon.save();

    // Respond with the total cart price after the discount
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};
