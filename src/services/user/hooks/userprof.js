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
app.service('users').before({
 create(hook) {
   return app.service('profiles').create(hook.data.profile, hook.params)
     .then(profile => {
       // link by id instead
       hook.data.profile = profile._id;

       return hook;
     });
 }
});