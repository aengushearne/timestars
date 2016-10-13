'use strict';

const assert = require('assert');
const userProfile = require('../../../../src/services/users/hooks/user-profile.js');

describe('users userProfile hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    userProfile()(mockHook);

    assert.ok(mockHook.userProfile);
  });
});
