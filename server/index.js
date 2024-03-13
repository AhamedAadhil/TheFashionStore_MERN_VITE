import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbConnect.js";
import buyerRoutes from "./routes/buyer.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import { errorHandleMiddleware } from "./middlewares/errorHandle.middleware.js";
import path from "path";
dotenv.config();

const __dirname = path.resolve();

const app = express();

/* MIDDLEWARES */
app.use(
  cors({
    origin: "https:api.galleryglam.lk",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

/* DB CONNECT */
dbConnect();

/* BASE ROUTES */
app.use("/api/buyer", buyerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/coupon", couponRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

/* ERROR HANDLE MIDDLEWARE */
app.use(errorHandleMiddleware);

/* APP START */
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
