const router = require('express').Router()
const Item = require('../models/item')

router.get('/', async(req, res) => {
    const items = await Item
        .find({})
    res.json(items.map(i => i.toJSON()))
})
router.get('/:id', async(req, res) => {
    const item = await Item.findById(req.params.id)
    res.json(item.toJSON())
})

module.exports = router