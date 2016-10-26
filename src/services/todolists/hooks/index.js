'use strict';

const globalHooks = require('../../../hooks');
const auth = require('feathers-authentication').hooks;
const hooks = require('feathers-hooks');


exports.before = {
  all: [
  auth.verifyToken(),
  auth.populateUser(),
  auth.restrictToAuthenticated()
  ],
  find: [
  auth.queryWithCurrentUser({ idField: '_id', as: 'userID' })
  ],
  get: [
  auth.restrictToOwner({ idField: '_id', ownerField: 'userID' })
  ],
  create: [
  globalHooks()
  ],
  update: [
  auth.restrictToOwner({ idField: '_id', ownerField: 'userID' })
  ],
  patch: [
  auth.restrictToOwner({ idField: '_id', ownerField: 'userID' })
  ],
  remove: [
  auth.restrictToOwner({ idField: '_id', ownerField: 'userID' })
  ]
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