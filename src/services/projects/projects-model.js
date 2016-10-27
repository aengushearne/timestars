'use strict';

// projects-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectsSchema = new Schema({
  title: { type: String, required: true, maxlength: 24 },
  completed: { type: Boolean, default: false },
  totalHours: { type: Number, 'default': 0 },
  totalBillable: { type: Number, 'default': 0 },
  startDate: { type: Date, 'default': Date.now },
  endDate: { type: Date },
  userID: { type: String },
  
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const projectsModel = mongoose.model('projects', projectsSchema);

module.exports = projectsModel;