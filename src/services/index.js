'use strict';
const userprofiles = require('./userprofiles');
const tasks = require('./tasks');
const projects = require('./projects');
const toDoLists = require('./todolists');
const authentication = require('./authentication');
const user = require('./user');
const mongoose = require('mongoose');
module.exports = function() {
  const app = this;

  mongoose.connect(app.get('mongodb'));
  mongoose.Promise = global.Promise;

  app.configure(authentication);
  app.configure(user);
  app.configure(toDoLists);
  app.configure(projects);
  app.configure(tasks);
  app.configure(userprofiles);
};
