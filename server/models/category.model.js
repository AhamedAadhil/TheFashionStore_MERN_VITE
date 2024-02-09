import mongoose from "mongoose";

var categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
