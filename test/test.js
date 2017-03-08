/* globals describe, it, beforeEach */

var hardCodedResponse = require('../index.js');      // eslint-disable-line no-unused-vars

var httpMocks = require('node-mocks-http');

var request, response;

describe('package', function() {
    describe('hard-coded-response', function() {
        // If there would be an error in require, the code would not reach this point
        it('should load fine using require', function(done) {
            done();
        });
    });

    describe('hard-coded-response', function() {
        beforeEach(function(done) {
            // Before each test, reset the REQUEST and RESPONSE variables to be sent into the middleware
            request = httpMocks.createRequest({
                method: 'GET',
                url: '/dummy'
            });
            response = httpMocks.createResponse();
            response.locals = [];

            done();
        });

        it('should pass-through a request which does not match the pattern', function(done) {
            var mw = hardCodedResponse({ conditions: [{ pattern: 'pattern-which-does-not-match' }]});

            mw(request, response, function next(error) {
                if (error) { throw new Error('Expected not to receive an error'); }
                done();
            });
        });
    });
});
