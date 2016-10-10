'use strict';

const assert = require('assert');
const listsProcess = require('../../../../src/services/lists/hooks/lists-process.js');

describe('lists listsProcess hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    listsProcess()(mockHook);

    assert.ok(mockHook.listsProcess);
  });
});
