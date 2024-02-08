import express from "express";
import {
  adminLogin,
  deleteSingleBuyer,
  getAllBuyers,
  getSingleBuyer,
  blockBuyer,
  unBlockBuyer,
  adminLogout,
  blockSeller,
  unBlockSeller,
  getAllPendingSellerApprovals,
  getSinglePendingSellerApproval,
  acceptSellerRequest,
  declineSellerRequest,
  getAllSellers,
  getSingleSeller,
  deleteSingleSeller,
  getAllPendingProductApprovals,
  getSinglePendingProductApproval,
  acceptProductRequest,
  declineProductRequest,
} from "../controller/admin.controller.js";
import { isAdmin } from "../middlewares/authentication.middleware.js";

const router = express.Router();

/* ADMIN AUTH ACTIONS */
router.post("/auth/login", adminLogin);
router.post("/auth/logout", isAdmin, adminLogout);

/* BUYER ACTIONS */
router.get("/actions/allBuyers", isAdmin, getAllBuyers);
router.get("/actions/getBuyer/:id", isAdmin, getSingleBuyer);
router.delete("/actions/deleteBuyer", isAdmin, deleteSingleBuyer);
router.put("/actions/blockBuyer/:id", isAdmin, blockBuyer);
router.put("/actions/unblockBuyer/:id", isAdmin, unBlockBuyer);

/* SELLER ACTIONS */
router.get("/actions/allSellers", isAdmin, getAllSellers);
router.get("/actions/getSeller/:id", isAdmin, getSingleSeller);
router.delete("/actions/deleteSeller", isAdmin, deleteSingleSeller);
router.put("/actions/blockSeller/:id", isAdmin, blockSeller);
router.put("/actions/unblockSeller/:id", isAdmin, unBlockSeller);
router.get(
  "/actions/getAllPendingSellerApprovals",
  isAdmin,
  getAllPendingSellerApprovals
);
router.get(
  "/actions/getSinglePendingSellerApproval/:id",
  isAdmin,
  getSinglePendingSellerApproval
);
router.put("/actions/acceptSellerRequest/:id", isAdmin, acceptSellerRequest);
router.put("/actions/declineSellerRequest/:id", isAdmin, declineSellerRequest);

/* PRODUCT ACTIONS */
router.get(
  "/actions/getAllPendingProductApprovals",
  isAdmin,
  getAllPendingProductApprovals
);
router.get(
  "/actions/getSinglePendingProductApproval/:id",
  isAdmin,
  getSinglePendingProductApproval
);

router.put("/actions/acceptProductRequest/:id", isAdmin, acceptProductRequest);
router.put(
  "/actions/declineProductRequest/:id",
  isAdmin,
  declineProductRequest
);

export default router;
