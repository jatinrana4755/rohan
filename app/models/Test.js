var mongoose = require('mongoose');
var  Schema = mongoose.Schema;

/**
 * User Schema
 */
var TestSchema = new Schema({

    title: {
        type: String,
        trim: true,
    },
    allowed_time: {
        type: String,
        default: 60
    }
});


mongoose.model('Test', TestSchema);