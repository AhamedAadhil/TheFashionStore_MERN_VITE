import mongoose from "mongoose";
import Review from "./review.model.js";
import crypto from "crypto";

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    default: "Home",
  },
  housenumber: {
    default: "",
    type: String,
    required: true,
  },
  street: {
    default: "",
    type: String,
    required: true,
  },
  city: {
    default: "",
    type: String,
    required: true,
  },
  state: {
    default: "",
    type: String,
    required: true,
  },
});

const sellerSchema = new mongoose.Schema(
  {
    sellername: {
      type: String,
      required: true,
      index: true,
      minlength: 3,
      maxlength: 30,
    },
    shopname: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      default: "seller",
    },
    avatar: {
      type: String,
      required: true,
      default:
        "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
    },
    points: {
      type: Number,
      default: 0,
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
    products: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },

    status: {
      type: String,
      default: "pending",
    },
    verified: {
      type: Boolean,
      default: false,
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
    theme: {
      type: String,
      default: "light",
    },
    address: {
      type: addressSchema,
    },
    refreshtoken: {
      type: String,
    },
    stars: {
      type: Number,
      default: 0,
    },
    totalsold: {
      type: Number,
      default: 0,
    },
    passwordcChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Define a method to recalculate and update the stars field
sellerSchema.methods.calculateStars = async function () {
  const seller = this;

  // Find all reviews for this seller
  const reviews = await Review.find({ seller: seller._id });

  // Calculate the total rating sum and count of reviews
  let totalRating = 0;
  let reviewCount = reviews.length;

  if (reviewCount > 0) {
    // Calculate the total rating sum
    totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    // Calculate the average rating (stars)
    const averageRating = totalRating / reviewCount;

    // Update the stars field of the seller
    seller.stars = averageRating;
  } else {
    // If there are no reviews, stars will remain 0
    seller.stars = 0;
  }

  // Save the updated product
  await seller.save();
};

sellerSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // expire in 10 mins
  return resetToken;
};

//Export the model
const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
