'use strict';

// tasks-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tasksSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  totalTime: { type: Number , 'default': 0 },
  startTime: { type: Date },
  endTime: { type: Date },
  due: { type: Date },
  isBillable: { type: Boolean, default: false },
  rate: { type: Number, 'default': 0 },
  isMilestone: { type: Boolean, default: false },
  milestoneName: { type: String },
  projID: { type: String },
  userID: { type: String },

  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const tasksModel = mongoose.model('tasks', tasksSchema);

module.exports = tasksModel;