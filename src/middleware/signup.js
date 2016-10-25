'use strict';

module.exports = function(app) {
  return function(req, res, next) {
    const body = req.body;

    // Get the user service and `create` a new user
    app.service('users').create({
      email: body.email,
      password: body.password
    })
    // Then redirect to the login page
    .then(user => {
      //console.log(user);
      let uID = user._id;
      console.log('uID: '+uID);
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
      res.redirect('/login.html');
    }
    )
    // On errors, just call our error middleware
    .catch(next);
  };
};