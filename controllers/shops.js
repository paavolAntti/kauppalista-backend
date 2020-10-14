const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Shop = require('../models/shop')

//Apumetodi tokenin ottamiselle pyynnöstä
const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        return authorization.substring(7)
    }
    return null
}
router.get('/:id', async (req, res) => {
    const shop = await Shop.findById(req.params.id)
    res.json(shop.toJSON())
})
router.get('/', async (req, res) => {
    const shops = await Shop
        .find({})
    res.json(shops.map(s => s.toJSON()))
})
// Uuden kaupan luominen 
router.post('/', async (req, res) => {
    
    const shop = new Shop(req.body)
    const token = getTokenFrom(req)
    console.log('token: ', token)
    //Luominen onnistuu vain jos käyttäjä on kirjautunut
    const verifiedToken = jwt.verify(token, process.env.SECRET)
    console.log('verified token: ', verifiedToken)
    //Jos token puuttuu tai on virheellinen, palautatetaan status 401 ja virheilmoitus
    if(!token || !verifiedToken.id) {
        return res.status(401).json({ error: 'invalid or missing token'})
    }
    //Etsitään tokenin id:tä vastaava käyttäjä 
    const user = await User.findById(verifiedToken.id)
    if (!shop.name) {
        return res.status(400).send({error: 'shop must have a name'})
    }
    //Asetetaan lisättävän kaupan käyttäjäksi tokenia vastaava käyttäjä-id
    shop.user = user
    const savedShop = await shop.save()
    //Lisätään lista käytttäjän kauppoihin ja tallennetaan käyttäjä
    user.shops = user.shops.concat(savedShop._id)
    await user.save()

    res.json(savedShop.toJSON())
})
// uuden tavaran lisäys
router.post('/:id/list', async (req, res) => {
    const shop = await Shop.findById(req.params.id)
    const item = req.body.item
    let amount = req.body.amount

    if (!item) {
        return res.status(401).json( {error: 'item must have name'})
    }
    if (!amount || amount == 0) {
        amount = 1
    } 
    const newItem = {
        item: item,
        amount: amount
    }
    let existingItem = null

    shop.list.forEach(element => {
        if (item == element.item) {
            existingItem = element
        }
    })
    
    if (existingItem) {
        existingItem.amount += amount
    }
    else {
        shop.list = shop.list.concat(newItem)
    }

    const savedShop = await shop.save()

    res.json(savedShop.toJSON())
})
// tavaran poisto listalta
router.put('/:id/list', async (req, res) => {
    const shop = await Shop.findById(req.params.id)
    const item = req.body.item
    console.log('this is item: ', item)
    if(!item) {
        return res.status(401).json( {error: 'no specified item to remove'})
    }
    const itemToReduce = shop.list.find(i => i.item === item)
    console.log(itemToReduce)
    if (itemToReduce.amount > 1) {
        itemToReduce.amount -= 1
    } else {
        const filteredList = shop.list.filter(i => i.item !== item)
        shop.list = filteredList
    }
    
    const savedShop = await shop.save()

    res.json(savedShop.toJSON())
    
})

module.exports = router