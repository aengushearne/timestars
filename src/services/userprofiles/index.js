'use strict';

const service = require('feathers-mongoose');
const userprofiles = require('./userprofiles-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: userprofiles,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/userprofiles', service(options));

  // Get our initialize service to that we can bind hooks
  const userprofilesService = app.service('/userprofiles');

  // Set up our before hooks
  userprofilesService.before(hooks.before);

  // Set up our after hooks
  userprofilesService.after(hooks.after);
};
