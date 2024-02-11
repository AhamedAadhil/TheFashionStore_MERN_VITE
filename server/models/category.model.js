import mongoose from "mongoose";

var categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: "other",
    },
    logo: {
      type: String,
      required: true,
      index: true,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBdH4C8W5F9FnEymmC6Kn-n9Sn5pJgSSsBhA&usqp=CAU",
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
