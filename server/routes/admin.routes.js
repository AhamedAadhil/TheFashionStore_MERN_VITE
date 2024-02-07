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
  gellAllPendingSellerApprovals,
  getSinglePendingSellerApproval,
  acceptSellerRequest,
  declineSellerRequest,
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
router.put("/actions/blockSeller/:id", isAdmin, blockSeller);
router.put("/actions/unblockSeller/:id", isAdmin, unBlockSeller);
router.get(
  "/actions/getAllPendingSellerApprovals",
  isAdmin,
  gellAllPendingSellerApprovals
);
router.get(
  "/actions/getSinglePendingSellerApproval/:id",
  isAdmin,
  getSinglePendingSellerApproval
);
router.put("/actions/acceptSellerRequest/:id", isAdmin, acceptSellerRequest);
router.put("/actions/declineSellerRequest/:id", isAdmin, declineSellerRequest);

export default router;
