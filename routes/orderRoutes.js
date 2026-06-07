const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");

const router = express.Router();

function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please login first" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

router.get("/", protect, async (req, res) => {
  const orders = await Order.find({ user: req.userId }).populate("product").sort({ createdAt: -1 });
  res.json(orders);
});

router.post("/", protect, async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ message: "Product id is required" });

  const order = await Order.create({
    user: req.userId,
    product: productId,
    quantity: quantity || 1
  });

  const savedOrder = await Order.findById(order._id).populate("product");
  res.status(201).json(savedOrder);
});

router.delete("/:id", protect, async (req, res) => {
  const order = await Order.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json({ message: "Order removed" });
});

module.exports = router;
