import mongoose from "mongoose";
import Review from "./review.model.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrls: {
      type: Array,
      required: true,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["hold", "live"],
      default: "hold",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    quality: {
      type: String,
      enum: ["original", "a_grade"],
      required: true,
    },
    size: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },
    color: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    orderhistory: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
      ],
      default: [],
    },
    reviewhistory: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review",
        },
      ],
      default: [],
    },
    stars: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    questions: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Define indexes if needed
productSchema.index({ name: 1, category: 1 });

// Define a method to recalculate and update the stars field
productSchema.methods.calculateStars = async function () {
  const product = this;

  // Find all reviews for this product
  const reviews = await Review.find({ product: product._id });

  // Calculate the total rating sum and count of reviews
  let totalRating = 0;
  let reviewCount = reviews.length;

  if (reviewCount > 0) {
    // Calculate the total rating sum
    totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    // Calculate the average rating (stars)
    const averageRating = totalRating / reviewCount;

    // Update the stars field of the product
    product.stars = averageRating;
  } else {
    // If there are no reviews, stars will remain 0
    product.stars = 0;
  }

  // Save the updated product
  await product.save();
};

// Export the model
const Product = mongoose.model("Product", productSchema);
export default Product;
