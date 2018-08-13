var mongoose = require('mongoose');
var  Schema = mongoose.Schema;

var SubjectSchema = new Schema({

	subjectName:{
        type: String,
        default:''
	}

	


    
});


mongoose.model('Subject', SubjectSchema);













  