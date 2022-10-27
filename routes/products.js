const express = require("express");
const router = express.Router();
const db = require("../db_config");
const authController = require("../controller/auth");

router.get("/", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    db.query("SELECT * FROM products", (err, results) => {
      if (results.length > 0) {
        res.render("products", {
          data: results,
        });
      } else {
        console.log("no products");
      }
    });
  } else {
    res.redirect("login");
  }
});

router.post("/add", (req, res) => {
  const { name: name, description: description } = req.body;
  console.log(name);
  if (!name || !description) {
    console.log("Failed to add new product");
    res.redirect("/products");
  } else {
    db.query(
      "INSERT INTO products SET ?",
      { name, description },
      (err, result) => {
        if (err) throw err;
        res.redirect("/products");
      }
    );
  }
});

router.post("/delete/:id", (req, res) => {
  let sql = `DELETE from products where id = ${parseInt(req.params.id)}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/products");
  });
});

// router.post("/update/:id", (req, res) => {
//   let sql = `Select * from product where id = ${parseInt(req.params.id}`;
//   db.query("UPDATE users SET", (err, result) => {
//     if (err) throw err;
//     res.render("user_edit", {
//       title: "CRUD Operation using NodeJS / ExpressJS / MySQL",
//       user: result[0],
//     });
//   });
// });

module.exports = router;
