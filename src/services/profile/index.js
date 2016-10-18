'use strict';

const service = require('feathers-mongoose');
const profile = require('./profile-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: profile,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/profiles', service(options));

  // Get our initialize service to that we can bind hooks
  const profileService = app.service('/profiles');

  // Set up our before hooks
  profileService.before(hooks.before);

  // Set up our after hooks
  profileService.after(hooks.after);
};
