const mongoose = require('mongoose')

const catalogueSchema = new mongoose.Schema({
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    categories: [{
        name: {
            type: String
        },
        items: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }]
    }]
})

const Catalogue = mongoose.model('Catalogue', catalogueSchema)

module.exports = Catalogue






