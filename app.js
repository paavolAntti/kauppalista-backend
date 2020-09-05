const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

mongoose.set('useCreateIndex', true)

mongoose.connect(config.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting', error.message)
    })
mongoose.set('useFindAndModify', false)

app.use(cors)
app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>KAUPPALISTA BACK-END<h1>')
})


module.exports = app