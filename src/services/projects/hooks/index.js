'use strict';

const globalHooks = require('../../../hooks');
const auth = require('feathers-authentication').hooks;
const hooks = require('feathers-hooks');


exports.before = {
  all: [
  auth.verifyToken(),
  auth.populateUser(),
  auth.restrictToAuthenticated(),
  //auth.restrictToOwner({ ownerField: '_id' })
  ],
  find: [],
  get: [],
  create: [
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
