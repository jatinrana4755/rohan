var mongoose = require('mongoose');
var  Schema = mongoose.Schema;

var QuestionSchema = new Schema({

	test:{
		type:Schema.Types.ObjectId,
		ref:'Test'
	},

	question: {
      type: String,
      trim: true
    },

    choices: {A:String, B:String, C:String, D:String},
    
    answer: {
        type: String
    }
    
});


mongoose.model('Question', QuestionSchema);













  