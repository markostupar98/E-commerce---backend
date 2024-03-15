const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use("/api/products", productRoutes); // => /api/products

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error occurred" });
});

app.listen(5000);
