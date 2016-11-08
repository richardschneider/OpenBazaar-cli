'use strict';

var config = require('../lib//server-config');
require('should');

describe('server-config', () => {
    it('should have a path', () => {
       config.should.have.property('path');
    });

});
