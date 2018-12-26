//Note Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Create the noteSchma with the schema object
var noteSchema = new Schema({
    _headlineId: {
        type: Schema.Types.ObjectId,
        ref: 'Headline'
    },
    date: {
        type: Date,
        default: Date.now
    },
    noteText: String
});