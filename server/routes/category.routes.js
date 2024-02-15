import express from "express";
import { isAdmin } from "../middlewares/authentication.middleware.js";
import {
  createCategory,
  deleteCategory,
  getSingleCategory,
  updateCategory,
  getAllCategory,
} from "../controller/category.controller.js";

const router = express.Router();

router.post("/createCategory", isAdmin, createCategory);
router.put("/updateCategory/:id", isAdmin, updateCategory);
router.delete("/deleteCategory/:id", isAdmin, deleteCategory);
router.get("/getSingleCategory/:id", getSingleCategory);
router.get("/getAllCategory", getAllCategory);

export default router;
