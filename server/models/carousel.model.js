import mongoose from "mongoose";
// Declare the Schema of the Mongo model
var carouselSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
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
