const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const shopSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true
    },
    list: [
        {
            item: {
                type: String,
                minlength: 3
            },
            amount: Number
        }
    ],
    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

shopSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
shopSchema.plugin(uniqueValidator)
const Shop = mongoose.model('Shop', shopSchema)

module.exports = Shop
