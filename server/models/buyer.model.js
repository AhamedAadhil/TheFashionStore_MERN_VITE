import mongoose from "mongoose";

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

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1, // Default quantity
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
      type: [cartSchema],
      default: [],
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
  },
  { timestamps: true }
);

//Export the model
const Buyer = mongoose.model("Buyer", buyerSchema);
export default Buyer;
