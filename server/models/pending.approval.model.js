// import mongoose from "mongoose";

// const addressSchema = new mongoose.Schema({
//   label: {
//     type: String,
//     default: "Shop",
//   },
//   housenumber: {
//     default: "",
//     type: String,
//     required: true,
//   },
//   road: {
//     default: "",
//     type: String,
//     required: true,
//   },
//   city: {
//     default: "",
//     type: String,
//     required: true,
//   },
//   state: {
//     default: "",
//     type: String,
//     required: true,
//   },
//   postalcode: {
//     default: "",
//     type: String,
//     required: true,
//   },
// });

// const pendingApprovalSchema = new mongoose.Schema(
//   {
//     sellername: {
//       type: String,
//       required: true,
//       minlength: 3,
//       maxlength: 20,
//     },
//     shopname: {
//       type: String,
//       required: true,
//       unique: true,
//       minlength: 3,
//       maxlength: 20,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     mobile: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       default: "pending", // Initial status is pending
//     },
//     registrationDate: {
//       type: Date,
//       default: Date.now,
//     },
//     address: {
//       type: addressSchema,
//     },
//   },
//   { timestamps: true }
// );

// const PendingApproval = mongoose.model(
//   "PendingApproval",
//   pendingApprovalSchema
// );

// export default PendingApproval;

import mongoose from "mongoose";

const pendingApprovalSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    // Add any other fields you need for pending approvals
  },
  { timestamps: true }
);

// Export the model
const PendingApproval = mongoose.model(
  "PendingApproval",
  pendingApprovalSchema
);
export default PendingApproval;
