//Headline Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Creating headingSchema with schema class
var headlineSchema = new Schema({
    headlline: {
        type: String,
        required: true,
        unique: { index: { unique: true } }
    },
    summary: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    saved: {
        type: Boolean,
        default: false
    }
});

//Create the headline model using the headlineSchema

var Headline = moongoose.model('Headline', headlineSchema)

module.exports = Headline;