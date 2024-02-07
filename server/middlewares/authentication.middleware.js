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
    req.user = user;
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
    req.user = user;
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
    req.user = user;
    next();
  });
};
