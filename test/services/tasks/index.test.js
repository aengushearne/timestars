'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('tasks service', function() {
  it('registered the tasks service', () => {
    assert.ok(app.service('tasks'));
  });
});
