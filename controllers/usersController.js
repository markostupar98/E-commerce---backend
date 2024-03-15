const uuid = require("uuid");
const HttpError = require("../models/httpError");
const {validationResult} = require('express-validator')

const DUMMY_USERS = [
  {
    id: "u1",
    name: "marko",
    email: "test@gmail.com",
    password: "test123",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

// Sign up function
const signup = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty) {
      throw new HttpError("Invalid inputs passed please check your data", 422);
    }
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("User already exist", 422);
  }
  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

// Log in function

const login = (req, res, next) => {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find((u) => u.email === email);
  if (!user || user.password !== password) {
    throw new HttpError("Could not find user", 401);
  }
  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
