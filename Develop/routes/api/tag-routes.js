const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async(req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      attributes:['id', 'tag_name'],
      include: [
        {
          model: Product,
          attributes:['id','product_name', 'price', 'stock', 'category_id'],
          through:'ProductTag'
        }
    ]
  });
  if (!tagData) {
    res.status(404).json({ message: 'No product tags found !' });
  }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes:['id','product_name', 'price', 'stock', 'category_id'],
          through:'ProductTag'
        }
      ]
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tags found with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create ({
    tag_name: req.body.tag_name
  })
  .then(tagData=>res.json(tagData))
  .catch(err=>{
    console.log(err);
    res.status(500).json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
   Tag.update(
      {
      tag_name: req.body.tag_name,
      },
      {
      where: {
        id: req.params.id,
      },
      })
      .then(tagUpdate=> {
      if (!tagUpdate[0]) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
      }
      res.json(tagUpdate);
      })
      .catch (err => {
        console.log(err);
        res.status(500).json(err);
      });
      });

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  try{
    const tagDeleteId = await Tag.destroy( {
      where: {
        id: req.params.id
      }
    });
    if (!tagDeleteId) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }
    res.status(200).json(tagDeleteId);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
