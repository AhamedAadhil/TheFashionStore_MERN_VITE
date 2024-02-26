import mongoose from "mongoose";

var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
        size: String,
      },
    ],
    paymentintent: {},
    orderstatus: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "confirmed",
        "packing",
        "dispatched",
        "delivered",
        "cancelled",
      ],
    },
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
    lastupdate: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
