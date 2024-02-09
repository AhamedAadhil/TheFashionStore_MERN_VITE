import Brand from "../models/brand.model.js";
import { errorUtil } from "../utils/error.utils.js";
import { validateMongoDbId } from "../utils/validateMongoDbId.utils.js";

/* CREATE NEW BRAND */
export const createBrand = async (req, res, next) => {
  try {
    const brand = new Brand({
      title: req.body.title,
      logo: req.body.logo,
    });
    await brand.save();
    res.status(201).json("New Brand Created");
  } catch (error) {
    next(error);
  }
};

/* UPDATE BRAND BY ID */
export const updateBrand = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  if (!id) {
    return next(errorUtil(404, "Brand Id is Invalid!"));
  }
  try {
    const updateBrand = await Brand.findByIdAndUpdate(
      id,
      {
        $set: {
          title: req.body.title,
          logo: req.body.logo,
        },
      },
      { new: true }
    );
    if (!updateBrand) {
      return next(errorUtil(404, "Unable To Update This Brand!"));
    }
    res.status(201).json("Brand Updated!");
  } catch (error) {
    next(error);
  }
};

/* DELETE BRAND BY ID */
export const deleteBrand = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteBrand = await Brand.findByIdAndDelete(id);
    if (!deleteBrand) {
      return next(errorUtil(404, "Unable To Delete This Brand!"));
    }
    res.status(201).json("Brand Deleted!");
  } catch (error) {
    next(error);
  }
};

/* CREATE SINGLE BRAND BY ID */
export const getSingleBrand = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return next(errorUtil(404, "Unable to Find This Brand!"));
    }
    res.status(201).json(brand);
  } catch (error) {
    next(error);
  }
};

/* GET ALL BRANDS */
export const getAllBrand = async (req, res, next) => {
  try {
    const allBrand = await Brand.find();
    if (!allBrand) {
      return next(errorUtil(400, "Unable To Fetch All Brands!"));
    }
    res.status(200).json(allBrand);
  } catch (error) {
    next(error);
  }
};
