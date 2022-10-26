const db = require("../db_config");

exports.getAllProducts = async (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    console.log(results);
    if (results.length > 0) {
      console.log(results);
      res.render("products", { ...results });
    } else {
      console.log("No products");
    }
  });
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;
  let sql = `DELETE from products where id = ${productId}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
};

exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  let sql = `Select * from product where id = ${productId}`;
  db.query("UPDATE users SET", (err, result) => {
    if (err) throw err;
    res.render("user_edit", {
      title: "CRUD Operation using NodeJS / ExpressJS / MySQL",
      user: result[0],
    });
  });
};
