var express = require('express');
var testRouter = express.Router();
var mongoose = require('mongoose');
var testModel = mongoose.model('Test');
var scoreModel = mongoose.model('Score');
var questionModel = mongoose.model('Question');
var userModel = mongoose.model('User');
var verify = require('./../../middlewares/verify.js');
module.exports.controller = function(app){

	//route to get data of loggedin user
	testRouter.get('/me', verify, function(req, res){
		return res.send(req.decoded);
	});

	//route to get list of tests
	testRouter.get('/get-tests', verify, function(req, res){
		testModel.find({}, function(err, tests){
		if (err) {
				return res.status(400).send({
					message: err
				});
			} else {
				return res.json(tests);
			}
		});
	});

	//route to get the score of a test
	testRouter.get('/get-score/:id', verify, function(req, res){
		scoreModel.find({'_id':req.params.id})
					   .populate('test')
	                   .exec(function(error, score) {
	                   	if (error) {
	                   		return res.json(error);
	                   	}else{
	                		return res.json(score);
	                   	}
	            });
	});	

	//route to get the scores of a user
	testRouter.get('/get-user-score/:id', verify, function(req, res){
		scoreModel.find({user:req.params.id})
					   .populate('user')
					   .populate('test')
					   .sort([['date', -1]])
	                   .exec(function(error, tests) {
	                   	if (error) {
	                   		return res.json(error);
	                   	}else{
	                		return res.json(tests);
	                   	}
	            });
	});

	app.use('/test', testRouter);

}
