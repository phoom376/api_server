require("dotenv").config();
require("./config/database").connect();

const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!(first_name && last_name && email && password)) {
      res.status(400).send({ message: "All input requried" });
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      res.status(409).send({ message: "User already exist. Please login" });
    }

    const encryptPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!(email && password)) {
      res.send({ message: "Plese Input email or password" });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          user_id: user._id,
          username: user.first_name + " " + user.last_name,
          email,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      res.send(user);
      res.status(200).json(user);
    }

    res.send({ message: "Wrong Username Or Password" });
    res.status(400).send("Wrong Username Or Password");
  } catch (err) {
    console.log(err);
  }
});

app.post("/auth", auth, (req, res) => {
  res.status(200).send({ meesage: "Success", isAuth: true });
});

module.exports = app;
