'use strict';

const service = require('feathers-mongoose');
const toDoLists = require('./todolists-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: toDoLists,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/todolists', service(options));

  // Get our initialize service to that we can bind hooks
  const toDoListsService = app.service('/todolists');

  // Set up our before hooks
  toDoListsService.before(hooks.before);

  // Set up our after hooks
  toDoListsService.after(hooks.after);
};
