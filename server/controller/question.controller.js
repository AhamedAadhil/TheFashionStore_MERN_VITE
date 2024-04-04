import Buyer from "../models/buyer.model.js";
import Product from "../models/product.model.js";
import Question from "../models/question.model.js";
import Seller from "../models/seller.model.js";

/* CREATE A QUESTION */
export const createQuestion = async (req, res, next) => {
  const { id } = req.params;
  const buyerId = req.user.id;

  if (!id) {
    return next(errorUtil(404, "Product Not Found"));
  }
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) {
    return next(errorUtil(404, "Buyer Not Found"));
  }
  const product = await Product.findById(id);
  if (!product) {
    return next(errorUtil(404, "Product not found"));
  }

  const seller = await Seller.findById(product.seller);
  if (!seller) {
    return next(errorUtil(404, "Seller not found"));
  }
  try {
    const question = new Question({
      buyer: buyerId,
      product: id,
      seller: seller._id,
      qa: req.body.qa,
      type: "question",
    });
    await question.save();
    if (question) {
      product.questions.push(question._id);
      seller.questions.push(question._id);
      await product.save();
      await seller.save();
      await product.populate("questions");
      const data = {
        to: seller.email,
        subject: "New Question for Your Product",
        html: `<p>Dear ${seller.shopname} <br/><br/>  
        <h3>New Question for Product: ${product.name}</h3>
        <p>A new question has been asked about your product. Please review and answer it as soon as possible:</p>
        <p>Question: ${question.qa}</p>
        <p>Product Name: ${product.name}</p>,
        <p>Product ID: ${product._id}</p>`,
      };
      await sendEmail(data);
      res.status(201).json(product.questions);
    }
  } catch (error) {
    next(error);
  }
};

/* GET ALL QUESTIONS AND ANSWERS OF A SINGLE PRODUCT */
export const getAllQA = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(errorUtil(404, "Product Not Found"));
  }
  try {
    const allQA = await Question.find({ product: id })
      .populate({
        path: "buyer",
        select: "username avatar",
      })
      .populate({
        path: "seller",
        select: "shopname",
      });
    if (allQA.length === 0) {
      return res.status(200).json("No questions Asked!");
    }
    res.status(200).json(allQA);
  } catch (error) {
    next(error);
  }
};

/* REPLY TO A QUESTION */
export const replyAQuestion = async (req, res, next) => {
  const { id } = req.params;
  const sellerId = req.user.id;

  if (!id) {
    return next(errorUtil(404, "Product Not Found"));
  }
  const question = await Question.findById(id);
  if (!question) {
    return next(errorUtil(404, "Question not found"));
  }
  const product = await Product.findById(question.product);
  if (!product) {
    return next(errorUtil(404, "Product Not Found"));
  }
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    return next(errorUtil(404, "Seller Not Found"));
  }
  const buyer = await Buyer.findById(question.buyer);
  if (!buyer) {
    return next(errorUtil(404, "Buyer not found"));
  }
  try {
    const question = new Question({
      buyer: buyer._id,
      product: product,
      seller: seller._id,
      qa: req.body.qa,
      type: "answer",
    });
    await question.save();
    if (question) {
      product.questions.push(question._id);
      seller.questions.push(question._id);
      await product.save();
      await seller.save();
      await product.populate("questions");
      res.status(201).json(product.questions);
    }
  } catch (error) {
    next(error);
  }
};

/* GET ALL QUESTIONS OF A SELLER */
export const getAllQuestions = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    const questions = await Question.find({
      seller: sellerId,
      type: "question",
    })
      .populate({
        path: "buyer",
        select: "username",
      })
      .populate({
        path: "product",
        select: "name price",
      });
    return res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};
