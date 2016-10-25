'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('userprofiles service', function() {
  it('registered the userprofiles service', () => {
    assert.ok(app.service('userprofiles'));
  });
});
