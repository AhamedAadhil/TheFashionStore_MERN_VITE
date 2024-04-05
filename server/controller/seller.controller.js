import Admin from "../models/admin.model.js";
import Seller from "../models/seller.model.js";
import Buyer from "../models/buyer.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Question from "../models/question.model.js";
import PendingApproval from "../models/pending.approval.model.js";
import bcryptjs from "bcryptjs";
import { validateMongoDbId } from "../utils/validateMongoDbId.utils.js";
import { errorUtil } from "../utils/error.utils.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import { generateToken } from "../config/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.utils.js";

/* SELLER REGISTER  */
export const registerSeller = async (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return next(errorUtil(400, "Invalid Email"));
  }
  try {
    const isSellerExist = await Seller.findOne({ email: req.body.email });
    const isBuyerExist = await Buyer.findOne({ email: req.body.email });
    const isAdminExist = await Admin.findOne({ email: req.body.email });
    if (isSellerExist || isBuyerExist || isAdminExist) {
      return next(errorUtil(405, "User Already Exists!"));
    }
    const shopname = await Seller.findOne({ shopname: req.body.shopname });
    if (shopname) {
      return next(errorUtil(405, "Shop Name Already Taken!"));
    }
    const genSalt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(req.body.password, genSalt);
    const newSeller = new Seller({ ...req.body, password: hashedPassword });
    await newSeller.save();
    const pendingApproval = new PendingApproval({
      seller: newSeller._id,
      purpose: "registration",
    });
    await pendingApproval.save();
    const data = {
      to: req.body.email,
      subject: "Account Registration Acknowledgement",
      text: `Dear ${newSeller.sellername},`,
      html: `Dear ${newSeller.sellername},<br/><br/> Thank you for registering with us. Your account is currently under review by our administrators. You will be notified of the status within the next 8 hours.<br/><br/>Best regards,<br/>Gallery Glam`,
    };
    const dataForAdmin = {
      to: "ahamedaathil.5@gmail.com",
      subject: "New Seller Register In Platform",
      text: `Dear Admin,`,
      html: `A New Seller Joined in Our Platform <br/><br/> ${newSeller.sellername},<br/><br/>Please Check The Pending Seller Approval To Approve or Decline This Shop.<br/><br/>Best regards,<br/>Gallery Glam`,
    };
    await sendEmail(data);
    await sendEmail(dataForAdmin);
    res.status(201).json("Your Profile is Under Review!");
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
      const updateSellerLastVisit = await Seller.findByIdAndUpdate(
        isSellerExist._id,
        {
          lastvisittodashboard: new Date(),
        },
        { new: true }
      );
      await updateSellerLastVisit.save();
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
      return next(errorUtil(401, "You Are Not Authorized To Login!"));
    }
  } catch (error) {
    next(error);
  }
};

/* SELLER LOGOUT */
export const logoutSeller = async (req, res, next) => {
  const user = req.user;
  if (user && user.role === "seller") {
    try {
      // Update the refresh token to empty
      await Seller.findOneAndUpdate(
        {
          refreshtoken: req.cookies?.refresh_token,
        },
        { refreshtoken: "" },
        { new: true }
      );
      // Clear the cookies
      res.clearCookie("access_token", { expires: new Date(0) });
      res.clearCookie("refresh_token", { expires: new Date(0) });
      // Send success response
      return res.status(200).json("User Signout Successfully!");
    } catch (error) {
      // Handle any errors
      return next(error);
    }
  }
  // If user is not a seller or there is no user object, still clear cookies and send success response
  res.clearCookie("access_token", { expires: new Date(0) });
  res.clearCookie("refresh_token", { expires: new Date(0) });
  return res.status(200).json("User Signout Successfully!");
};

/* UPDATE SELLER BY ID */
export const updateSeller = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const user = req.user;
  if (!user.role === "seller") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  if (req.user.id !== id) {
    return next(errorUtil(401, "You Can Only Update Your Own Profile!"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedSeller = await Seller.findByIdAndUpdate(
      id,
      {
        $set: {
          password: req.body.password,
          shopname: req.body.shopname,
          mobile: req.body.mobile,
          avatar: req.body.avatar,
          address: req.body.address,
          theme: req.body.theme,
        },
      },
      { new: true }
    );
    const { password: pass, ...rest } = updatedSeller._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

/* DELETE SELLER BY ID */
export const deleteSingleSeller = async (req, res, next) => {
  const user = req.user;
  if (!user.role === "seller") {
    return next(errorUtil(403, "You Are Not Allowed To Perform This Task!"));
  }
  const { id } = req.params;
  validateMongoDbId(id);
  if (req.user.id != id) {
    return next(errorUtil(401, "You Can Only Delete Your Own Profile!"));
  }
  try {
    const seller = await Seller.findById(id);
    if (!seller) {
      return next(errorUtil(404, "No User found with given id"));
    }
    const deleteSeller = await Seller.findByIdAndDelete(id);
    if (!deleteSeller) {
      return next(errorUtil(404, "Something Went Wrong, Please Try Again!"));
    }
    res.status(200).json("Account Deleted!");
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
  const seller = await Seller.findOne({ refreshtoken: refreshToken });
  if (!seller) {
    return next(errorUtil(404, "User not Found!"));
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || seller._id !== decoded.id) {
      return next(errorUtil(404, "There is Something Wrong with the Token!"));
    }
    const accessToken = generateToken(seller?._id, seller?.role);
    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200);
  });
};

/* FORGOT PASSWORD TOKEN */
export const forgotPasswordToken = async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    return next(errorUtil(400, "Please Enter An Email Address!"));
  }
  const seller = await Seller.findOne({ email });
  if (!seller) {
    return next(errorUtil(400, "No User With This Email Address!"));
  }
  try {
    const token = await seller.createPasswordResetToken();
    await seller.save();
    const resetURL = `Hi ${seller.sellername}, Please follow this link to reset Your Password. This link is valid for 10 minutes from now. <a href='https://seller.galleryglam.lk/reset-password/${token}'>Click Here</a>`;
    const data = {
      to: email,
      subject: "Password Reset Link",
      text: `Hello ${seller.sellername}, \n\n Please Keep this URL Safe`,
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
    const seller = await Seller.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!seller) {
      return next(errorUtil(404, "User Not Found!"));
    }
    if (!seller.passwordResetExpires > Date.now()) {
      return next(errorUtil(404, "Token Expired Please Try Again!"));
    }
    const genSalt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, genSalt);
    seller.password = hashedPassword;
    seller.passwordResetToken = undefined;
    seller.passwordResetExpires = undefined;
    await seller.save();
    res
      .status(200)
      .send({ message: "Your Password Has Been Changed Successfully!" });
  } catch (error) {
    next(error);
  }
};

/* GET ALL ORDERS OF THE SELLER */
export const getAllOrders = async (req, res, next) => {
  const sellerId = req.user.id;
  try {
    // Find products associated with the seller
    const sellerProducts = await Product.find({ seller: sellerId }).select(
      "_id"
    );

    // Extract product IDs
    const productIds = sellerProducts.map((product) => product._id);

    // Find orders containing those products
    const allOrders = await Order.find({
      "products.product": { $in: productIds },
    }).populate("products.product orderby seller");

    res.status(200).json(allOrders);
  } catch (error) {
    next(error);
  }
};

/* GET SINGLE ORDER OF THE SELLER */
export const getSingleOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const singleOrder = await Order.findById(id).populate(
      "products.product orderby seller"
    );

    res.status(200).json(singleOrder);
  } catch (error) {
    next(error);
  }
};

/* UPDATE ORDER STATUS */
export const updateOrderStatus = async (req, res, next) => {
  const sellerId = req.user.id;
  validateMongoDbId(sellerId);
  const orderId = req.params.id;
  validateMongoDbId(sellerId);
  const status = req.body.status;
  try {
    const order = await Order.findOne({ _id: orderId, seller: sellerId });
    if (!order) {
      return next(errorUtil(404, "This Order Is Not Exist!"));
    }

    // Calculate total count of products in the order
    const totalCount = order.products.reduce((acc, product) => {
      return acc + product.count;
    }, 0);

    const updateOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          orderstatus: status,
          lastupdate: new Date(),
          paymentintent: {
            ...order.paymentintent,
            status: status,
          },
        },
      },
      { new: true }
    );
    // Update user's order history
    const buyer = await Buyer.findOneAndUpdate(
      { _id: updateOrder.orderby },
      {
        $push: {
          orderhistory: updateOrder._id,
        },
      },
      { new: true }
    );

    if (status === "delivered") {
      const pointsForTheOrder = updateOrder.paymentintent.amount / 100;
      // Increase points for seller
      const seller = await Seller.findByIdAndUpdate(
        sellerId,
        {
          $inc: { points: pointsForTheOrder, totalsold: totalCount },
        },
        { new: true }
      );

      // Increase points for buyer
      buyer.points += pointsForTheOrder;

      const productsToAddToReview = order.products.map((product) => ({
        product: product.product,
        status: true,
      }));
      await Buyer.findByIdAndUpdate(buyer._id, {
        $push: { reviewable: { $each: productsToAddToReview } },
      });
    }

    if (status === "cancelled") {
      // Restore stock and decrease sold values for products in the order
      const updateStockAndSold = updateOrder.products.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.count, sold: -item.count },
        });
      });
      await Promise.all(updateStockAndSold);
    }

    const sellerInfo = await Seller.findById(sellerId).select("email shopname");
    const orderInfo = await Order.findById(orderId);
    const buyerInfo = await Buyer.findOne({ _id: orderInfo.orderby }).select(
      "email username"
    );
    const dataForSeller = {
      to: [sellerInfo.email, "ahamedaathil.5@gmail.com"],
      subject: `Order Status Update: ${orderId} ${status}`,
      html: `<p>Hi ${sellerInfo.shopname},We hope this email finds you well.</p>
<p>We wanted to inform you that the status of an order on our platform has been updated. Here are the details:</p>
<ul>
  <li><strong>Order ID:</strong> ${orderId}</li>
  <li><strong>Buyer ID:</strong> ${orderInfo.orderby}</li>
  <li><strong>Status Updated Date:</strong> ${orderInfo.lastupdate}</li>
  <li><strong>Order Total:</strong> ${orderInfo.paymentintent.amount} ${orderInfo.paymentintent.currency}</li>
  <li><strong>New Order Status:</strong> ${status}</li>
</ul>
<p>Please review the order details and ensure that you are prepared to fulfill it promptly.</p>
<p>If you have any questions or concerns regarding this order, please don't hesitate to contact us. We're here to assist you in any way we can.</p>
<p>Thank you for your continued partnership.</p>
<p>Best regards,<br>Gallery Glam</p>`,
    };

    const dataForBuyer = {
      to: buyerInfo.email,
      subject: `Order Status Update: ${orderId} ${status}`,
      html: `<p>Dear ${buyerInfo.username},</p>

<p>We hope this email finds you well.</p>

<p>We wanted to inform you that the status of your order on our platform has been updated. Here are the details:</p>

<ul>
  <li><strong>Order ID:</strong> ${orderId}</li>
  <li><strong>Status Updated Date:</strong> ${orderInfo.lastupdate}</li>
  <li><strong>Order Total:</strong> ${orderInfo.paymentintent.amount} ${orderInfo.paymentintent.currency}</li>
  <li><strong>New Order Status:</strong> ${status}</li>
</ul>

<p>Please review the updated status of your order. If you have any questions or concerns, feel free to reach out to us. We're here to assist you in any way we can.</p>

<p>Thank you for choosing our platform for your purchase.</p>

<p>Best regards,<br>Gallery Glam</p>
`,
    };
    await sendEmail(dataForSeller);
    await sendEmail(dataForBuyer);

    const sellerProducts = await Product.find({ seller: sellerId }).select(
      "_id"
    );

    // Extract product IDs
    const productIds = sellerProducts.map((product) => product._id);

    // Find orders containing those products
    const allOrders = await Order.find({
      "products.product": { $in: productIds },
    }).populate("products.product");
    res.status(200).json(allOrders);
  } catch (error) {
    next(error);
  }
};

/* DATA FOR SELLER DASHBOARD */
export const dashboardData = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    const seller = await Seller.findById(sellerId);

    /* data1 */
    const liveProductsCount = await Product.countDocuments({
      seller: sellerId,
      status: "live",
    });
    /* data2 */
    const holdProductsCount = await Product.countDocuments({
      seller: sellerId,
      status: "hold",
    });
    const allProducts = await Product.find({
      seller: sellerId,
      status: "live",
    });
    /* data3 */
    const totalSold = seller.totalsold;

    const allOrders = await Order.find({
      seller: sellerId,
    });

    /* data4 */
    const orderCount = allOrders.length;

    const pendingOrders = allOrders.filter(
      (order) => order.orderstatus === "pending"
    );
    /* data6 */
    const pendingOrdersCount = pendingOrders.length;

    const deliveredOrders = allOrders.filter(
      (order) => order.orderstatus === "delivered"
    );

    /* data5 */
    let salesTotal = 0;
    if (deliveredOrders.length > 0) {
      deliveredOrders.map((order) => {
        salesTotal += order.paymentintent.amount;
        return order.paymentintent.amount;
      });
    }

    /* data7 */
    const questionsCount = await Question.countDocuments({
      seller: sellerId,
      answer: "",
    });

    /* data for table 1,2 stock count and sold count */
    const productStocks = await Product.find({
      seller: sellerId,
      status: "live",
    }).select("_id name stock sold");
    const sortedProductStocks = productStocks.sort((a, b) => b.stock - a.stock);
    const sortedProductSales = productStocks.sort((a, b) => b.sold - a.sold);

    res.status(200).json({
      liveProductsCount,
      holdProductsCount,
      totalSold,
      orderCount,
      salesTotal,
      sortedProductStocks,
      sortedProductSales,
      pendingOrdersCount,
      questionsCount,
    });
  } catch (error) {
    next(error);
  }
};

/* GET OWN PENDING PRODUCTS */
export const getPendingProducts = async (req, res, next) => {
  const sellerId = req.user.id;
  try {
    const pendingProduct = await Product.find({
      seller: sellerId,
      status: "hold",
    });
    res.status(200).json(pendingProduct);
  } catch (error) {
    next(error);
  }
};

/* DELETE OWN PENDING PRODUCTS */
export const deletePendingProducts = async (req, res, next) => {
  const sellerId = req.user.id;
  const productId = req.params.id;
  try {
    const pendingProductToDelete = await PendingApproval.findOne({
      purpose: "product",
      product: productId,
    });
    if (pendingProductToDelete.seller.toString() !== sellerId.trim()) {
      return next(errorUtil(400, "You Can Delete Your Products Only!"));
    }
    if (!pendingProductToDelete) {
      return next(
        errorUtil(400, "Cannot Delete The Pending Product Right Now!")
      );
    }
    await PendingApproval.deleteOne({ _id: pendingProductToDelete._id });
    res.status(200).json("Deleted!");
  } catch (error) {
    next(error);
  }
};

/* GET OWN ALL DELIVERED ORDERS */
export const getAllDeliveredOrders = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    const allOrders = await Order.find({
      seller: sellerId,
    }).populate("products.product");
    const deliveredOrders = allOrders.filter(
      (order) => order.orderstatus === "delivered"
    );
    return res.status(200).json(deliveredOrders);
  } catch (error) {
    next(error);
  }
};
