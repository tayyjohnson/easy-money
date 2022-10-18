const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', (req, res) => {
  Tag.findAll({
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

router.get('/:id', (req, res) => {
 // This function finds a singular tag by its ID
  Tag.findOne({
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
        res.status(404).json({ message: "No tag with this id!" });
        return;
      }
      res.json(Data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // This function creates a new tag
  Tag.create({
    tag_name: req.body.tag_name
  })
  .then((Data) => res.json(Data))
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.put('/:id', (req, res) => {
  // This function updates a tag by the ID
  Tag.update(
    { tag_name: req.body.tag_name },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((Data) => {
      if (!Data) {
        res.status(404).json({ message: "No tag found with this id!" });
        return;
      }
      res.json(Data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // This function deletes a tag by the ID
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((Data) => {
      if (!Data) {
        res.status(404).json({ message: "No tag with this id" });
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