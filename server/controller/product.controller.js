import Product from "../models/product.model.js";
import Buyer from "../models/buyer.model.js";
import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
import { errorUtil } from "../utils/error.utils.js";
import PendingApproval from "../models/pending.approval.model.js";
import dotenv from "dotenv";
dotenv.config();

/* CREATE A PRODUCT */
export const createProduct = async (req, res, next) => {
  const sellerId = req.user.id;
  const productCategory = req.body.category;
  const productBrand = req.body.brand;
  try {
    const category = await Category.findOne({ title: productCategory });
    if (!category) {
      return next(errorUtil(404, "This Category Is Not Found!"));
    }
    const brand = await Brand.findOne({ title: productBrand });
    if (!brand) {
      return next(errorUtil(404, "This Brand Is Not Found!"));
    }
    const actualPrice =
      Number(req.body.price / process.env.ACTUAL_PRICE_DIVIDER) *
        Number(process.env.ACTUAL_PRICE_MULTIPLYER) +
      Number(process.env.DELIVERY_FEE) +
      Number(req.body.price);

    const createProduct = await Product.create({
      ...req.body,
      seller: sellerId,
      status: "hold",
      brand: brand,
      category: category,
      price: actualPrice,
    });
    if (!createProduct) {
      return next(errorUtil(405, "Cannot Create Product"));
    }
    const pendingApproval = new PendingApproval({
      seller: sellerId,
      product: createProduct._id,
      purpose: "product",
    });
    await pendingApproval.save();
    res.status(201).json(" Product Under Review!");
  } catch (error) {
    next(error);
  }
};

/* GET A SINGLE PRODUCT BY ID */
export const getSingleProduct = async (req, res, next) => {
  try {
    const getProduct = await Product.findById(req.params.id);
    if (!getProduct) {
      return next(errorUtil(404, "Product Not Found!"));
    }
    if (!getProduct.status === "live") {
      return next(errorUtil(403, "This Product is Still Under  Review"));
    }
    if (getProduct.reviewhistory.length > 0) {
      await getProduct.populate("reviewhistory");
    }
    if (getProduct.orderhistory.length > 0) {
      await getProduct.populate("orderhistory");
    }
    await getProduct.populate("seller");
    await getProduct.populate("brand");
    await getProduct.populate("category");
    res.status(200).json(getProduct);
  } catch (error) {
    next(error);
  }
};

/* GET ALL PRODUCTS AND FILTER PRODUCTS */
export const getAllProducts = async (req, res, next) => {
  try {
    // Create a base query with the 'status' field set to 'live'
    let query = { status: "live" };

    // Define an array of allowed query parameters
    const allowedParams = [
      "brand",
      "name",
      "price",
      "quality",
      "size",
      "color",
      "category",
      "seller",
    ];

    // Iterate over allowed parameters and include them in the query if they exist in req.query
    allowedParams.forEach((param) => {
      if (req.query[param]) {
        // If the parameter is 'price', handle price range
        if (param === "price") {
          const priceParam = req.query[param];
          if (priceParam.gt) query.price = { $gt: parseFloat(priceParam.gt) };
          if (priceParam.gte)
            query.price = { ...query.price, $gte: parseFloat(priceParam.gte) };
          if (priceParam.lt)
            query.price = { ...query.price, $lt: parseFloat(priceParam.lt) };
          if (priceParam.lte)
            query.price = { ...query.price, $lte: parseFloat(priceParam.lte) };
        } else {
          // For other parameters, directly include them in the query
          query[param] = req.query[param];
        }
      }
    });

    // Define sort options based on the 'sort' query parameter
    let sortOptions = {};
    if (req.query.sort) {
      // Split the sort query parameter by comma to handle multiple fields
      const sortByFields = req.query.sort.split(",");
      sortByFields.forEach((field) => {
        // Check if the field starts with '-' indicating descending order
        if (field.startsWith("-")) {
          sortOptions[field.substring(1)] = -1; // Use -1 for descending order
        } else {
          sortOptions[field] = 1; // Use 1 for ascending order
        }
      });
    }

    // Define the limit based on the 'limit' query parameter (default to 100000 if not provided)
    const limit = parseInt(req.query.limit) || 24;
    const page = req.query.page || 1;
    const startIndex = (page - 1) * limit || 0;

    // Define the fields to select based on the 'fields' query parameter
    let selectFields = {};
    if (req.query.fields) {
      const selectedFields = req.query.fields.split(",");
      selectedFields.forEach((field) => {
        selectFields[field] = 1; // Include the field
      });
    }

    const allProducts = await Product.find(query)
      .select(selectFields)
      .populate("brand")
      .populate("seller")
      .populate("category")
      .sort(sortOptions)
      .limit(limit)
      .skip(startIndex);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (startIndex >= productCount) {
        return next(errorUtil("This Page Does Not Exist!"));
      }
    }
    res.status(200).json(allProducts);
  } catch (error) {
    next(error);
  }
};

/*  UPDATE A PRODUCT BY ID */
export const updateProduct = async (req, res, next) => {
  const productId = req.params.id;
  const selletId = req.user.id;
  const productCategory = req.body.category;
  const productBrand = req.body.brand;
  try {
    const product = await Product.findById(productId);
    if (!product.status === "live") {
      return next(errorUtil(403, "This Product is Still Under  Review"));
    }
    if (selletId !== product.seller.toString()) {
      return next(errorUtil(403, "You Can Only Update Your Products!"));
    }
    const category = await Category.findOne({ title: productCategory });
    if (!category) {
      return next(errorUtil(404, "This Category Is Not Found!"));
    }
    const brand = await Brand.findOne({ title: productBrand });
    if (!brand) {
      return next(errorUtil(404, "This Brand Is Not Found!"));
    }

    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          imageUrls: req.body.imageUrls,
          price: req.body.price,
          category: productCategory,
          brand: productBrand,
          size: req.body.size,
          color: req.body.color,
          stock: req.body.stock,
        },
      },
      { new: true }
    );
    if (!updateProduct)
      return next(errorUtil(405, "Cannot Update The Product Now!"));

    res.status(200).json(updateProduct);
  } catch (error) {
    next(error);
  }
};

/*  DELETE A PRODUCT BY ID */
export const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  const selletId = req.user.id;
  try {
    const product = await Product.findById(productId);
    if (!product.status === "live") {
      return next(errorUtil(403, "This Product is Still Under  Review"));
    }
    if (selletId !== product.seller.toString()) {
      return next(errorUtil(403, "You Can Only Delete Your Products!"));
    }
    const deleteProduct = await Product.findByIdAndDelete(productId);
    if (!deleteProduct)
      return next(errorUtil(405, "Cannot Update The Product Now!"));

    res.status(200).json("Product Deleted");
  } catch (error) {
    next(error);
  }
};

/* ADD PRODCT TO WISH LIST */
export const addToWishList = async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.body;
  if (!productId) {
    return next(errorUtil(404, "Please Provide Product Id"));
  }
  try {
    const buyer = await Buyer.findById(id.toString());
    const alreadyAdded = buyer.wishlist.find(
      (id) => id.toString() === productId
    );
    if (alreadyAdded) {
      let removeFromList = await Buyer.findByIdAndUpdate(
        id,
        { $pull: { wishlist: productId } },
        { new: true }
      );
      res.status(200).json(removeFromList);
    } else {
      let addInList = await Buyer.findByIdAndUpdate(
        id,
        { $push: { wishlist: productId } },
        { new: true }
      );
      res.status(200).json(addInList);
    }
  } catch (error) {
    next(error);
  }
};

/* UPLOAD IMAGES */
export const uploadImages = async (req, res, next) => {
  try {
    console.log(req.files);
  } catch (error) {
    next(error);
  }
};
