require("dotenv").config();
require("./config/database").connect();

const User = require("./model/user");
const Products = require("./model/products");
const Company = require("./model/company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors());

app.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password, c_id } = req.body;
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
      c_id,
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
          c_id: user.c_id,
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

app.post("/createCompany", async (req, res) => {
  const { c_name, c_description, c_address } = req.body;

  try {
    if (!(c_name && c_description && c_address)) {
      res.send({ message: "ALL INPUT IS REQUIRED" });
    } else {
      const oldCom = await Company.findOne({ c_name });

      if (oldCom) {
        res.send({ message: "Company already exist. Please login" });
      }
      const company = await Company.create({
        c_name,
        c_description,
        c_address,
      });

      res.status(200).json(company);
    }
  } catch (err) {
    consol.log(err);
  }
});

app.get("/company", async (req, res) => {
  const company = await Company.find();

  res.send(company);
});

app.post("updateCompanyBoard", async (req, res) => {
  const { c_id, b_id } = req.body;

  if (b_id) {
    await Company.updateOne(
      { _id: c_id },
      { $push: { c_board: { b_id: b_id } } },
      {
        upsert: true,
        new: true,
      }
    );

    res.send({message:"updated"})

  }
});

app.post("/addproduct", async (req, res) => {
  const { p_name, p_price, p_qty, p_image } = req.body;
  if (p_name && p_price && p_qty && p_image) {
    const products = await Products.create({
      p_name,
      p_price,
      p_qty,
      p_image,
    });
    res.status(200).json(products);
  } else {
    res.send({ message: "All input requried" });
  }
});

app.get("/getproduct", async (req, res) => {
  const product = await Products.find();
  res.send(product);
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const products = await Products.findByIdAndDelete({ _id: id });

  res.status(200).send({ message: "deleted" });
});

module.exports = app;
