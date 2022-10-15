const router = require("express").Router();
const { Category, Product } = require("../../models");

router.get("/", (req, res) => {
  // This function finds all categories & products
  Category.findAll({
    include: [
      {
        model: Product,
      },
    ],
  })
    .then((Data) => res.json(Data))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  
  Category.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Product,
      },
    ],
  })
    .then((Data) => {
      if (!Data) {
        res.status(404).json({ message: "No category with this id!" });
        return;
      }
      res.json(Data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  // This function creates a new category
  Category.create({
    category_name: req.body.category_name
  })
  .then((Data) => res.json(Data))
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.put("/:id", (req, res) => {
  // This function updates a category by its ID
  Category.update(
    { category_name: req.body.category_name },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((Data) => {
      if (!Data) {
        res.status(404).json({ message: "No category found with this id!" });
        return;
      }
      res.json(Data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // This function deletes a category by its ID
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((Data) => {
      if (!Data) {
        res.status(404).json({ message: "No category with this id" });
        return;
      }
      res.json(Data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;