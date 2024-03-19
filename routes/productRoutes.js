const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const fileUpload = require("../middleware/fileUpload");

const productControllers = require("../controllers/productController");

router.get("/user/:userId", productControllers.getProductsByUserId);
router.get("/:productId", productControllers.getProductById);


router.post(
  "/",
  fileUpload.single('image'),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  productControllers.createProduct
);

router.patch(
  "/:productId",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  productControllers.updateProduct
);

router.delete("/:productId", productControllers.deleteProduct);

module.exports = router;
