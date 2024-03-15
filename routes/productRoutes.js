const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const productControllers = require("../controllers/productController");

router.get("/:productId", productControllers.getProductById);

router.get("/user/:userId", productControllers.getProductsByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  productControllers.createProduct
);

router.patch("/:productId", [
    check('title').not().isEmpty(),
    check('description').isLength({min:5})

] ,productControllers.updateProduct);

router.delete("/:productId", productControllers.deleteProduct);

module.exports = router;
