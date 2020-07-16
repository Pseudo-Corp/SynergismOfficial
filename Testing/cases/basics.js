// Provides our assertion library - the set of tools used to judge if the code is working correctly.
var assert = chai.assert;

// This test-specification format is due to use of Mocha.
// describe - creates a named grouping of tests.  May be nested.
// it - a single unit test.

describe("Basic tests", function() {
    // Runs this code once for the entire test grouping BEFORE any tests run
    before(function(done) {
        this.timeout(3000); // 3 seconds.
        fixture.setBase('');
        // Loads the actual test page.
        fixture.load("/index.html");

        window.setTimeout(function() {
            // Use of the optional parameter 'done' indicates that this is asynchronous.
            // We call done() to tell Mocha that setup is complete.
            done();
        }, 2500); // We give the page 2.5 seconds to load as a safety margin.
    });

    // Runs this code once BEFORE each test.
    beforeEach(function() {

    });

    after(function() {
        fixture.cleanup();
    });

    afterEach(function() {

    });

    it("loaded", function() {
        assert.isOk(player);
    })
});