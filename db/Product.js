import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  userId: String,
  company: String,
});

export const product = mongoose.model("product", productSchema);
