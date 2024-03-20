const HttpError = require("../models/httpError");
const mongoose = require("mongoose");
const fs = require("fs");
const { validationResult } = require("express-validator");
const Product = require("../models/product");
const User = require("../models/users");

// Get product by id
const getProductById = async (req, res, next) => {
  const productId = req.params.productId;
  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError("Could not find a product for the id", 404);
    return next(error);
  }
  if (!product) {
    const error = new HttpError("Could not find a product for the id", 404);
    return next(error);
  }
  console.log("Get req products");
  res.json({ product: product.toObject({ getters: true }) });
};

// Get user products
const getProductsByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  // let products;
  let userWithProduct;
  try {
    userWithProduct = await User.findById(userId).populate("products");
  } catch (err) {
    const error = new HttpError("Fetching products failed", 500);
    return next(error);
  }
  if (!userWithProduct || userWithProduct.length === 0) {
    return next(new HttpError("Could not find a products for the userId", 404));
  }
  res.json({
    products: userWithProduct.products.map((product) =>
      product.toObject({ getters: true })
    ),
  });
};

// Creating product

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed please check your data", 422);
  }
  const { title, description, address, creator } = req.body;
  const createdProduct = new Product({
    title,
    description,
    image: req.file.path,
    creator,
    address,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating products failed", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("We could not find user for provided id", 404);
    return next(error);
  }
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdProduct.save({ session });
    user.products.push(createdProduct);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating product failes, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ product: createdProduct });
};

// Updating product details...

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed please check your data", 422)
    );
  }

  const { title, description } = req.body;
  const productId = req.params.productId;
  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, ould not update product",
      500
    );
    return next(error);
  }
  if (product.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "Something went wrong, Could not edit product",
      401
    );
    return next(error);
  }
  product.title = title;
  product.description = description;

  try {
    await product.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not update product",
      500
    );
    return next(error);
  }

  res.status(200).json({ product: product.toObject({ getters: true }) });
};

// Deleting product

const deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  let product;
  try {
    product = await Product.findById(productId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not delete product",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError("Could not find product for this id", 404);
    return next(error);
  }
  if (product.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "Something went wrong, Could not delete product",
      401
    );
    return next(error);
  }
  const imagePath = product.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await product.deleteOne({ session });
    product.creator.products.pull(product);
    await product.creator.save({ session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, ould not update product",
      500
    );
    return next(error);
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json({});
};

exports.getProductById = getProductById;
exports.getProductsByUserId = getProductsByUserId;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
