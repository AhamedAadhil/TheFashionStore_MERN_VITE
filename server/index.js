import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbConnect.js";
import buyerRoutes from "./routes/buyer.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import { errorHandleMiddleware } from "./middlewares/errorHandle.middleware.js";
dotenv.config();

const app = express();

/* MIDDLEWARES */
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

/* ERROR HANDLE MIDDLEWARE */
app.use(errorHandleMiddleware);

/* APP START */
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
