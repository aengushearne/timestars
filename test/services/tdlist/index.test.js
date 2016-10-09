'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('tdlist service', function() {
  it('registered the tdlists service', () => {
    assert.ok(app.service('tdlists'));
  });
});
