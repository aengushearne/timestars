'use strict';

const service = require('feathers-mongoose');
const tasks = require('./tasks-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: tasks,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/tasks', service(options));

  // Get our initialize service to that we can bind hooks
  const tasksService = app.service('/tasks');

  // Set up our before hooks
  tasksService.before(hooks.before);

  // Set up our after hooks
  tasksService.after(hooks.after);
};
