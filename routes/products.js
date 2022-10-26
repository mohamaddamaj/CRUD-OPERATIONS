const express = require("express");
const router = express.Router();
const productsController = require("../controller/products");

router.get("/", productsController.getAllProducts);

router
  .route("/:id")
  .post((req, res) => {
    console.log(`Add product With id ${req.params.id}`);
    res.send(`Add product With id ${req.params.id}`);
  })
  .put((req, res) => {
    console.log(`Update product With id ${req.params.id}`);
    res.send(`Update product With id ${req.params.id}`);
  })
  .delete(productsController.deleteProduct);

router.param("id", (req, res, next, id) => {
  console.log(id);
});

module.exports = router;
