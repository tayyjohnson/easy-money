const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// This function finds all products
router.get("/", (req, res) => {
  // Finds the product AND the associated Category/Tag data
  Product.findAll({
    include: [{ model: Category }, { model: Tag }],
  })
    .then((Data) => res.json(Data))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// This function finds ONE product
router.get("/:id", (req, res) => {
  // Finds a singular product by its associated ID and includes its associated Category/Tag data
  Product.findOne({
    where: {
      id: req.params.id,
    },
    include: [{ model: Category }, { model: Tag }],
  })
    .then((Data) => {
      if (!Data) {
        res.status(404).json({ message: "No product with this id!" });
        return;
      }
      res.json(Data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// This function creates a new product
router.post("/", (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// This function updates the product data
router.put("/:id", (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // This function deletes a singular product by its ID
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((Data) => {
      if (!Data) {
        res.status(404).json({ message: "No Product with this id" });
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