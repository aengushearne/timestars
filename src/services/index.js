'use strict';
const profile = require('./profile');
const tasks = require('./tasks');
const projects = require('./projects');
const lists = require('./lists');
const authentication = require('./authentication');
const user = require('./user');

module.exports = function() {
  const app = this;


  app.configure(authentication);
  app.configure(user);
  app.configure(lists);
  app.configure(projects);
  app.configure(tasks);
  app.configure(profile);
};
