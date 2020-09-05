const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true
    },
    type: {
        type: String
    },
    amount:{
        type: Number
    }
})

itemSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

itemSchema.plugin(uniqueValidator)
const Item = mongoose.model('Item', itemSchema)

module.exports = Item