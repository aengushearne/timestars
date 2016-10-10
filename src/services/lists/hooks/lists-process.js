'use strict';

// src/services/message/hooks/process.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

module.exports = function(options) {
  return function(hook) {

    // The authenticated user
    const user = hook.params.user;
    // The actual message text
    const todo = hook.data.todo
      // Todoitems can't be longer than 400 characters
      .substring(0, 64)
      // Do some basic HTML escaping
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const completed = hook.data.completed;

    // Override the original data
    hook.data = {
      todo,
      completed,
      // Set the user id
      userId: user._id,
      // Add the current time via `getTime`
      createdAt: new Date().getTime()
    };

  };
};