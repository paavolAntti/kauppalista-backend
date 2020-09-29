const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
    const body = req.body
    // etsitään oikea käyttäjä bodyssa annetun käyttäjänimen perusteella
    const user = await User.findOne({username: body.username}).populate('shops')
    // passwordCorrect saa arvon user tai null jos käyttäjää ei ole olemassa tai salasana on väärä
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    res
        .status(200)
        .send({ token, username: user.username, name: user.name, id: user._id})
})

module.exports = loginRouter