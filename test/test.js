/* globals describe, it */

var hardCodedResponse = require('../index.js');      // eslint-disable-line no-unused-vars

describe('package', function() {
    describe('hard-coded-response', function() {
        // If there would be an error in require, the code would not reach this point
        it('should load fine using require', function(done) {
            done();
        });
    });
});
