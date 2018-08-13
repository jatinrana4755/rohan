var express = require('express');
var userRouter = express.Router();
var mongoose = require('mongoose');
var userModel = mongoose.model('User');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
//library to send mail
var fireMail = require('./../../libs/mail.js');
module.exports.controller = function(app){

	//route to save signup data
	userRouter.post('/register', function(req, res){
		var newUser = new userModel(req.body);
		newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
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

	userRouter.post('/login', function(req, res){
		userModel.findOne({'email':req.body.email, 'isAdmin':false}, function(err, user){
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
	// route for sending mail with token
	userRouter.post('/forgot-password', function(req, res){
		 // generaing a hash token to validate user request	
		var token = crypto.randomBytes(20).toString('hex');
		userModel.findOne({ email: req.body.email }, function(err, user) {
        if (user == null) {
          res.send({message:"user not found"});
        }
        else{
        	user.resetPasswordToken = token;
        	user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
	        user.save(function(err) {
	         if (err) {
					res.send({message:err}); 
				}
				else{
					var mail = fireMail(req.body.email, 'jatinrana4755@gmail.com', 'Password Reset', 'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'http://localhost:3000/users/forgot-password' + token);
					mail.then(function(result){
						res.send({result:result, status:'success'});
					}).catch((error) => {
						res.send({error:error,status:'error'});
				    });
				}
	        });
	    	}
      });

	});

	// for changing password
	userRouter.post('/reset/:token', function(req, res){

		userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
	        if (!user) {
	          res.send({error:'Password reset token is invalid or has expired.'});
	        }else{

	        user.hash_password = bcrypt.hashSync(req.body.password, 10);
	        user.resetPasswordToken = undefined;
	        user.resetPasswordExpires = undefined;
	        user.save(function(err) {
	          if (err) {
	          	res.send({error:err});
	          }
	          else{
	          	res.send({message:'Password changed successfully, you can now login with new password!'});
	          }

	        });
	        }
	    });    
	});



	app.use('/users', userRouter);

}
