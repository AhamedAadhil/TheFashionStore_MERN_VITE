import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => console.log("Database Connected"));
  } catch (err) {
    console.log(err.message);
  }
};

export default dbConnect;
