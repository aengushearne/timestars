'use strict';

const assert = require('assert');
const userprof = require('../../../../src/services/user/hooks/userprof.js');

describe('user userprof hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    userprof()(mockHook);

    assert.ok(mockHook.userprof);
  });
});
