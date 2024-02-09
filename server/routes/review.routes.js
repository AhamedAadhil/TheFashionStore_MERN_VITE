import express from "express";
import {
  isAdmin,
  verifyToken,
} from "../middlewares/authentication.middleware.js";
import {
  getSingleReview,
  getSingleProductReview,
  createReviewForProduct,
  createReviewForSeller,
  updateReviewForProduct,
  updateReviewForSeller,
  deleteReviewForProduct,
  deleteReviewForSeller,
  getSingleSellerReview,
  getAllReviewOfSeller,
  getAllReviewOfProduct,
} from "../controller/review.controller.js";

const router = express.Router();

router.post("/createReviewForProduct/:id", verifyToken, createReviewForProduct);
router.post("/createReviewForSeller/:id", verifyToken, createReviewForSeller);
router.put("/updateReviewForProduct/:id", verifyToken, updateReviewForProduct);
router.put("/updateReviewForSeller/:id", verifyToken, updateReviewForSeller);
router.delete(
  "/deleteReviewForProduct/:id",
  verifyToken,
  deleteReviewForProduct
);
router.delete("/deleteReviewForSeller/:id", verifyToken, deleteReviewForSeller);
router.get("/getSingleReview/:id", getSingleReview);
router.get("/getSingleProductReview/:id", getSingleProductReview);
router.get("/getSingleSellerReview/:id", getSingleSellerReview);
router.get("/getAllReviewOfSeller", verifyToken, getAllReviewOfSeller);
router.get("/getAllReviewOfProduct", verifyToken, getAllReviewOfProduct);

export default router;
