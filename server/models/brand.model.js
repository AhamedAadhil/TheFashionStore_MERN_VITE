import mongoose from "mongoose";

var brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "unknown",
      required: true,
      unique: true,
      index: true,
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

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
