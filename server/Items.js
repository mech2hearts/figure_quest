const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ItemsSchema = new Schema({
    id:{
        type: String,
        required: true
    },
    currentLow:[{
        price: Number,
        store: String,
        url: String
    }],
    lowestEver:[{
        price: Number,
        store: String,
        url: String
    }],
    stores:[{
        name: String,
        price: Number,
        url: String
    }],
    time:{
        type: Date,
        default: Date.now,
        required: true
    }
  

});




module.exports = Items = mongoose.model('items', ItemsSchema)
