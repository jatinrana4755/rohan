var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var  Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  mobile: {
    type: String,
    trim: true
  },
  hash_password: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default :false
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});

UserSchema.plugin(uniqueValidator);


UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash_password);
};


mongoose.model('User', UserSchema);