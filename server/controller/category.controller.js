import Category from "../models/category.model.js";
import { errorUtil } from "../utils/error.utils.js";
import { validateMongoDbId } from "../utils/validateMongoDbId.utils.js";

/* CREATE NEW CATEGORY */
export const createCategory = async (req, res, next) => {
  try {
    const category = new Category({
      title: req.body.title,
    });
    await category.save();
    res.status(201).json("New Category Created");
  } catch (error) {
    next(error);
  }
};

/* UPDATE CATEGORY BY ID */
export const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  if (!id) {
    return next(errorUtil(404, "Category Id is Invalid!"));
  }
  try {
    const updateCategory = await Category.findByIdAndUpdate(
      id,
      {
        $set: {
          title: req.body.title,
        },
      },
      { new: true }
    );
    if (!updateCategory) {
      return next(errorUtil(404, "Unable To Update This Category!"));
    }
    res.status(201).json("Category Updated!");
  } catch (error) {
    next(error);
  }
};

/* DELETE CATEGORY BY ID */
export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    if (!deleteCategory) {
      return next(errorUtil(404, "Unable To Delete This Category!"));
    }
    res.status(201).json("Category Deleted!");
  } catch (error) {
    next(error);
  }
};

/* CREATE SINGLE CATEGORY BY ID */
export const getSingleCategory = async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const category = await Category.findById(id);
    if (!category) {
      return next(errorUtil(404, "Unable to Find This Category!"));
    }
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

/* GET ALL CATEGORIES */
export const getAllCategory = async (req, res, next) => {
  try {
    const allCategory = await Category.find();
    if (!allCategory) {
      return next(errorUtil(400, "Unable To Fetch All Categories"));
    }
    res.status(200).json(allCategory);
  } catch (error) {
    next(error);
  }
};
