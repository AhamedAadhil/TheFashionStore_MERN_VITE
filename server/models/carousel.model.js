import mongoose from "mongoose";
// Declare the Schema of the Mongo model
var carouselSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

//Export the model
const Carousel = mongoose.model("Carousel", carouselSchema);
export default Carousel;
