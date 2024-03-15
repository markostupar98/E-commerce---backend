const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const HttpError = require("./models/httpError");
const app = express();

app.use(bodyParser.json());

app.use("/api/products", productRoutes); // => /api/products
app.use("/api/users", userRoutes); // => /api/users


app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error occurred" });
});

app.listen(5000);
