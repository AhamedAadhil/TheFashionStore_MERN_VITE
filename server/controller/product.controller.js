import Product from "../models/product.model.js";
import Buyer from "../models/buyer.model.js";
import Seller from "../models/seller.model.js";
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

    const seller = await Seller.findById(sellerId);
    seller.products.push(createProduct._id);
    await seller.save();

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

    // Check if the 'name' parameter exists in the request query
    if (req.query.name) {
      // Create a regular expression to perform a case-insensitive search
      const regex = new RegExp(req.query.name, "i");
      // Update the query to filter products by name
      query.name = regex;
    }

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
      "createdAt",
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
        }

        if (param === "createdAt") {
          // If 'createdAt' parameter exists, calculate the date 4 days ago
          const fourDaysAgo = new Date();
          fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
          query[param] = { $gte: fourDaysAgo }; // Add condition for 'createdAt' field
        } else {
          // For other parameters, directly include them in the query
          query[param] = req.query[param];
        }
      }
    });

    // Define sort options based on the 'sort' query parameter
    let sortOptions = {};

    if (req.query.sort) {
      // Check if the 'shuffle' query parameter is present
      if (req.query.sort === "shuffle") {
        // Additional sorting patterns to provide diverse shuffling
        const additionalSortOptions = [
          { createdAt: -1 },
          { createdAt: 1 },
          { name: -1 },
          { name: 1 },
          { brand: -1 },
          { brand: 1 },
          { updatedAt: -1 },
          { updatedAt: 1 },
          { price: -1 },
          { price: 1 },
        ];

        // Randomly select additional sorting options
        const randomIndex = Math.floor(
          Math.random() * additionalSortOptions.length
        );
        sortOptions = additionalSortOptions[randomIndex];
      } else {
        // Split the sort query parameter by comma to handle multiple fields
        const sortByFields = req.query.sort.split(",");
        sortByFields.forEach((field) => {
          // Check if the field starts with '-' indicating descending order
          if (field.startsWith("-")) {
            // Use -1 for descending order
            sortOptions[field.substring(1)] = -1;
          } else {
            // Use 1 for ascending order
            sortOptions[field] = 1;
          }
        });
      }
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

    const totalCount = await Product.countDocuments(query);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (startIndex >= productCount) {
        return next(errorUtil("This Page Does Not Exist!"));
      }
    }
    res.status(200).json({
      products: allProducts,
      totalCount: totalCount,
    });
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
          category: category._id,
          brand: brand._id,
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
    // if (!product.status === "live") {
    //   return next(errorUtil(403, "This Product is Still Under  Review"));
    // }
    if (selletId !== product.seller.toString()) {
      return next(errorUtil(403, "You Can Only Delete Your Products!"));
    }
    const deleteProduct = await Product.findByIdAndDelete(productId);
    if (!deleteProduct)
      return next(errorUtil(405, "Cannot Delete The Product Now!"));

    const seller = await Seller.findById(selletId);

    seller.products.pull(deleteProduct._id);
    await seller.save();

    res.status(200).json(seller.products);
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
    const product = await Product.findById(productId);
    const buyer = await Buyer.findById(id.toString());
    const alreadyAdded = buyer.wishlist.find(
      (id) => id.toString() === productId
    );
    if (alreadyAdded) {
      await Buyer.findByIdAndUpdate(
        id,
        { $pull: { wishlist: productId } },
        { new: true }
      );
      product.likes -= 1;
      await product.save();
      res.status(200).json("Removed From Wishlist!");
    } else {
      await Buyer.findByIdAndUpdate(
        id,
        { $push: { wishlist: productId } },
        { new: true }
      );

      product.likes += 1;
      await product.save();
      res.status(200).json("Added To Wishlist!");
    }
  } catch (error) {
    next(error);
  }
};
