import express from "express";
import {
  isSeller,
  verifyToken,
} from "../middlewares/authentication.middleware.js";
import {
  createQuestion,
  getAllQA,
  replyAQuestion,
  getAllQuestions,
} from "../controller/question.controller.js";

const router = express.Router();

router.post("/createQuestion/:id", verifyToken, createQuestion);
router.get("/getallqa/:id", getAllQA);
router.get("/getAllQuestions/", isSeller, getAllQuestions);
router.post("/replyAQuestion/:id", isSeller, replyAQuestion);

export default router;
