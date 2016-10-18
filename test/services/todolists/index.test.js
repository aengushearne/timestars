'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('todolists service', function() {
  it('registered the todo-lists service', () => {
    assert.ok(app.service('todolists'));
  });
});
