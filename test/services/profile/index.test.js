'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('profile service', function() {
  it('registered the profiles service', () => {
    assert.ok(app.service('profiles'));
  });
});
