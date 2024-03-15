const express = require("express");
const router = express.Router();
const HttpError = require("../models/httpError");

const DUMMY_PRODUCTS = [
  {
    id: "p1",
    title: "VW Passat",
    description: "Best car in the world",
    address: "Sarganovac 17623",
    creator: "u1",
  },
];

router.get("/:productId", (req, res, next) => {
  const productId = req.params.productId;
  const product = DUMMY_PRODUCTS.find((p) => p.id === productId);
  if (!product) {
    return next(new HttpError("Could not find a product for the id", 404));
  }
  console.log("Get req products");
  res.json({ product });
});

router.get("/user/:userId", (req, res, next) => {
  const userId = req.params.userId;
  const product = DUMMY_PRODUCTS.find((p) => p.creator === userId);
  if (!userId) {
    return next(new HttpError("Could not find a product for the userId", 404));
  }
  res.json({ product });
});

module.exports = router;
