require('dotenv').config()

let PORT = process.env.PORT
let MONGODB = process.env.MONGODB

if (process.env.NODE_ENV === 'test') {
    MONGODB = process.env.MONGODB_TEST
}

module.exports = { PORT, MONGODB }