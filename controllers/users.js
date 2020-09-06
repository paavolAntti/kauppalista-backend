const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

router.get('/', async (req, res) => {
    const users = await User
        .find({})
    res.json(users.map(u => u.toJSON()))
})

router.post('/', async(req, res) => {
    const { username, name, password } = req.body
    // Jos bodyssa annetaan kelvoton salasana
    if (!password || password.length < 5) {
        return res.status(400).send({
            error: 'password min length 5'
        })
    }
    // salataan salasana bcryptin avulla
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    // Luodaan uusi käyttäjä bodyssa annetuilla arvoilla
    const user = new User({
        username,
        name,
        passwordHash
    })
    // Tallennetaan luotu käyttäjä tietokantaan
    const savedUser = await user.save()
    res.json(savedUser)

})

module.exports = router