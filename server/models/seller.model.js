import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    default: "Shop",
  },
  housenumber: {
    default: "",
    type: String,
    required: true,
  },
  road: {
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
  postalcode: {
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
      maxlength: 20,
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
  },
  { timestamps: true }
);

//Export the model
const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
