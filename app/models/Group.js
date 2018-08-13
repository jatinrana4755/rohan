'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let groupSchema = new Schema({
  groupId: {
    type:Schema.Types.ObjectId,
    ref:'groupId'
  },
  groupName: {
    type: String,
    default: ''
  },
  
  instructions: {
    type: String,
    default: ''
  },
  
  questionNo: {
    type: Number,
    default: 0
  },
  examDuration: {
    type: Number,
    default: 0
  },
  
  validity :{
    type:Number,
    default:0
  },
 
  total_marks :{
    type:Number,
    default:0
  },
  positive_marks :{
    type:Number,
    default:0
  },
  negative_marks :{
    type:Number,
    default:0
  },
  
  price :{
    type:Number,
    default:0
  },

  created: {
    type: Date,
    default: Date.now
}, 

lastModified: {
    type: Date,
    default: Date.now
}




})


mongoose.model('Group', groupSchema);