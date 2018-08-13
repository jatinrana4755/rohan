var mongoose = require('mongoose');
var Score = require('./../app/models/Score.js');
var scoreModel = mongoose.model('Score');
var events = require('events');
var eventEmitter = new events.EventEmitter();

module.exports = function(app, server){

	var io = require('socket.io').listen(server);

	io.on('connection', function(socket){
		//handling event to inser a score
		socket.on('insertScore', function(data){
			var newScore = new scoreModel();
	 		newScore.test = data.test;
	  		newScore.user = data.user;
	  		newScore.totalQuestions = data.totalQuestions;
	  		newScore.save(function(err, info) {
		    	if (err) {
		      		console.log(err);
		    	} else {
		    		newScore_id = info._id;
		    		socket.emit('getScore', {
						id:newScore_id
					});
		    	}
	  		});
		});

		//handling event to update the score through out the test

		socket.on('updateScore', function(data){

			scoreModel.findOneAndUpdate({'_id':data.test_id}, {score:data.score,wrong:data.wrong}, function(err, result){
				if (err) {
					console.log(err);
				}
				else{
					console.log(result);
				}
			});
		});

		console.log('user connected');

	});
}

