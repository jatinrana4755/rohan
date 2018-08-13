var mongoose = require('mongoose');
var  Schema = mongoose.Schema;

/**
 * User Schema
 */
var TestSchema = new Schema({

    testNo: {
        type: String,
        trim: true,
    },
    subject: {
        type: String,
        default:''
    },
    allowed_time: {
        type: String,
        default: 60
    }
});


mongoose.model('Test', TestSchema);