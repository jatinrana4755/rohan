var express = require('express');
var adminRouter = express.Router();
var mongoose = require('mongoose');
var testModel = mongoose.model('Test');
var questionModel = mongoose.model('Question');
var userModel = mongoose.model('User');
var scoreModel = mongoose.model('Score');
var groupModel = mongoose.model('Group');


var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var verify = require('./../../middlewares/verify.js');
module.exports.controller = function(app){

		//route to save signup data
	adminRouter.post('/register', function(req, res){
		var newUser = new userModel();
		newUser.email = 'admin@admin.com';
		newUser.fullName = 'Admin';
		newUser.isAdmin = true;
		newUser.hash_password = bcrypt.hashSync('admin', 10);
		newUser.save(function(err, user) {
			if (err) {
				return res.status(400).send({
					message: err
				});
			} else {
				return res.json(user);
			}
		});
	});

	// route to perform login operation

	adminRouter.post('/login', function(req, res){
		userModel.findOne({'email':req.body.email, 'isAdmin':true}, function(err, user){
			if (err) throw err;
			if (!user) {
				res.status(401).json({ message: 'Authentication failed. User not found.' });
			} else if (user) {
				if (!user.comparePassword(req.body.password)) {
					res.status(401).json({ message: 'Authentication failed. Wrong password.' });
				} else {
					return res.json({token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id}, 'mysecret', {expiresIn : 86400}), fullName:user.fullName});
				}
			}
		});
	});

	//route to save test
	adminRouter.post('/save-test', verify, function(req, res){
		var newTest = new testModel();
		newTest.title = req.body.title;
		newTest.allowed_time = req.body.allowed_time;
		newTest.save(function(err, test) {
			if (err) {
				return res.status(400).send({
					message: err
				});
			} else {
				return res.json(test);
			}
		});
	});

	//route to get list of registered users
	adminRouter.get('/get-users', verify, function(req, res){
		userModel.find({}, function(err, users){
		if (err) {
				return res.status(400).send({
					message: err
				});
			} else {
				return res.json(users);
			}
		});
	});

	//route to get list of tests for admin panel 
	adminRouter.get('/get-tests', verify, function(req, res){
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
	//route to get test based on id
	adminRouter.get('/get-single-test/:id', verify, function(req, res){
		testModel.find({'_id':req.params.id}, function(err, test){
		if (err) {
				return res.status(400).send({
					message: err
				});
			} else {
				return res.json(test);
			}
		});
	});
		//route to add  question
		adminRouter.post('/add-group', function(req, res){
			var addGroup= new groupModel();
			addGroup.groupId = req.params.id;
			addGroup.groupName = req.body.groupName;
			addGroup.instructions = req.body.instructions;
			addGroup.questionNo = req.body.questionNo;
			addGroup.examDuration = req.body.examDuration;
			addGroup.validity = req.body.validity;
			addGroup.total_marks = req.body.total_marks;
			addGroup.positive_marks = req.body.positive_marks;
			addGroup.negative_marks = req.body.negative_marks;
			addGroup.price = req.body.price;
			
			
			
			
			
			
			addGroup.save(function(err, group) {
				if (err) {
					return res.status(400).send({
						message: err
					});
				} else {
					return res.json(group);
				}
			});	
		});
		adminRouter.get('/get-all',  function(req, res){
			groupModel.find({}, function(err, tests){
			if (err) {
					return res.status(400).send({
						message: err
					});
				} else {
					return res.json(tests);
				}
			});
		});

	//route to get question based on id
	adminRouter.get('/get-single-question/:id', verify, function(req, res){
		questionModel.find({'_id':req.params.id}, function(err, question){
		if (err) {
				return res.status(400).send({
					message: err
				});
			} else {
				return res.json(question);
			}
		});
	});

	//route to get list of questions for a particular test
	adminRouter.get('/get-questions/:id', verify, function(req, res){
		questionModel.find({'test':req.params.id}, function(err, questions){
		if (err) {
				return res.status(400).send({
					message: err
				});
			} else {
				return res.json(questions);
			}
		});
	});

	//route to save question
	adminRouter.post('/save-question/:id', verify, function(req, res){
		var newQuestion = new questionModel();
		newQuestion.test = req.params.id;
		newQuestion.question = req.body.question;
		newQuestion.answer = req.body.answer;
		newQuestion.choices = req.body.choice;
		newQuestion.save(function(err, question) {
			if (err) {
				return res.status(400).send({
					message: err
				});
			} else {
				return res.json(question);
			}
		});	
	});
	

	//route to update a test 
	adminRouter.post('/update-test/:id', verify, function(req, res){
		var updateData = req.body;
		testModel.update({'_id':req.params.id}, updateData, function(err, test){
			if (err) {
				return res.status(400).send({
					message: err
				});
			} else {
				return res.json({test:test, msg:"Test Updated Successfully"});
			}
		});	
	});	

	//route to update a question
	adminRouter.post('/update-question/:id', verify,  function(req, res){
		var updateData = req.body;
		questionModel.update({'_id':req.params.id}, updateData, function(err, question){
			if (err) {
				return res.status(400).send({
					message: err
				});
			} else {
				return res.json({question:question, msg:"Question Updated Successfully"});
			}
		});	
	});


	//route to delete test
	adminRouter.post('/test/delete/:id', verify , function(req, res){

		testModel.remove({'_id':req.params.id}, function(err, result){
			if (err) {
				return res.send(err);
			}
			else{
				return res.json({result:result, msg:"Test Deleted Successfully"});
			}
		});
	
	});


	//route to delete a question
	adminRouter.post('/question/delete/:id', verify , function(req, res){

		questionModel.remove({'_id':req.params.id}, function(err, result){
			if (err) {
				return res.send(err);
			}
			else{
				return res.json({result:result, msg:"Question Deleted Successfully"});
			}
		});
	
	});

	//route to get score of a user
	adminRouter.get('/get-user-score/:id', verify , function(req, res){
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

	app.use('/admin', adminRouter);

}
