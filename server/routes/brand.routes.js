import express from "express";
import { isAdmin } from "../middlewares/authentication.middleware.js";
import {
  createBrand,
  deleteBrand,
  getSingleBrand,
  updateBrand,
  getAllBrand,
} from "../controller/brand.controller.js";

const router = express.Router();

router.post("/createBrand", isAdmin, createBrand);
router.put("/updateBrand/:id", isAdmin, updateBrand);
router.delete("/deleteBrand/:id", isAdmin, deleteBrand);
router.get("/getSingleBrand/:id", isAdmin, getSingleBrand);
router.get("/getAllBrand", getAllBrand);

export default router;
