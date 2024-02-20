import mongoose from "mongoose";
import crypto from "crypto";

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    default: "Home",
  },
  housenumber: {
    default: "",
    type: String,
  },
  street: {
    default: "",
    type: String,
  },
  city: {
    default: "",
    type: String,
  },
  state: {
    default: "",
    type: String,
  },
});

const buyerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
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
      default: "buyer",
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
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      default: null,
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
    status: {
      type: String,
      default: "active",
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
    wishlist: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },
    theme: {
      type: String,
      default: "light",
    },
    address: [addressSchema],
    refreshtoken: {
      type: String,
    },
    passwordcChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

buyerSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // expire in 10 mins
  return resetToken;
};

//Export the model
const Buyer = mongoose.model("Buyer", buyerSchema);
export default Buyer;
