'use strict';

// profile-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  text: { type: String, required: true },
  userID: { type: String },
  
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const profileModel = mongoose.model('profile', profileSchema);

module.exports = profileModel;