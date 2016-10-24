'use strict';

// todolists-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toDoListsSchema = new Schema({
  todo: { type: String, required: true },
  completed: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  completedDate: { type: Date },
  due: { type: Date },
  taskID: { type: String },
  userID: { type: String },

  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const toDoListsModel = mongoose.model('todolists',toDoListsSchema);

module.exports = toDoListsModel;