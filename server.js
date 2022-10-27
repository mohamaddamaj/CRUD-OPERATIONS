const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const db = require("./db_config");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

const userRouter = require("./routes/pages");
const authRouter = require("./routes/auth");
const productsRouter = require("./routes/products");

app.use("/", userRouter);
app.use("/auth", authRouter);
app.use("/products", productsRouter);

app.listen(PORT);
