const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db_config");
const { promisify } = require("util");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      console.log("Empty password or email");
    }
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        console.log(results);
        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.status(401).redirect("/login");
        } else {
          res.status(200).redirect("/products");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

exports.register = (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  db.query(
    "SELECT email from users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results.length > 0) {
          console.log("The email is already in registered");
          return;
        }
      }
      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);
      db.query(
        "INSERT INTO users SET ?",
        { name: name, email: email, password: hashedPassword },
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            console.log("User is successfully registered");
            res.status(200).redirect("/login");
          }
        }
      );
    }
  );
};
