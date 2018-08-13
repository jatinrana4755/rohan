var mongoose = require('mongoose');
var  Schema = mongoose.Schema;

var ScoreSchema = new Schema({

	test:{
    type:Schema.Types.ObjectId,
    ref:'Test'
  },

  user:{
		type:Schema.Types.ObjectId,
		ref:'User'
	},

  totalQuestions: {
      type: Number
  },

  wrong:{
    type: Number,
    default:0
  },
  
  date:{
    type: Date,
    default: Date.now
  },

  score: {
      type: Number,
      default:0
  }
    
});

mongoose.model('Score', ScoreSchema);













  