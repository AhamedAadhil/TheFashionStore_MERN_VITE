import jwt from "jsonwebtoken";
import { errorUtil } from "../utils/error.utils.js";

/* VERIFT BUYER */
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorUtil(401, "UnAuthorized!"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorUtil(403, "Forbidden!"));
    if (user.role !== "buyer") return next(errorUtil(403, "Not a Buyer!"));
    if (user.status === "blocked")
      return next(errorUtil(403, "Your Account Has Been Blocked!"));
    req.user = user;
    req.user.role = user.role;
    next();
  });
};

/* VERIFY ADMIN */
export const isAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorUtil(401, "UnAuthorized!"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorUtil(403, "Forbidden!"));
    if (user.role !== "admin") return next(errorUtil(403, "Not an Admin!"));
    if (user.status === "blocked")
      return next(errorUtil(403, "Your Account Has Been Blocked!"));
    req.user = user;
    req.user.role = user.role;
    next();
  });
};

/* VERIFY SELLER */
export const isSeller = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorUtil(401, "UnAuthorized!"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorUtil(403, "Forbidden!"));
    if (user.role !== "seller") return next(errorUtil(403, "Not a Seller!"));
    if (user.status === "blocked")
      return next(errorUtil(403, "Your Account Has Been Blocked!"));
    req.user = user;
    req.user.role = user.role;
    next();
  });
};
