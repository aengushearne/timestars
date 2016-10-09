'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('points service', function() {
  it('registered the points service', () => {
    assert.ok(app.service('points'));
  });
});
