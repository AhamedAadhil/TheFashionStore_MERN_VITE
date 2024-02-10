import mongoose from "mongoose";

var cartSchema = new mongoose.Schema(
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
        price: Number,
      },
    ],
    carttotal: Number,
    totalafterdiscount: Number,
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
