const router = require('express').Router()
const User = require('../models/user')

router.get('/', async (req, res) => {
    const users = await User
        .find({})
    res.json(users.map(u => u.toJSON()))
})

router.post('/', async(req, res) => {
    const { username, name } = req.body
    // Luodaan uusi käyttäjä bodyssa annetuilla arvoilla
    const user = new User({
        username,
        name
    })
    // Tallennetaan luotu käyttäjä tietokantaan
    const savedUser = await user.save()

    res.json(savedUser)

})

module.exports = router