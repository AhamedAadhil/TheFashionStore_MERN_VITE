import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controller/product.controller.js";
import {
  isSeller,
  verifyToken,
} from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.post("/createProduct", isSeller, createProduct);
router.get("/allProducts", getAllProducts);
router.get("/:id", getSingleProduct);
router.put("/update/:id", isSeller, updateProduct);
router.delete("/delete/:id", isSeller, deleteProduct);

export default router;
