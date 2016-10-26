'use strict';

// src/services/user/hooks/userprof.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html
/*
const defaults = {};

module.exports = function(options) {
  // options = Object.assign({}, defaults, options);

  return function(hook) {
  	// Get the profile service and `create` a new profile
    app.service('userprofiles').create({
      message: 'Welcome!!',
      milestones: 1,
    });
    //hook.userprof = true;
  };
};
*/

const app = feathers().configure(hooks());

module.exports = function(options) {
  return function(hook) {

  	    // The authenticated user
    const user = hook.params.user;
    const profService = app.service('userprofiles');
      
      profService.create({
      	userID: user._id,
      message: 'Welcome!!',
      milestones: 1,
    });
    console.log('User profile finally created! Feathers is awesome!');
  };
};