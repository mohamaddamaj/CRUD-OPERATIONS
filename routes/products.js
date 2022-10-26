const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("products");
});

router.put("/:id", (req, res) => {
  console.log(`Update product With id ${req.params.id}`);
  res.send(`Update product With id ${req.params.id}`);
});
// .delete((req, res) => {
//   console.log(`Delete product With id ${req.params.id}`);
//   res.send(`Delete product With id ${req.params.id}`);
// });

module.exports = router;
