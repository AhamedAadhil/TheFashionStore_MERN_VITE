import mongoose from "mongoose";

export const validateMongoDbId = (id, next) => {
  return mongoose.Types.ObjectId.isValid(id);
};
