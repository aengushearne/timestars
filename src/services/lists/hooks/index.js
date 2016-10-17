'use strict';

const listsProcess = require('./lists-process');

const globalHooks = require('../../../hooks');
const auth = require('feathers-authentication').hooks;
const hooks = require('feathers-hooks');


exports.before = {
  all: [
  //  auth.verifyToken(),
  //  auth.populateUser(),
  //  auth.restrictToAuthenticated()
  ],
  find: [],
  get: [],
  create: [
  //listsProcess(),
  globalHooks()
  ],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};