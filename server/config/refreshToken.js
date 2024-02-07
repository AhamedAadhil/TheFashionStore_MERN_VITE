import jwt from "jsonwebtoken";

export const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "3d" });
};
