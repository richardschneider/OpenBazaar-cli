'use strict';

var app = require('../lib/app');
require('should');

describe('App', () => {
    it('should have options', () => {
       app.should.have.property('options');
    });

    it('should have a version', () => {
       app.should.have.property('version')
	       .and.equal('0.0.42');
    });

});
