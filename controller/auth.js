const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db_config");
const { promisify } = require("util");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

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
          const id = results[0].id;
          const name = results[0].name;

          const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          const cookieOptions = {
            expiresIn: "24h",
            // httpOnly: true,
          };
          console.log(cookieOptions, token);
          res.cookie("usersLogin", token, cookieOptions);
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

//midlleware to check if the user has cookie or not
exports.isLoggedIn = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.usersLogin) {
    try {
      // 1. Verify the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.usersLogin,
        process.env.JWT_SECRET
      );
      console.log(decoded);

      // 2. Check if the user still exist
      db.query(
        "SELECT * FROM users WHERE id = ?",
        [decoded.id],
        (err, results) => {
          console.log(results);
          if (!results) {
            return next();
          }
          req.user = results[0];
          return next();
        }
      );
    } catch (err) {
      console.log(err);
      return next();
    }
  } else {
    next();
  }
};

// to make a logout button we remove the cookie
exports.logout = (req, res) => {
  res.cookie("usersLogin", "logout", {
    expiresIn: new Date(Date.now() + 2 * 1000),
    // httpOnly: true,
  });
  res.status(200).redirect("/login");
};
