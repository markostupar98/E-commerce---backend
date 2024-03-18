const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const HttpError = require("./models/httpError");
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH , DELETE");
  next();
});

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

mongoose
  .connect(
    "mongodb+srv://marko:weltmeister53@cluster0.7ua17f0.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
