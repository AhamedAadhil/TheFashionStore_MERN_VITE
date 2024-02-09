import Buyer from "../models/buyer.model.js";
import Product from "../models/product.model.js";
import Seller from "../models/seller.model.js";
import Review from "../models/review.model.js";
import { errorUtil } from "../utils/error.utils.js";
import { validateMongoDbId } from "../utils/validateMongoDbId.utils.js";

/* CREATE NEW REVIEW FOR PRODUCT */
export const createReviewForProduct = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(errorUtil(404, "The Product is Not Found"));
  }
  try {
    const review = new Review({
      type: "product",
      buyer: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
      product: req.params.id,
    });
    await review.save();
    if (review) {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(errorUtil(404, "The Product is Not Found"));
      }
      // Add the review to the products's reviews array field
      product.reviewhistory.push(review._id);
      await product.save();

      if (product) {
        const buyer = await Buyer.findById(req.user.id);
        if (!buyer) {
          return next(errorUtil(404, "The User is Not Found"));
        }
        // Add the review to the products's reviews array field
        buyer.reviewhistory.push(review._id);
        await buyer.save();
      }
      await product.calculateStars();
      res.status(201).json("Review Posted!");
    } else {
      return next(errorUtil(400, "Something Went Wrong!"));
    }
  } catch (error) {
    next(error);
  }
};

/* CREATE NEW REVIEW FOR SELLER */
export const createReviewForSeller = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(errorUtil(404, "The Seller is Not Found"));
  }
  try {
    // Find the product to get the seller
    const seller = await Seller.findById(id);
    if (!seller) {
      return next(errorUtil(404, "The Seller is Not Found"));
    }

    const review = new Review({
      type: "seller",
      buyer: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
      seller: id,
    });
    await review.save();
    if (review) {
      const buyer = await Product.findById(req.user.id);
      if (!buyer) {
        return next(errorUtil(404, "The Buyer is Not Found"));
      }
      // Add the review to the products's reviews array field
      buyer.reviewhistory.push(review._id);
      await buyer.save();
      await seller.calculateStars();
      res.status(201).json("Review Posted!");
    } else {
      return next(errorUtil(400, "Something Went Wrong!"));
    }
  } catch (error) {
    next(error);
  }
};

/* UPDATE REVIEW BY ID FOR PRODUCT*/
export const updateReviewForProduct = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  if (!id) {
    return next(errorUtil(404, "Review Id is Invalid!"));
  }
  const userId = req.user.id;
  try {
    const review = await Review.findById(id);
    if (review.buyer.toString() !== userId) {
      return next(errorUtil(400, "You Can Only Update Your Own Reviews"));
    }
    const updateReview = await Review.findByIdAndUpdate(
      id,
      {
        $set: {
          rating: req.body.rating,
          comment: req.body.comment,
        },
      },
      { new: true }
    );
    if (!updateReview) {
      return next(errorUtil(404, "Unable To Update This Review!"));
    }

    // Remove the old review from the associated product and user documents
    await Product.findByIdAndUpdate(
      review.product,
      { $pull: { reviewhistory: id } },
      { new: true }
    );

    await Buyer.findByIdAndUpdate(
      userId,
      { $pull: { reviewhistory: id } },
      { new: true }
    );

    // Add the updated review to the associated product and user documents
    const product = await Product.findByIdAndUpdate(
      review.product,
      { $push: { reviewhistory: updateReview._id } },
      { new: true }
    );

    await Buyer.findByIdAndUpdate(
      userId,
      { $push: { reviewhistory: updateReview._id } },
      { new: true }
    );
    await product.calculateStars();
    res.status(201).json("Review Updated!");
  } catch (error) {
    next(error);
  }
};

/* UPDATE REVIEW BY ID FOR SELLER */
export const updateReviewForSeller = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  if (!id) {
    return next(errorUtil(404, "Review Id is Invalid!"));
  }
  const userId = req.user.id;
  try {
    const review = await Review.findById(id);
    if (review.buyer.toString() !== userId) {
      return next(errorUtil(400, "You Can Only Update Your Own Reviews"));
    }
    const updateReview = await Review.findByIdAndUpdate(
      id,
      {
        $set: {
          rating: req.body.rating,
          comment: req.body.comment,
        },
      },
      { new: true }
    );
    if (!updateReview) {
      return next(errorUtil(404, "Unable To Update This Review!"));
    }

    await Buyer.findByIdAndUpdate(
      userId,
      { $pull: { reviewhistory: id } },
      { new: true }
    );

    await Seller.findByIdAndUpdate(
      review.seller,
      { $pull: { reviewhistory: id } },
      { new: true }
    );

    await Buyer.findByIdAndUpdate(
      userId,
      { $push: { reviewhistory: updateReview._id } },
      { new: true }
    );

    const seller = await Seller.findByIdAndUpdate(
      review.seller,
      { $push: { reviewhistory: updateReview._id } },
      { new: true }
    );
    await seller.calculateStars();
    res.status(201).json("Review Updated!");
  } catch (error) {
    next(error);
  }
};

/* DELETE REVIEW BY ID FOR PRODUCT */
export const deleteReviewForProduct = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const userId = req.user.id;
  try {
    const review = await Review.findById(id);
    if (!review) {
      return next(errorUtil(404, "This Review is No Longer Available!"));
    }
    if (review.buyer.toString() !== userId) {
      return next(errorUtil(400, "You Can Only Delete Your Own Reviews"));
    }
    const deleteReview = await Review.findByIdAndDelete(id);
    if (!deleteReview) {
      return next(errorUtil(404, "Unable To Delete This Review!"));
    }

    // Update the associated product document
    const product = await Product.findByIdAndUpdate(
      review.product,
      { $pull: { reviewhistory: id } },
      { new: true }
    );

    // Update the associated user document
    await Buyer.findByIdAndUpdate(
      userId,
      { $pull: { reviewhistory: id } },
      { new: true }
    );
    await product.calculateStars();
    res.status(201).json("Review Deleted!");
  } catch (error) {
    next(error);
  }
};

/* DELETE REVIEW BY ID FOR SELLER */
export const deleteReviewForSeller = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const userId = req.user.id;
  try {
    const review = await Review.findById(id);
    if (!review) {
      return next(errorUtil(404, "This Review is No Longer Available!"));
    }
    if (review.buyer.toString() !== userId) {
      return next(errorUtil(400, "You Can Only Delete Your Own Reviews"));
    }
    const deleteReview = await Review.findByIdAndDelete(id);
    if (!deleteReview) {
      return next(errorUtil(404, "Unable To Delete This Review!"));
    }

    // Update the associated seller document
    const seller = await Seller.findByIdAndUpdate(
      review.seller,
      { $pull: { reviewhistory: id } },
      { new: true }
    );

    // Update the associated user document
    await Buyer.findByIdAndUpdate(
      userId,
      { $pull: { reviewhistory: id } },
      { new: true }
    );

    await seller.calculateStars();
    res.status(201).json("Review Deleted!");
  } catch (error) {
    next(error);
  }
};

/* GET SINGLE REVIEW BY ID */
export const getSingleReview = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const review = await Review.findById(id);
    if (!review) {
      return next(errorUtil(404, "Unable to Find This Review!"));
    }
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

/* GET ALL REVIEWS OF SELLER */
export const getAllReviewOfSeller = async (req, res, next) => {
  try {
    const allReview = await Review.find({ type: "seller" });
    if (!allReview) {
      return next(errorUtil(400, "Unable To Fetch All Reviews"));
    }
    res.status(200).json(allReview);
  } catch (error) {
    next(error);
  }
};

/* GET ALL REVIEWS OF PRODUCT */
export const getAllReviewOfProduct = async (req, res, next) => {
  try {
    const allReview = await Review.find({ type: "product" });
    if (!allReview) {
      return next(errorUtil(400, "Unable To Fetch All Reviews"));
    }
    res.status(200).json(allReview);
  } catch (error) {
    next(error);
  }
};

/* GET SINGLE PRODUCT REVIEWS */
export const getSingleProductReview = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return next(errorUtil(404, "Product Id Is Required!"));
    }
    const reviews = await Review.find({ product: productId });
    if (!reviews) {
      return next(errorUtil(404, "No Reviews Found For this Product"));
    }
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

/* GET SINGLE SELLER REVIEWS */
export const getSingleSellerReview = async (req, res, next) => {
  try {
    const sellerId = req.params.id;
    if (!sellerId) {
      return next(errorUtil(404, "Product Id Is Required!"));
    }
    const reviews = await Review.find({ seller: sellerId });
    if (!reviews) {
      return next(errorUtil(404, "No Reviews Found For this Product"));
    }
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};
