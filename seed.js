const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const products = require("./data/products.json");

dotenv.config();

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crmart");
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Products inserted successfully");
    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

seedProducts();
