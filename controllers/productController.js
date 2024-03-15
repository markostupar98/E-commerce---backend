const HttpError = require("../models/httpError");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

let DUMMY_PRODUCTS = [
  {
    id: "p1",
    title: "VW Passat",
    description: "Best car in the world",
    address: "Sarganovac 17623",
    creator: "u1",
  },
];

const getProductById = (req, res, next) => {
  const productId = req.params.productId;
  const product = DUMMY_PRODUCTS.find((p) => p.id === productId);
  if (!product) {
    return next(new HttpError("Could not find a product for the id", 404));
  }
  console.log("Get req products");
  res.json({ product });
};

// Get user products
const getProductsByUserId = (req, res, next) => {
  const userId = req.params.userId;
  const products = DUMMY_PRODUCTS.filter((p) => p.creator === userId);
  if (!products || products.length === 0) {
    return next(new HttpError("Could not find a products for the userId", 404));
  }
  res.json({ products });
};

// Creating product

const createProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty) {
    throw new HttpError("Invalid inputs passed please check your data", 422);
  }
  const { title, description, address, creator } = req.body;
  const createdProduct = {
    id: uuidv4(), // Use uuidv4() function to generate a random UUID
    title,
    description,
    address,
    creator,
  };
  DUMMY_PRODUCTS.push(createdProduct);
  res.status(201).json({ product: createdProduct });
};

// Updating product details...

const updateProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty) {
    throw new HttpError("Invalid inputs passed please check your data", 422);
  }

  const { title, description } = req.body;
  const productId = req.params.productId;

  const updatedProduct = { ...DUMMY_PRODUCTS.find((p) => p.id === productId) };
  const productIndex = DUMMY_PRODUCTS.findIndex((p) => p.id === productId);
  updatedProduct.title = title;
  updatedProduct.description = description;
  DUMMY_PRODUCTS[productIndex] = updatedProduct;

  res.status(200).json({ product: updatedProduct });
};

const deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  if (!DUMMY_PRODUCTS.find((p) => p.id === productId)) {
    throw new HttpError("Could not find product for that id", 404);
  }
  DUMMY_PRODUCTS = DUMMY_PRODUCTS.filter((p) => p.id !== productId);
  res.status(200).json({ message: "Deleted product" });
};

exports.getProductById = getProductById;
exports.getProductsByUserId = getProductsByUserId;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
